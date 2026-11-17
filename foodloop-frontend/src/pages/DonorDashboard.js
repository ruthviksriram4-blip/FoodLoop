import { useEffect, useState, useCallback } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";
import FoodLoopLogo from "../components/FoodLoopLogo";
import "../styles/DonorDashboard.css";

function DonorDashboard() {
  const user = JSON.parse(localStorage.getItem("foodloopUser"));

  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [assignments, setAssignments] = useState({});

  const [activeTab, setActiveTab] = useState("overview");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [assigningRequestId, setAssigningRequestId] = useState(null);
  const [selectedVolunteerId, setSelectedVolunteerId] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);

  const emptyForm = {
    foodName: "",
    foodDescription: "",
    foodCategory: "VEGETARIAN",
    quantity: "",
    quantityUnit: "PACKETS",
    preparedAt: "",
    expiryTime: "",
    pickupAddress: "",
  };

  const [formData, setFormData] = useState(emptyForm);

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
          // No assignment yet
        }
      })
    );
    setAssignments(map);
  };

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const results = await Promise.allSettled([
        api.get(`/donations/donor/${user.userId}`),
        api.get(`/requests/donor/${user.userId}`),
        api.get(`/notifications/user/${user.userId}`),
        api.get("/users/volunteers"),
      ]);

      if (results[0].status === "fulfilled") {
        setDonations(results[0].value.data);
      } else {
        setError("Unable to load donations.");
      }

      if (results[1].status === "fulfilled") {
        const reqData = results[1].value.data;
        setRequests(reqData);
        loadAssignmentsForRequests(reqData);
      }

      if (results[2].status === "fulfilled") {
        setNotifications(results[2].value.data);
      }

      if (results[3].status === "fulfilled") {
        setVolunteers(results[3].value.data);
      }
    } catch {
      setError("An unexpected error occurred loading your dashboard.");
    } finally {
      setLoading(false);
    }
  }, [user?.userId]);

  useEffect(() => {
    if (user?.userId && user?.role === "DONOR") {
      loadDashboard();
    }
  }, [loadDashboard, user?.role, user?.userId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const payload = {
      ...formData,
      quantity: Number(formData.quantity),
      preparedAt: formData.preparedAt ? formData.preparedAt : null,
    };

    try {
      if (editingId) {
        await api.put(`/donations/${editingId}`, payload);
        setMessage("Food donation updated successfully.");
      } else {
        await api.post(`/donations?donorId=${user.userId}`, payload);
        setMessage("Food donation added successfully.");
      }

      setFormData(emptyForm);
      setEditingId(null);
      await loadDashboard();
      setActiveTab("donations");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save donation. Please check the details."
      );
    }
  };

  const handleEdit = (donation) => {
    setEditingId(donation.donationId);

    setFormData({
      foodName: donation.foodName || "",
      foodDescription: donation.foodDescription || "",
      foodCategory: donation.foodCategory || "VEGETARIAN",
      quantity: donation.quantity || "",
      quantityUnit: donation.quantityUnit || "PACKETS",
      preparedAt: donation.preparedAt ? donation.preparedAt.slice(0, 16) : "",
      expiryTime: donation.expiryTime ? donation.expiryTime.slice(0, 16) : "",
      pickupAddress: donation.pickupAddress || "",
    });

    setMessage("");
    setError("");
    setActiveTab("add");
  };

  const handleDelete = async (donationId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this food donation?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/donations/${donationId}`);
      setMessage("Food donation deleted successfully.");
      await loadDashboard();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete donation."
      );
    }
  };

  const handleRequestDecision = async (requestId, decision) => {
    setError("");
    setMessage("");

    try {
      await api.put(
        `/requests/${requestId}/${decision}?donorId=${user.userId}`
      );

      setMessage(
        decision === "accept"
          ? "NGO request accepted successfully! You can now assign a volunteer below."
          : "NGO request rejected successfully."
      );

      await loadDashboard();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Unable to ${decision} the NGO request.`
      );
    }
  };

  const handleAssignVolunteer = async (requestId) => {
    if (!selectedVolunteerId) {
      setError("Please select a volunteer from the list.");
      return;
    }

    setAssignLoading(true);
    setError("");
    setMessage("");

    try {
      await api.post("/assignments", {
        requestId: requestId,
        volunteerId: Number(selectedVolunteerId),
      });

      setMessage("Volunteer assigned successfully! Pickup details notified.");
      setAssigningRequestId(null);
      setSelectedVolunteerId("");
      await loadDashboard();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to assign volunteer."
      );
    } finally {
      setAssignLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
    setMessage("");
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

  const availableCount = donations.filter(
    (item) => item.status === "AVAILABLE"
  ).length;

  const deliveredCount = donations.filter(
    (item) => item.status === "DELIVERED"
  ).length;

  const unreadCount = notifications.filter(
    (item) => !item.isRead
  ).length;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "DONOR") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="donor-dashboard">
      <aside className="donor-sidebar">
        <div className="sidebar-brand">
          <FoodLoopLogo size={32} variant="dark" />
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <strong>{user.name}</strong>
            <span>Food Donor</span>
          </div>
        </div>

        <nav className="donor-menu">
          <button
            className={activeTab === "overview" ? "active" : ""}
            onClick={() => setActiveTab("overview")}
          >
            <span>▦</span> Overview
          </button>

          <button
            className={activeTab === "donations" ? "active" : ""}
            onClick={() => setActiveTab("donations")}
          >
            <span>▤</span> My Donations
          </button>

          <button
            className={activeTab === "add" ? "active" : ""}
            onClick={() => {
              cancelEdit();
              setActiveTab("add");
            }}
          >
            <span>＋</span> Add Donation
          </button>

          <button
            className={activeTab === "requests" ? "active" : ""}
            onClick={() => setActiveTab("requests")}
          >
            <span>⇄</span> NGO Requests
          </button>

          <button
            className={activeTab === "notifications" ? "active" : ""}
            onClick={() => setActiveTab("notifications")}
          >
            <span>♧</span> Notifications
            {unreadCount > 0 && (
              <span className="notification-count">{unreadCount}</span>
            )}
          </button>
        </nav>

        <button className="sidebar-refresh" onClick={loadDashboard}>
          ↻ Refresh Data
        </button>
      </aside>

      <main className="donor-main">
        <header className="donor-header">
          <div>
            <h1>
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "donations" && "My Donations"}
              {activeTab === "add" &&
                (editingId ? "Edit Donation" : "Add Food Donation")}
              {activeTab === "requests" && "NGO Requests"}
              {activeTab === "notifications" && "Notifications"}
            </h1>
            <p>Welcome back, {user.name}!</p>
          </div>

          <div className="donor-header-right">
            <span className="donor-role">DONOR</span>
            <button className="refresh-button" onClick={loadDashboard}>
              ↻ Refresh
            </button>
          </div>
        </header>

        {error && <div className="dashboard-alert error">{error}</div>}
        {message && <div className="dashboard-alert success">{message}</div>}

        {loading ? (
          <div className="dashboard-loading">Loading your dashboard...</div>
        ) : (
          <>
            {activeTab === "overview" && (
              <section>
                <div className="welcome-banner">
                  <div>
                    <h2>Make a difference today!</h2>
                    <p>
                      Your surplus food can become someone's next meal.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      cancelEdit();
                      setActiveTab("add");
                    }}
                  >
                    + Add Food Donation
                  </button>
                </div>

                <div className="donor-stat-grid">
                  <div className="donor-stat-card">
                    <span>Total Donations</span>
                    <h2>{donations.length}</h2>
                    <small>All your food listings</small>
                  </div>

                  <div className="donor-stat-card">
                    <span>Available Donations</span>
                    <h2>{availableCount}</h2>
                    <small>Ready for NGO requests</small>
                  </div>

                  <div className="donor-stat-card">
                    <span>Delivered Donations</span>
                    <h2>{deliveredCount}</h2>
                    <small>Successfully delivered</small>
                  </div>

                  <div className="donor-stat-card">
                    <span>Unread Notifications</span>
                    <h2>{unreadCount}</h2>
                    <small>Updates waiting for you</small>
                  </div>
                </div>

                <div className="dashboard-section">
                  <div className="section-heading">
                    <h2>Recent Donations</h2>
                    <button onClick={() => setActiveTab("donations")}>
                      View All
                    </button>
                  </div>

                  {donations.length === 0 ? (
                    <p className="empty-state">
                      You haven't added any donations yet.
                    </p>
                  ) : (
                    <div className="donor-table-wrapper">
                      <table className="donor-table">
                        <thead>
                          <tr>
                            <th>Food Name</th>
                            <th>Quantity</th>
                            <th>Status</th>
                            <th>Expiry</th>
                          </tr>
                        </thead>
                        <tbody>
                          {donations.slice(0, 5).map((donation) => (
                            <tr key={donation.donationId}>
                              <td>{donation.foodName}</td>
                              <td>
                                {donation.quantity} {donation.quantityUnit}
                              </td>
                              <td>
                                <span className={`status-badge ${String(donation.status).toLowerCase()}`}>
                                  {donation.status}
                                </span>
                              </td>
                              <td>{formatDate(donation.expiryTime)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </section>
            )}

            {activeTab === "add" && (
              <section className="dashboard-section">
                <form className="donation-form" onSubmit={handleSubmit}>
                  <div className="form-heading">
                    <h2>
                      {editingId
                        ? "Update Food Details"
                        : "Enter Food Donation Details"}
                    </h2>
                    <p>
                      Provide accurate food, quantity and pickup information.
                    </p>
                  </div>

                  <div className="form-grid">
                    <div className="form-field">
                      <label>Food Name *</label>
                      <input
                        name="foodName"
                        value={formData.foodName}
                        onChange={handleChange}
                        placeholder="Example: Vegetable Biryani"
                        required
                      />
                    </div>

                    <div className="form-field">
                      <label>Food Category *</label>
                      <select
                        name="foodCategory"
                        value={formData.foodCategory}
                        onChange={handleChange}
                        required
                      >
                        <option value="VEGETARIAN">Vegetarian</option>
                        <option value="NON_VEGETARIAN">Non-Vegetarian</option>
                        <option value="VEGAN">Vegan</option>
                        <option value="DAIRY">Dairy</option>
                        <option value="BAKERY">Bakery</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>

                    <div className="form-field full-width">
                      <label>Food Description</label>
                      <textarea
                        name="foodDescription"
                        value={formData.foodDescription}
                        onChange={handleChange}
                        placeholder="Describe the food..."
                        rows="3"
                      />
                    </div>

                    <div className="form-field">
                      <label>Quantity *</label>
                      <input
                        type="number"
                        name="quantity"
                        min="1"
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="Enter quantity"
                        required
                      />
                    </div>

                    <div className="form-field">
                      <label>Quantity Unit *</label>
                      <select
                        name="quantityUnit"
                        value={formData.quantityUnit}
                        onChange={handleChange}
                        required
                      >
                        <option value="PACKETS">Packets</option>
                        <option value="MEALS">Meals</option>
                        <option value="KG">Kilograms</option>
                        <option value="LITRES">Litres</option>
                        <option value="BOXES">Boxes</option>
                        <option value="PIECES">Pieces</option>
                      </select>
                    </div>

                    <div className="form-field">
                      <label>Prepared At (optional)</label>
                      <input
                        type="datetime-local"
                        name="preparedAt"
                        value={formData.preparedAt}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-field">
                      <label>Expiry Time *</label>
                      <input
                        type="datetime-local"
                        name="expiryTime"
                        value={formData.expiryTime}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-field full-width">
                      <label>Pickup Address *</label>
                      <textarea
                        name="pickupAddress"
                        value={formData.pickupAddress}
                        onChange={handleChange}
                        placeholder="Enter complete pickup address with contact location"
                        rows="3"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    {editingId && (
                      <button
                        type="button"
                        className="cancel-button"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </button>
                    )}

                    <button type="submit" className="submit-donation">
                      {editingId ? "Update Donation" : "Submit Donation"}
                    </button>
                  </div>
                </form>
              </section>
            )}

            {activeTab === "donations" && (
              <section className="dashboard-section">
                <div className="section-heading">
                  <div>
                    <h2>All My Donations</h2>
                    <p>Manage the food donations you have created.</p>
                  </div>
                  <button
                    className="add-small-button"
                    onClick={() => {
                      cancelEdit();
                      setActiveTab("add");
                    }}
                  >
                    + Add Donation
                  </button>
                </div>

                {donations.length === 0 ? (
                  <p className="empty-state">No donations found.</p>
                ) : (
                  <div className="donation-card-grid">
                    {donations.map((donation) => (
                      <article
                        className="donation-card"
                        key={donation.donationId}
                      >
                        <div className="donation-card-top">
                          <span className="food-category">
                            {donation.foodCategory || "FOOD"}
                          </span>
                          <span className={`status-badge ${String(donation.status).toLowerCase()}`}>
                            {donation.status}
                          </span>
                        </div>

                        <h3>{donation.foodName}</h3>
                        <p>{donation.foodDescription}</p>

                        <div className="donation-details">
                          <span>
                            Quantity: {donation.quantity}{" "}
                            {donation.quantityUnit}
                          </span>
                          <span>
                            Expiry: {formatDate(donation.expiryTime)}
                          </span>
                          <span>Pickup: {donation.pickupAddress}</span>
                        </div>

                        <div className="donation-actions">
                          <button
                            onClick={() => handleEdit(donation)}
                            disabled={
                              ["DELIVERED", "COLLECTED", "EXPIRED", "CANCELLED"].includes(
                                donation.status
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="delete-donation"
                            onClick={() =>
                              handleDelete(donation.donationId)
                            }
                            disabled={
                              ["DELIVERED", "COLLECTED"].includes(
                                donation.status
                              )
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}

            {activeTab === "requests" && (
              <section className="dashboard-section">
                <h2>NGO Donation Requests</h2>
                <p>Requests received for your food donations. Accept requests and assign volunteers for delivery.</p>

                {requests.length === 0 ? (
                  <p className="empty-state">No NGO requests found.</p>
                ) : (
                  <div className="donor-table-wrapper">
                    <table className="donor-table">
                      <thead>
                        <tr>
                          <th>Food</th>
                          <th>NGO</th>
                          <th>Requested Quantity</th>
                          <th>Message</th>
                          <th>Status</th>
                          <th>Volunteer</th>
                          <th>Actions</th>
                        </tr>
                      </thead>

                      <tbody>
                        {requests.map((request) => {
                          const assignment = assignments[request.requestId];
                          return (
                            <tr key={request.requestId}>
                              <td>{request.foodName}</td>
                              <td>{request.ngoName}</td>
                              <td>{request.requestedQuantity}</td>
                              <td>{request.requestMessage || "—"}</td>

                              <td>
                                <span className={`status-badge ${String(request.status).toLowerCase()}`}>
                                  {request.status}
                                </span>
                              </td>

                              <td>
                                {assignment ? (
                                  <div style={{ fontSize: "12px", lineHeight: "1.4" }}>
                                    <strong style={{ color: "#16834a" }}>
                                      {assignment.volunteerName}
                                    </strong>
                                    <div>Pickup: {assignment.pickupStatus}</div>
                                    <div>Delivery: {assignment.deliveryStatus}</div>
                                  </div>
                                ) : request.status === "ACCEPTED" ? (
                                  <span style={{ color: "#d97706", fontSize: "12px", fontWeight: "600" }}>
                                    Not Assigned Yet
                                  </span>
                                ) : (
                                  "—"
                                )}
                              </td>

                              <td>
                                {request.status === "PENDING" && (
                                  <div className="request-actions">
                                    <button
                                      className="accept-request"
                                      onClick={() =>
                                        handleRequestDecision(
                                          request.requestId,
                                          "accept"
                                        )
                                      }
                                    >
                                      Accept
                                    </button>

                                    <button
                                      className="reject-request"
                                      onClick={() =>
                                        handleRequestDecision(
                                          request.requestId,
                                          "reject"
                                        )
                                      }
                                    >
                                      Reject
                                    </button>
                                  </div>
                                )}

                                {request.status === "ACCEPTED" && !assignment && (
                                  <div>
                                    {assigningRequestId === request.requestId ? (
                                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                        <select
                                          value={selectedVolunteerId}
                                          onChange={(e) => setSelectedVolunteerId(e.target.value)}
                                          style={{ padding: "6px", fontSize: "12px", borderRadius: "4px" }}
                                        >
                                          <option value="">Select Volunteer...</option>
                                          {volunteers.map((v) => (
                                            <option key={v.userId} value={v.userId}>
                                              {v.name} ({v.phone || "No phone"})
                                            </option>
                                          ))}
                                        </select>
                                        <div style={{ display: "flex", gap: "5px" }}>
                                          <button
                                            style={{
                                              padding: "5px 8px",
                                              background: "#16834a",
                                              color: "white",
                                              border: "none",
                                              borderRadius: "4px",
                                              cursor: "pointer",
                                              fontSize: "11px",
                                            }}
                                            disabled={assignLoading}
                                            onClick={() => handleAssignVolunteer(request.requestId)}
                                          >
                                            {assignLoading ? "Assigning..." : "Confirm"}
                                          </button>
                                          <button
                                            style={{
                                              padding: "5px 8px",
                                              background: "#64748b",
                                              color: "white",
                                              border: "none",
                                              borderRadius: "4px",
                                              cursor: "pointer",
                                              fontSize: "11px",
                                            }}
                                            onClick={() => {
                                              setAssigningRequestId(null);
                                              setSelectedVolunteerId("");
                                            }}
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <button
                                        style={{
                                          padding: "6px 12px",
                                          background: "#2563eb",
                                          color: "white",
                                          border: "none",
                                          borderRadius: "6px",
                                          cursor: "pointer",
                                          fontSize: "12px",
                                          fontWeight: "600",
                                        }}
                                        onClick={() => {
                                          setAssigningRequestId(request.requestId);
                                          setSelectedVolunteerId("");
                                        }}
                                      >
                                        + Assign Volunteer
                                      </button>
                                    )}
                                  </div>
                                )}

                                {request.status === "ACCEPTED" && assignment && (
                                  <span style={{ color: "#16834a", fontWeight: "600", fontSize: "12px" }}>
                                    Assigned
                                  </span>
                                )}

                                {request.status === "REJECTED" && (
                                  <span style={{ color: "#ef4444", fontSize: "12px" }}>Rejected</span>
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
              <section className="dashboard-section">
                <h2>Your Notifications</h2>
                <p>Stay updated on your food donations.</p>

                {notifications.length === 0 ? (
                  <p className="empty-state">No notifications found.</p>
                ) : (
                  <div className="notification-list">
                    {notifications.map((notification) => (
                      <article
                        className={`notification-card ${
                          notification.isRead ? "read" : "unread"
                        }`}
                        key={notification.notificationId}
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
    </div>
  );
}

export default DonorDashboard;
