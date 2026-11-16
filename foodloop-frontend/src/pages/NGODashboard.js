import { useEffect, useState, useCallback } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";
import "../styles/NGODashboard.css";

function NGODashboard() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("foodloopUser")));

  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [assignments, setAssignments] = useState({});

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDonation, setSelectedDonation] = useState(null);

  const [requestForm, setRequestForm] = useState({
    requestedQuantity: "",
    requestMessage: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadAssignmentsForRequests = async (requestList) => {
    const acceptedRequests = requestList.filter((r) => r.status === "ACCEPTED");
    const map = {};
    await Promise.all(
      acceptedRequests.map(async (req) => {
        try {
          const res = await api.get(`/assignments/request/${req.requestId}`);
          if (res.data && res.data.assignmentId) {
            map[req.requestId] = res.data;
          }
        } catch {
          // No assignment
        }
      })
    );
    setAssignments(map);
  };

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      // Check current user profile to refresh verification status
      try {
        const profileRes = await api.get("/users/profile");
        if (profileRes.data) {
          const updated = { ...user, ...profileRes.data };
          setUser(updated);
          localStorage.setItem("foodloopUser", JSON.stringify(updated));
        }
      } catch {
        // Keep cached user
      }

      const results = await Promise.allSettled([
        api.get("/donations/available"),
        api.get(`/requests/ngo/${user.userId}`),
        api.get(`/notifications/user/${user.userId}`),
      ]);

      if (results[0].status === "fulfilled") {
        setDonations(results[0].value.data);
      } else {
        setError("Unable to load available food donations.");
      }

      if (results[1].status === "fulfilled") {
        const reqData = results[1].value.data;
        setRequests(reqData);
        loadAssignmentsForRequests(reqData);
      }

      if (results[2].status === "fulfilled") {
        setNotifications(results[2].value.data);
      }
    } catch {
      setError("An unexpected error occurred loading your dashboard.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.userId]);

  useEffect(() => {
    if (user?.userId && user?.role === "NGO") {
      loadDashboard();
    }
  }, [loadDashboard, user?.role, user?.userId]);

  const openRequestForm = (donation) => {
    if (!user.verified) {
      setError("Your NGO account is pending Admin verification. You will be able to request food once verified.");
      return;
    }
    setSelectedDonation(donation);
    setRequestForm({
      requestedQuantity: "",
      requestMessage: "",
    });
    setError("");
    setMessage("");
  };

  const handleRequestChange = (e) => {
    setRequestForm({
      ...requestForm,
      [e.target.name]: e.target.value,
    });
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const quantity = Number(requestForm.requestedQuantity);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      setError("Enter a valid positive whole-number quantity.");
      return;
    }

    if (quantity > selectedDonation.quantity) {
      setError("Requested quantity cannot exceed available donation quantity.");
      return;
    }

    try {
      await api.post(`/requests?ngoId=${user.userId}`, {
        donationId: selectedDonation.donationId,
        requestedQuantity: quantity,
        requestMessage: requestForm.requestMessage,
      });

      setSelectedDonation(null);
      setMessage("Food request submitted successfully! Waiting for donor approval.");
      await loadDashboard();
      setActiveTab("requests");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to submit food request."
      );
    }
  };

  const cancelRequest = async (requestId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this food request?"
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      await api.put(`/requests/${requestId}/cancel?ngoId=${user.userId}`);
      setMessage("Food request cancelled successfully.");
      await loadDashboard();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to cancel this request."
      );
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(
        `/notifications/${notificationId}/read?userId=${user.userId}`
      );

      setNotifications((previous) =>
        previous.map((notification) =>
          notification.notificationId === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch {
      setError("Unable to mark notification as read.");
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not available";
    return new Date(date).toLocaleString();
  };

  const pendingCount = requests.filter(
    (request) => request.status === "PENDING"
  ).length;

  const acceptedCount = requests.filter(
    (request) => request.status === "ACCEPTED"
  ).length;

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "NGO") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="ngo-dashboard">
      <aside className="ngo-sidebar">
        <div className="ngo-brand">FoodLoop</div>

        <div className="ngo-user">
          <div className="ngo-avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <strong>{user.name}</strong>
            <span>{user.organizationName || "NGO Organization"}</span>
          </div>
        </div>

        <nav className="ngo-menu">
          <button
            className={activeTab === "overview" ? "active" : ""}
            onClick={() => {
              setSelectedDonation(null);
              setActiveTab("overview");
            }}
          >
            <span>▦</span> Overview
          </button>

          <button
            className={activeTab === "browse" ? "active" : ""}
            onClick={() => {
              setSelectedDonation(null);
              setActiveTab("browse");
            }}
          >
            <span>⌕</span> Browse Food
          </button>

          <button
            className={activeTab === "requests" ? "active" : ""}
            onClick={() => {
              setSelectedDonation(null);
              setActiveTab("requests");
            }}
          >
            <span>▤</span> My Requests
          </button>

          <button
            className={activeTab === "notifications" ? "active" : ""}
            onClick={() => {
              setSelectedDonation(null);
              setActiveTab("notifications");
            }}
          >
            <span>♧</span> Notifications
            {unreadCount > 0 && (
              <span className="ngo-notification-count">
                {unreadCount}
              </span>
            )}
          </button>
        </nav>

        <button className="ngo-refresh" onClick={loadDashboard}>
          ↻ Refresh Data
        </button>
      </aside>

      <main className="ngo-main">
        <header className="ngo-header">
          <div>
            <h1>
              {activeTab === "overview" && "NGO Dashboard"}
              {activeTab === "browse" && "Browse Available Food"}
              {activeTab === "requests" && "My Food Requests"}
              {activeTab === "notifications" && "Notifications"}
            </h1>
            <p>Welcome back, {user.name}!</p>
          </div>

          <div className="ngo-header-right">
            <span
              className="ngo-role-tag"
              style={{
                backgroundColor: user.verified ? "#dcfce7" : "#fef3c7",
                color: user.verified ? "#15803d" : "#b45309",
                border: user.verified ? "1px solid #86efac" : "1px solid #fde68a",
              }}
            >
              {user.verified ? "VERIFIED NGO" : "PENDING VERIFICATION"}
            </span>
            <button onClick={loadDashboard}>↻ Refresh</button>
          </div>
        </header>

        {!user.verified && (
          <div
            style={{
              padding: "16px 20px",
              background: "#fffbeb",
              border: "1px solid #fde68a",
              borderRadius: "8px",
              marginBottom: "20px",
              color: "#92400e",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span style={{ fontSize: "24px" }}>⚠️</span>
            <div>
              <strong style={{ display: "block", marginBottom: "4px" }}>
                Account Pending Admin Verification
              </strong>
              <span>
                Your organization account is being reviewed by the FoodLoop administration team.
                You can browse available food donations right now; requesting food will be unlocked as soon as an Admin approves your account.
              </span>
            </div>
          </div>
        )}

        {error && <div className="ngo-alert error">{error}</div>}
        {message && <div className="ngo-alert success">{message}</div>}

        {loading ? (
          <div className="ngo-loading">Loading NGO dashboard...</div>
        ) : (
          <>
            {activeTab === "overview" && (
              <section>
                <div className="ngo-welcome-banner">
                  <div>
                    <h2>Help us fight food waste!</h2>
                    <p>
                      Find surplus food donations and request meals for
                      communities in need.
                    </p>
                  </div>

                  <button onClick={() => setActiveTab("browse")}>
                    Browse Available Food
                  </button>
                </div>

                <div className="ngo-stat-grid">
                  <div className="ngo-stat-card">
                    <span>Available Donations</span>
                    <h2>{donations.length}</h2>
                    <small>Food ready for requests</small>
                  </div>

                  <div className="ngo-stat-card">
                    <span>Total Requests</span>
                    <h2>{requests.length}</h2>
                    <small>Requests submitted</small>
                  </div>

                  <div className="ngo-stat-card">
                    <span>Pending Requests</span>
                    <h2>{pendingCount}</h2>
                    <small>Waiting for donor response</small>
                  </div>

                  <div className="ngo-stat-card">
                    <span>Accepted Requests</span>
                    <h2>{acceptedCount}</h2>
                    <small>Approved by donors</small>
                  </div>
                </div>

                <div className="ngo-section">
                  <div className="ngo-section-heading">
                    <h2>Recent Food Donations</h2>
                    <button onClick={() => setActiveTab("browse")}>
                      View All
                    </button>
                  </div>

                  {donations.length === 0 ? (
                    <p className="ngo-empty">
                      No available food donations currently.
                    </p>
                  ) : (
                    <div className="ngo-table-wrapper">
                      <table className="ngo-table">
                        <thead>
                          <tr>
                            <th>Food Name</th>
                            <th>Donor</th>
                            <th>Quantity</th>
                            <th>Expiry</th>
                          </tr>
                        </thead>
                        <tbody>
                          {donations.slice(0, 5).map((donation) => (
                            <tr key={donation.donationId}>
                              <td>{donation.foodName}</td>
                              <td>{donation.donorName}</td>
                              <td>
                                {donation.quantity} {donation.quantityUnit}
                              </td>
                              <td>{formatDate(donation.expiryTime)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="ngo-section">
                  <h2>Recent Requests</h2>

                  {requests.length === 0 ? (
                    <p className="ngo-empty">You haven't requested food yet.</p>
                  ) : (
                    <div className="ngo-table-wrapper">
                      <table className="ngo-table">
                        <thead>
                          <tr>
                            <th>Food</th>
                            <th>Quantity</th>
                            <th>Status</th>
                            <th>Requested At</th>
                          </tr>
                        </thead>
                        <tbody>
                          {requests.slice(0, 5).map((request) => (
                            <tr key={request.requestId}>
                              <td>{request.foodName}</td>
                              <td>{request.requestedQuantity}</td>
                              <td>
                                <span className={`ngo-status ${String(request.status).toLowerCase()}`}>
                                  {request.status}
                                </span>
                              </td>
                              <td>{formatDate(request.requestedAt)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </section>
            )}

            {activeTab === "browse" && (
              <section className="ngo-section">
                <div className="ngo-section-heading">
                  <div>
                    <h2>Available Food Donations</h2>
                    <p>Choose suitable food and submit a request.</p>
                  </div>
                  <span className="ngo-total">
                    {donations.length} Available
                  </span>
                </div>

                {donations.length === 0 ? (
                  <p className="ngo-empty">
                    No available food donations found at this time. Check back soon!
                  </p>
                ) : (
                  <div className="ngo-food-grid">
                    {donations.map((donation) => (
                      <article
                        className="ngo-food-card"
                        key={donation.donationId}
                      >
                        <div className="ngo-food-top">
                          <span>
                            {donation.foodCategory || "FOOD"}
                          </span>
                          <span className="ngo-available">
                            AVAILABLE
                          </span>
                        </div>

                        <h3>{donation.foodName}</h3>
                        <p className="ngo-food-description">
                          {donation.foodDescription ||
                            "No description provided."}
                        </p>

                        <div className="ngo-food-details">
                          <p>
                            <strong>Donor:</strong> {donation.donorName}
                          </p>
                          <p>
                            <strong>Quantity:</strong> {donation.quantity}{" "}
                            {donation.quantityUnit}
                          </p>
                          <p>
                            <strong>Pickup:</strong> {donation.pickupAddress}
                          </p>
                          <p>
                            <strong>Expiry:</strong>{" "}
                            {formatDate(donation.expiryTime)}
                          </p>
                        </div>

                        <button
                          className="ngo-request-button"
                          onClick={() => openRequestForm(donation)}
                          title={!user.verified ? "Verification required to request food" : ""}
                        >
                          Request Food
                        </button>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}

            {activeTab === "requests" && (
              <section className="ngo-section">
                <h2>My Donation Requests</h2>
                <p>Track the status of your submitted requests, volunteer pickups and deliveries.</p>

                {requests.length === 0 ? (
                  <p className="ngo-empty">No requests found.</p>
                ) : (
                  <div className="ngo-table-wrapper">
                    <table className="ngo-table">
                      <thead>
                        <tr>
                          <th>Food</th>
                          <th>Requested Quantity</th>
                          <th>Message</th>
                          <th>Status</th>
                          <th>Volunteer Delivery Status</th>
                          <th>Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requests.map((request) => {
                          const assignment = assignments[request.requestId];
                          return (
                            <tr key={request.requestId}>
                              <td>{request.foodName}</td>
                              <td>{request.requestedQuantity}</td>
                              <td>{request.requestMessage || "—"}</td>
                              <td>
                                <span className={`ngo-status ${String(request.status).toLowerCase()}`}>
                                  {request.status}
                                </span>
                              </td>

                              <td>
                                {assignment ? (
                                  <div style={{ fontSize: "12px", lineHeight: "1.4" }}>
                                    <div><strong>{assignment.volunteerName}</strong> ({assignment.volunteerPhone || "Volunteer"})</div>
                                    <div style={{ color: assignment.deliveryStatus === "DELIVERED" ? "#16834a" : "#2563eb" }}>
                                      {assignment.deliveryStatus === "DELIVERED"
                                        ? "Delivered to your NGO"
                                        : assignment.pickupStatus === "COLLECTED"
                                        ? "Collected • In Transit"
                                        : "Pickup Scheduled"}
                                    </div>
                                  </div>
                                ) : request.status === "ACCEPTED" ? (
                                  <span style={{ fontSize: "12px", color: "#d97706" }}>
                                    Awaiting volunteer assignment
                                  </span>
                                ) : (
                                  "—"
                                )}
                              </td>

                              <td>{formatDate(request.requestedAt)}</td>
                              <td>
                                {request.status === "PENDING" ? (
                                  <button
                                    className="ngo-cancel-button"
                                    onClick={() =>
                                      cancelRequest(request.requestId)
                                    }
                                  >
                                    Cancel
                                  </button>
                                ) : (
                                  "—"
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            {activeTab === "notifications" && (
              <section className="ngo-section">
                <h2>Your Notifications</h2>
                <p>Updates about your food requests and deliveries.</p>

                {notifications.length === 0 ? (
                  <p className="ngo-empty">No notifications found.</p>
                ) : (
                  <div className="ngo-notification-list">
                    {notifications.map((notification) => (
                      <article
                        key={notification.notificationId}
                        className={`ngo-notification ${
                          notification.isRead ? "read" : "unread"
                        }`}
                      >
                        <div>
                          <h3>{notification.title}</h3>
                          <p>{notification.message}</p>
                          <small>
                            {formatDate(notification.createdAt)}
                          </small>
                        </div>

                        {!notification.isRead && (
                          <button
                            onClick={() =>
                              markAsRead(notification.notificationId)
                            }
                          >
                            Mark as Read
                          </button>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </main>

      {selectedDonation && (
        <div className="ngo-modal-overlay">
          <form className="ngo-modal" onSubmit={submitRequest}>
            <div className="ngo-modal-heading">
              <div>
                <h2>Request Food</h2>
                <p>{selectedDonation.foodName}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDonation(null)}
              >
                ✕
              </button>
            </div>

            <div className="ngo-modal-info">
              Available quantity: {selectedDonation.quantity}{" "}
              {selectedDonation.quantityUnit} • From: {selectedDonation.donorName}
            </div>

            <label>Requested Quantity *</label>
            <input
              type="number"
              name="requestedQuantity"
              min="1"
              max={selectedDonation.quantity}
              value={requestForm.requestedQuantity}
              onChange={handleRequestChange}
              placeholder="Enter quantity"
              required
            />

            <label>Request Message</label>
            <textarea
              name="requestMessage"
              value={requestForm.requestMessage}
              onChange={handleRequestChange}
              placeholder="Explain how your NGO will distribute this food..."
              rows="4"
            />

            <div className="ngo-modal-actions">
              <button
                type="button"
                className="ngo-modal-cancel"
                onClick={() => setSelectedDonation(null)}
              >
                Cancel
              </button>
              <button type="submit" className="ngo-modal-submit">
                Submit Request
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default NGODashboard;
