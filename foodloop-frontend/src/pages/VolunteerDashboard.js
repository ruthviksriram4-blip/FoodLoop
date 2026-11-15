import { useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";
import "../styles/VolunteerDashboard.css";

function VolunteerDashboard() {
  const user = JSON.parse(localStorage.getItem("foodloopUser"));

  const [assignments, setAssignments] = useState([]);
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
        api.get(`/notifications/user/${user.userId}`),
      ]);

      if (results[0].status === "fulfilled") {
        setAssignments(results[0].value.data);
      } else {
        setError("Unable to load assignments.");
      }

      if (results[1].status === "fulfilled") {
        setNotifications(results[1].value.data);
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

      setMessage("Food successfully marked as collected!");
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

      setMessage("Food successfully marked as delivered!");
      await loadDashboard();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to update delivery status."
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
    (item) => item.pickupStatus === "COLLECTED"
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
            className={activeTab === "assignments" ? "active" : ""}
            onClick={() => setActiveTab("assignments")}
          >
            My Assignments
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
              {activeTab === "overview"
                ? "Dashboard Overview"
                : activeTab === "assignments"
                ? "My Assignments"
                : "Notifications"}
            </h1>
            <p>Help deliver surplus food to people in need.</p>
          </div>

          <button className="volunteer-refresh" onClick={loadDashboard}>
            Refresh
          </button>
        </header>

        {error && <div className="volunteer-alert error">{error}</div>}
        {message && <div className="volunteer-alert success">{message}</div>}

        {activeTab === "overview" && (
          <>
            <div className="volunteer-welcome">
              <h2>Welcome, {user.name}!</h2>
              <p>
                Thank you for helping FoodLoop connect surplus food with
                communities in need.
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
                <span>Food Collected</span>
                <h2>{collectedCount}</h2>
              </div>

              <div className="volunteer-stat-card">
                <span>Food Delivered</span>
                <h2>{deliveredCount}</h2>
              </div>

              <div className="volunteer-stat-card">
                <span>Unread Notifications</span>
                <h2>{unreadCount}</h2>
              </div>
            </div>

            <section className="volunteer-section">
              <h2>Recent Assignments</h2>

              {assignments.length === 0 ? (
                <p className="volunteer-empty">
                  No assignments received yet.
                </p>
              ) : (
                assignments.slice(0, 3).map((item) => (
                  <div className="volunteer-assignment" key={item.assignmentId}>
                    <div>
                      <h3>{item.foodName}</h3>
                      <p>Assignment #{item.assignmentId}</p>
                      <span>Pickup: {item.pickupStatus}</span>
                      <span>Delivery: {item.deliveryStatus}</span>
                    </div>
                  </div>
                ))
              )}
            </section>
          </>
        )}

        {activeTab === "assignments" && (
          <section className="volunteer-section">
            <h2>My Food Assignments</h2>

            {assignments.length === 0 ? (
              <p className="volunteer-empty">
                No assignments available.
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
                      </div>

                      <span
                        className={`assignment-status ${item.deliveryStatus.toLowerCase()}`}
                      >
                        {item.deliveryStatus}
                      </span>
                    </div>

                    <div className="assignment-details">
                      <p>
                        <strong>Request ID:</strong> {item.requestId}
                      </p>
                      <p>
                        <strong>Donation ID:</strong> {item.donationId}
                      </p>
                      <p>
                        <strong>Pickup Status:</strong> {item.pickupStatus}
                      </p>
                      <p>
                        <strong>Pickup Time:</strong>{" "}
                        {formatDate(item.pickupTime)}
                      </p>
                      <p>
                        <strong>Delivery Time:</strong>{" "}
                        {formatDate(item.deliveryTime)}
                      </p>
                    </div>

                    <div className="assignment-actions">
                      {item.pickupStatus === "PENDING" && (
                        <button
                          className="collect-button"
                          disabled={busyId === item.assignmentId}
                          onClick={() => markCollected(item.assignmentId)}
                        >
                          {busyId === item.assignmentId
                            ? "Updating..."
                            : "Mark as Collected"}
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
                              : "Mark as Delivered"}
                          </button>
                        )}

                      {item.deliveryStatus === "DELIVERED" && (
                        <span className="completed-label">
                          Delivery Completed
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
