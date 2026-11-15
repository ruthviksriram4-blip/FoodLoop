import { useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("foodloopUser"));

  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [assignmentError, setAssignmentError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    setAssignmentError("");

    const results = await Promise.allSettled([
      api.get("/users"),
      api.get("/donations"),
      api.get("/requests"),
      api.get("/assignments"),
      api.get(`/notifications/user/${user.userId}`),
    ]);

    const setters = [
      setUsers,
      setDonations,
      setRequests,
      setAssignments,
      setNotifications,
    ];

    const labels = [
      "users",
      "donations",
      "requests",
      "assignments",
      "notifications",
    ];

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        setters[index](result.value.data);
      } else if (labels[index] === "assignments") {
        setAssignmentError("Unable to load assignments.");
      } else {
        setError(`Unable to load ${labels[index]}.`);
      }
    });

    setLoading(false);
  }, [user?.userId]);

  useEffect(() => {
    if (user?.role === "ADMIN") loadDashboard();
  }, [loadDashboard, user?.role]);

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  const donorCount = users.filter((item) => item.role === "DONOR").length;
  const ngoCount = users.filter((item) => item.role === "NGO").length;
  const volunteerCount = users.filter(
    (item) => item.role === "VOLUNTEER"
  ).length;

  const pendingRequests = requests.filter(
    (item) => item.status === "PENDING"
  ).length;

  const deliveredDonations = donations.filter(
    (item) => item.status === "DELIVERED"
  ).length;

  const unreadNotifications = notifications.filter(
    (item) => !item.isRead
  ).length;

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };

  const getStatusClass = (status) => {
    return `admin-status ${String(status || "unknown").toLowerCase()}`;
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "users", label: "Users" },
    { id: "donations", label: "Donations" },
    { id: "requests", label: "Requests" },
    { id: "assignments", label: "Assignments" },
    { id: "notifications", label: "Notifications" },
  ];

  if (loading) {
    return <div className="admin-loading">Loading Admin Dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <h2>FoodLoop</h2>
          <p>Administration Panel</p>
        </div>

        <div className="admin-profile">
          <div className="admin-avatar">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3>{user.name}</h3>
            <span>ADMINISTRATOR</span>
          </div>
        </div>

        <nav className="admin-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={activeTab === tab.id ? "active" : ""}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {tab.id === "notifications" && ` (${unreadNotifications})`}
            </button>
          ))}
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <p className="admin-eyebrow">FOODLOOP ADMINISTRATION</p>
            <h1>
              {tabs.find((tab) => tab.id === activeTab)?.label}
            </h1>
            <p>Monitor and manage FoodLoop activities.</p>
          </div>

          <button className="admin-refresh" onClick={loadDashboard}>
            Refresh Data
          </button>
        </header>

        {error && <div className="admin-alert">{error}</div>}

        {activeTab === "overview" && (
          <>
            <div className="admin-welcome">
              <h2>Welcome, {user.name}!</h2>
              <p>
                Here's an overview of your FoodLoop food redistribution
                platform.
              </p>
            </div>

            <div className="admin-stats">
              <div className="admin-stat-card">
                <span>Total Users</span>
                <h2>{users.length}</h2>
              </div>

              <div className="admin-stat-card">
                <span>Total Donations</span>
                <h2>{donations.length}</h2>
              </div>

              <div className="admin-stat-card">
                <span>Total Requests</span>
                <h2>{requests.length}</h2>
              </div>

              <div className="admin-stat-card">
                <span>Pending Requests</span>
                <h2>{pendingRequests}</h2>
              </div>

              <div className="admin-stat-card">
                <span>Delivered Donations</span>
                <h2>{deliveredDonations}</h2>
              </div>

              <div className="admin-stat-card">
                <span>Volunteer Assignments</span>
                <h2>{assignments.length}</h2>
              </div>
            </div>

            <section className="admin-section">
              <h2>User Distribution</h2>

              <div className="admin-role-grid">
                <div>
                  <span>Donors</span>
                  <strong>{donorCount}</strong>
                </div>
                <div>
                  <span>NGOs</span>
                  <strong>{ngoCount}</strong>
                </div>
                <div>
                  <span>Volunteers</span>
                  <strong>{volunteerCount}</strong>
                </div>
              </div>
            </section>

            <section className="admin-section">
              <h2>Recent Donations</h2>

              {donations.length === 0 ? (
                <p className="admin-empty">No donations available.</p>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Food</th>
                        <th>Donor</th>
                        <th>Quantity</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donations.slice(0, 5).map((item) => (
                        <tr key={item.donationId}>
                          <td>{item.donationId}</td>
                          <td>{item.foodName}</td>
                          <td>{item.donorName}</td>
                          <td>
                            {item.quantity} {item.quantityUnit}
                          </td>
                          <td>
                            <span className={getStatusClass(item.status)}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === "users" && (
          <section className="admin-section">
            <h2>Registered Users ({users.length})</h2>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((item) => (
                    <tr key={item.userId}>
                      <td>{item.userId}</td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.phone || "N/A"}</td>
                      <td>
                        <span className="admin-role">{item.role}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === "donations" && (
          <section className="admin-section">
            <h2>All Food Donations ({donations.length})</h2>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Food Name</th>
                    <th>Donor</th>
                    <th>Quantity</th>
                    <th>Pickup Address</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {donations.map((item) => (
                    <tr key={item.donationId}>
                      <td>{item.donationId}</td>
                      <td>{item.foodName}</td>
                      <td>{item.donorName}</td>
                      <td>
                        {item.quantity} {item.quantityUnit}
                      </td>
                      <td>{item.pickupAddress}</td>
                      <td>
                        <span className={getStatusClass(item.status)}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === "requests" && (
          <section className="admin-section">
            <h2>Donation Requests ({requests.length})</h2>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Food</th>
                    <th>NGO</th>
                    <th>Quantity</th>
                    <th>Requested At</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {requests.map((item) => (
                    <tr key={item.requestId}>
                      <td>{item.requestId}</td>
                      <td>{item.foodName}</td>
                      <td>{item.ngoName}</td>
                      <td>{item.requestedQuantity}</td>
                      <td>{formatDate(item.requestedAt)}</td>
                      <td>
                        <span className={getStatusClass(item.status)}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === "assignments" && (
          <section className="admin-section">
            <h2>Volunteer Assignments ({assignments.length})</h2>

            {assignmentError && (
              <div className="admin-alert">{assignmentError}</div>
            )}

            {assignments.length > 0 && (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Assignment ID</th>
                      <th>Food</th>
                      <th>Volunteer</th>
                      <th>Pickup</th>
                      <th>Delivery</th>
                    </tr>
                  </thead>

                  <tbody>
                    {assignments.map((item) => (
                      <tr key={item.assignmentId}>
                        <td>{item.assignmentId}</td>
                        <td>{item.foodName}</td>
                        <td>{item.volunteerName}</td>
                        <td>
                          <span className={getStatusClass(item.pickupStatus)}>
                            {item.pickupStatus}
                          </span>
                        </td>
                        <td>
                          <span className={getStatusClass(item.deliveryStatus)}>
                            {item.deliveryStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {activeTab === "notifications" && (
          <section className="admin-section">
            <h2>Admin Notifications</h2>

            {notifications.length === 0 ? (
              <p className="admin-empty">No notifications available.</p>
            ) : (
              notifications.map((item) => (
                <div
                  className={`admin-notification ${
                    item.isRead ? "read" : "unread"
                  }`}
                  key={item.notificationId}
                >
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.message}</p>
                    <small>{formatDate(item.createdAt)}</small>
                  </div>
                  <span>{item.isRead ? "Read" : "Unread"}</span>
                </div>
              ))
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
