import { useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";
import "../styles/VolunteerDashboard.css";

function VolunteerDashboard() {
  const user = JSON.parse(localStorage.getItem("foodloopUser"));

  const [assignments, setAssignments] = useState([]);
  const [availableRequests, setAvailableRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const results = await Promise.allSettled([
        api.get(`/assignments/volunteer/${user.userId}`),
        api.get("/assignments/available"),
        api.get(`/notifications/user/${user.userId}`),
      ]);

      if (results[0].status === "fulfilled") {
        setAssignments(results[0].value.data);
      } else {
        setError("Unable to load assignments.");
      }

      if (results[1].status === "fulfilled") {
        setAvailableRequests(results[1].value.data);
      }

      if (results[2].status === "fulfilled") {
        setNotifications(results[2].value.data);
      }
    } catch {
      setError("Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  }, [user?.userId]);

  useEffect(() => {
    if (user?.role === "VOLUNTEER") loadDashboard();
  }, [loadDashboard, user?.role]);

  if (!user || user.role !== "VOLUNTEER") {
    return <Navigate to="/login" replace />;
  }

  const markCollected = async (assignmentId) => {
    setBusyId(assignmentId);
    setMessage("");
    setError("");

    try {
      await api.put(
        `/assignments/${assignmentId}/collect?volunteerId=${user.userId}`
      );

      setMessage("Food successfully marked as collected! Proceed to delivery.");
      await loadDashboard();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to update pickup status."
      );
    } finally {
      setBusyId(null);
    }
  };

  const markDelivered = async (assignmentId) => {
    setBusyId(assignmentId);
    setMessage("");
    setError("");

    try {
      await api.put(
        `/assignments/${assignmentId}/deliver?volunteerId=${user.userId}`
      );

      setMessage("Food successfully delivered to the NGO! Great job!");
      await loadDashboard();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to update delivery status."
      );
    } finally {
      setBusyId(null);
    }
  };

  const claimPickup = async (requestId) => {
    setBusyId(requestId);
    setMessage("");
    setError("");

    try {
      await api.post(`/assignments/${requestId}/claim`);
      setMessage("You have successfully claimed this pickup task! Find it under 'My Assignments'.");
      await loadDashboard();
      setActiveTab("assignments");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to claim this pickup."
      );
    } finally {
      setBusyId(null);
    }
  };

  const markNotificationRead = async (notificationId) => {
    try {
      await api.put(
        `/notifications/${notificationId}/read?userId=${user.userId}`
      );

      await loadDashboard();
    } catch {
      setError("Unable to mark notification as read.");
    }
  };

  const totalAssignments = assignments.length;

  const collectedCount = assignments.filter(
    (item) => item.pickupStatus === "COLLECTED" && item.deliveryStatus !== "DELIVERED"
  ).length;

  const deliveredCount = assignments.filter(
    (item) => item.deliveryStatus === "DELIVERED"
  ).length;

  const pendingCount = assignments.filter(
    (item) => item.pickupStatus === "PENDING"
  ).length;

  const unreadCount = notifications.filter(
    (item) => !item.isRead
  ).length;

  const formatDate = (date) => {
    if (!date) return "Not scheduled";
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return <div className="volunteer-loading">Loading dashboard...</div>;
  }

  return (
    <div className="volunteer-dashboard">
      <aside className="volunteer-sidebar">
        <div className="volunteer-brand">
          <h2>FoodLoop</h2>
          <p>Volunteer Panel</p>
        </div>

        <div className="volunteer-user">
          <div className="volunteer-avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3>{user.name}</h3>
            <span>VOLUNTEER</span>
          </div>
        </div>

        <nav className="volunteer-nav">
          <button
            className={activeTab === "overview" ? "active" : ""}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>

          <button
            className={activeTab === "available" ? "active" : ""}
            onClick={() => setActiveTab("available")}
          >
            Available Pickups ({availableRequests.length})
          </button>

          <button
            className={activeTab === "assignments" ? "active" : ""}
            onClick={() => setActiveTab("assignments")}
          >
            My Assignments ({assignments.length})
          </button>

          <button
            className={activeTab === "notifications" ? "active" : ""}
            onClick={() => setActiveTab("notifications")}
          >
            Notifications ({unreadCount})
          </button>
        </nav>
      </aside>

      <main className="volunteer-main">
        <header className="volunteer-header">
          <div>
            <p className="volunteer-eyebrow">FOODLOOP VOLUNTEER</p>
            <h1>
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "available" && "Available Pickups"}
              {activeTab === "assignments" && "My Assignments"}
              {activeTab === "notifications" && "Notifications"}
            </h1>
            <p>Connect food donors with NGOs and deliver fresh meals to communities in need.</p>
          </div>

          <button className="volunteer-refresh" onClick={loadDashboard}>
            ↻ Refresh
          </button>
        </header>

        {error && <div className="volunteer-alert error">{error}</div>}
        {message && <div className="volunteer-alert success">{message}</div>}

        {activeTab === "overview" && (
          <>
            <div className="volunteer-welcome">
              <h2>Welcome back, {user.name}!</h2>
              <p>
                Thank you for being the heart of the FoodLoop mission. Your deliveries help eliminate food waste and fight hunger.
              </p>
            </div>

            <div className="volunteer-stats">
              <div className="volunteer-stat-card">
                <span>Total Assignments</span>
                <h2>{totalAssignments}</h2>
              </div>

              <div className="volunteer-stat-card">
                <span>Pending Pickups</span>
                <h2>{pendingCount}</h2>
              </div>

              <div className="volunteer-stat-card">
                <span>In Transit</span>
                <h2>{collectedCount}</h2>
              </div>

              <div className="volunteer-stat-card">
                <span>Delivered</span>
                <h2>{deliveredCount}</h2>
              </div>

              <div className="volunteer-stat-card">
                <span>Available Pickups</span>
                <h2>{availableRequests.length}</h2>
              </div>

              <div className="volunteer-stat-card">
                <span>Unread Alerts</span>
                <h2>{unreadCount}</h2>
              </div>
            </div>

            <section className="volunteer-section">
              <h2>Recent Assigned Pickups</h2>

              {assignments.length === 0 ? (
                <div style={{ padding: "20px", background: "white", borderRadius: "8px", border: "1px dashed #cbd5e1" }}>
                  <p className="volunteer-empty">No assignments assigned to you yet.</p>
                  {availableRequests.length > 0 && (
                    <button
                      onClick={() => setActiveTab("available")}
                      style={{
                        marginTop: "10px",
                        padding: "8px 16px",
                        background: "#16834a",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      View {availableRequests.length} Available Pickups to Claim
                    </button>
                  )}
                </div>
              ) : (
                assignments.slice(0, 3).map((item) => (
                  <div className="volunteer-assignment" key={item.assignmentId} style={{ marginBottom: "12px" }}>
                    <div>
                      <h3>{item.foodName}</h3>
                      <p>Assignment #{item.assignmentId} • {item.quantity} {item.quantityUnit}</p>
                      <div style={{ fontSize: "13px", color: "#475569", marginTop: "4px" }}>
                        📍 From: {item.donorName} ({item.pickupAddress})
                      </div>
                      <div style={{ fontSize: "13px", color: "#475569" }}>
                        🏁 To: {item.ngoName} ({item.ngoAddress || "NGO Location"})
                      </div>
                      <div style={{ marginTop: "6px", display: "flex", gap: "10px" }}>
                        <span className={`status-pill ${item.pickupStatus.toLowerCase()}`}>
                          Pickup: {item.pickupStatus}
                        </span>
                        <span className={`status-pill ${item.deliveryStatus.toLowerCase()}`}>
                          Delivery: {item.deliveryStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </section>
          </>
        )}

        {activeTab === "available" && (
          <section className="volunteer-section">
            <h2>Available Pickups Waiting for a Volunteer</h2>
            <p>These donations have been approved by the donor and need a volunteer to collect and deliver them.</p>

            {availableRequests.length === 0 ? (
              <p className="volunteer-empty">
                No unassigned pickups available right now. All accepted food donations are currently covered!
              </p>
            ) : (
              <div className="volunteer-assignment-list">
                {availableRequests.map((item) => (
                  <article
                    className="volunteer-assignment-card"
                    key={item.requestId}
                  >
                    <div className="assignment-top">
                      <div>
                        <p className="assignment-number">
                          REQUEST #{item.requestId}
                        </p>
                        <h3>{item.foodName}</h3>
                      </div>
                      <span className="assignment-status pending">
                        UNASSIGNED
                      </span>
                    </div>

                    <div className="assignment-details">
                      <p>
                        <strong>Requested Quantity:</strong> {item.requestedQuantity}
                      </p>
                      <p>
                        <strong>Destination NGO:</strong> {item.ngoName}
                      </p>
                      <p>
                        <strong>Note:</strong> {item.requestMessage || "Food requested for immediate community redistribution"}
                      </p>
                    </div>

                    <div className="assignment-actions" style={{ marginTop: "15px" }}>
                      <button
                        className="collect-button"
                        style={{ background: "#16834a" }}
                        disabled={busyId === item.requestId}
                        onClick={() => claimPickup(item.requestId)}
                      >
                        {busyId === item.requestId
                          ? "Claiming..."
                          : "✓ Claim & Deliver This Pickup"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "assignments" && (
          <section className="volunteer-section">
            <h2>My Food Assignments</h2>
            <p>Manage your assigned pickups, update status, and complete deliveries.</p>

            {assignments.length === 0 ? (
              <p className="volunteer-empty">
                No assignments in your list. Head over to the "Available Pickups" tab to claim a delivery!
              </p>
            ) : (
              <div className="volunteer-assignment-list">
                {assignments.map((item) => (
                  <article
                    className="volunteer-assignment-card"
                    key={item.assignmentId}
                  >
                    <div className="assignment-top">
                      <div>
                        <p className="assignment-number">
                          ASSIGNMENT #{item.assignmentId}
                        </p>
                        <h3>{item.foodName}</h3>
                        <span style={{ fontSize: "12px", background: "#f1f5f9", padding: "2px 8px", borderRadius: "4px" }}>
                          {item.quantity} {item.quantityUnit} ({item.foodCategory || "FOOD"})
                        </span>
                      </div>

                      <span
                        className={`assignment-status ${item.deliveryStatus.toLowerCase()}`}
                      >
                        {item.deliveryStatus}
                      </span>
                    </div>

                    <div className="assignment-details" style={{ marginTop: "12px" }}>
                      <div style={{ background: "#f8fafc", padding: "10px", borderRadius: "6px", marginBottom: "8px" }}>
                        <strong>📍 Pickup Location (Donor):</strong>
                        <div>{item.donorName}</div>
                        <div style={{ color: "#334155" }}>{item.pickupAddress}</div>
                        {item.donorPhone && <div style={{ color: "#2563eb" }}>📞 Phone: {item.donorPhone}</div>}
                      </div>

                      <div style={{ background: "#f8fafc", padding: "10px", borderRadius: "6px" }}>
                        <strong>🏁 Delivery Location (NGO):</strong>
                        <div>{item.ngoName}</div>
                        <div style={{ color: "#334155" }}>{item.ngoAddress || "Address provided upon contact"}</div>
                        {item.ngoPhone && <div style={{ color: "#2563eb" }}>📞 Phone: {item.ngoPhone}</div>}
                      </div>

                      <p style={{ marginTop: "10px" }}>
                        <strong>Pickup Status:</strong> {item.pickupStatus}{" "}
                        {item.pickupTime && `(at ${formatDate(item.pickupTime)})`}
                      </p>
                      <p>
                        <strong>Delivery Status:</strong> {item.deliveryStatus}{" "}
                        {item.deliveryTime && `(at ${formatDate(item.deliveryTime)})`}
                      </p>
                    </div>

                    <div className="assignment-actions" style={{ marginTop: "15px" }}>
                      {item.pickupStatus === "PENDING" && (
                        <button
                          className="collect-button"
                          disabled={busyId === item.assignmentId}
                          onClick={() => markCollected(item.assignmentId)}
                        >
                          {busyId === item.assignmentId
                            ? "Updating..."
                            : "📦 Mark as Collected"}
                        </button>
                      )}

                      {item.pickupStatus === "COLLECTED" &&
                        item.deliveryStatus !== "DELIVERED" && (
                          <button
                            className="deliver-button"
                            disabled={busyId === item.assignmentId}
                            onClick={() => markDelivered(item.assignmentId)}
                          >
                            {busyId === item.assignmentId
                              ? "Updating..."
                              : "🚀 Mark as Delivered to NGO"}
                          </button>
                        )}

                      {item.deliveryStatus === "DELIVERED" && (
                        <span className="completed-label" style={{ color: "#16834a", fontWeight: "bold" }}>
                          ✓ Delivery Completed Successfully
                        </span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "notifications" && (
          <section className="volunteer-section">
            <h2>My Notifications</h2>

            {notifications.length === 0 ? (
              <p className="volunteer-empty">
                No notifications available.
              </p>
            ) : (
              notifications.map((item) => (
                <div
                  className={`volunteer-notification ${
                    item.isRead ? "read" : "unread"
                  }`}
                  key={item.notificationId}
                >
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.message}</p>
                    <small>{formatDate(item.createdAt)}</small>
                  </div>

                  {!item.isRead && (
                    <button
                      onClick={() =>
                        markNotificationRead(item.notificationId)
                      }
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              ))
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default VolunteerDashboard;
