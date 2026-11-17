import { useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";
import FoodLoopLogo from "../components/FoodLoopLogo";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("foodloopUser"));

  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [reports, setReports] = useState(null);

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    const results = await Promise.allSettled([
      api.get("/users"),
      api.get("/donations"),
      api.get("/requests"),
      api.get("/assignments"),
      api.get(`/notifications/user/${user?.userId}`),
      api.get("/admin/reports"),
    ]);

    if (results[0].status === "fulfilled") setUsers(results[0].value.data);
    if (results[1].status === "fulfilled") setDonations(results[1].value.data);
    if (results[2].status === "fulfilled") setRequests(results[2].value.data);
    if (results[3].status === "fulfilled") setAssignments(results[3].value.data);
    if (results[4].status === "fulfilled") setNotifications(results[4].value.data);
    if (results[5].status === "fulfilled") setReports(results[5].value.data);

    setLoading(false);
  }, [user?.userId]);

  useEffect(() => {
    if (user?.role === "ADMIN") loadDashboard();
  }, [loadDashboard, user?.role]);

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  const handleVerifyNgo = async (userId, userName) => {
    setActionLoadingId(userId);
    setError("");
    setSuccess("");

    try {
      await api.put(`/admin/ngos/${userId}/verify`);
      setSuccess(`NGO "${userName}" has been successfully verified! They can now request food.`);
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify NGO.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleStatus = async (userId) => {
    setActionLoadingId(userId);
    setError("");
    setSuccess("");

    try {
      await api.put(`/admin/users/${userId}/status`);
      setSuccess("User verification status updated successfully.");
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user status.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete user "${userName}"?`);
    if (!confirmDelete) return;

    setActionLoadingId(userId);
    setError("");
    setSuccess("");

    try {
      await api.delete(`/users/${userId}`);
      setSuccess(`User "${userName}" was deleted successfully.`);
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const donorCount = users.filter((item) => item.role === "DONOR").length;
  const ngoCount = users.filter((item) => item.role === "NGO").length;
  const verifiedNgoCount = users.filter((item) => item.role === "NGO" && item.verified).length;
  const pendingNgoCount = users.filter((item) => item.role === "NGO" && !item.verified).length;
  const volunteerCount = users.filter((item) => item.role === "VOLUNTEER").length;

  const pendingRequests = requests.filter((item) => item.status === "PENDING").length;
  const deliveredDonations = donations.filter((item) => item.status === "DELIVERED").length;
  const unreadNotifications = notifications.filter((item) => !item.isRead).length;

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };

  const getStatusClass = (status) => {
    return `admin-status ${String(status || "unknown").toLowerCase()}`;
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "users", label: "Users & NGOs" },
    { id: "donations", label: "Donations" },
    { id: "requests", label: "Requests" },
    { id: "assignments", label: "Assignments" },
    { id: "reports", label: "Reports & Analytics" },
    { id: "notifications", label: "Notifications" },
  ];

  if (loading) {
    return <div className="admin-loading">Loading Admin Dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <FoodLoopLogo size={32} variant="dark" />
          <p style={{ marginTop: "6px", marginLeft: "42px", color: "#a7f3d0", fontSize: "12px", fontWeight: "600" }}>Administration Panel</p>
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
              {tab.id === "users" && pendingNgoCount > 0 && ` (${pendingNgoCount} pending)`}
              {tab.id === "notifications" && ` (${unreadNotifications})`}
            </button>
          ))}
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <p className="admin-eyebrow">FOODLOOP CENTRAL ADMINISTRATION</p>
            <h1>
              {tabs.find((tab) => tab.id === activeTab)?.label}
            </h1>
            <p>Monitor operations, manage user accounts, verify NGOs, and generate donation reports.</p>
          </div>

          <button className="admin-refresh" onClick={loadDashboard}>
            ↻ Refresh Data
          </button>
        </header>

        {error && <div className="admin-alert" style={{ background: "#fee2e2", color: "#991b1b", border: "1px solid #f87171" }}>{error}</div>}
        {success && <div className="admin-alert" style={{ background: "#dcfce7", color: "#166534", border: "1px solid #86efac" }}>{success}</div>}

        {activeTab === "overview" && (
          <>
            <div className="admin-welcome">
              <h2>Welcome, {user.name}!</h2>
              <p>
                Platform overview and vital statistics of the FoodLoop food redistribution network.
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
                <span>Pending NGO Approvals</span>
                <h2 style={{ color: pendingNgoCount > 0 ? "#b45309" : "inherit" }}>{pendingNgoCount}</h2>
              </div>
            </div>

            {pendingNgoCount > 0 && (
              <div
                style={{
                  background: "#fffbeb",
                  border: "1px solid #fde68a",
                  borderRadius: "8px",
                  padding: "16px 20px",
                  margin: "20px 0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <strong style={{ color: "#92400e" }}>
                    ⚠️ {pendingNgoCount} NGO account{pendingNgoCount > 1 ? "s are" : " is"} waiting for admin verification
                  </strong>
                  <p style={{ margin: "4px 0 0", color: "#78350f", fontSize: "14px" }}>
                    Verified NGOs are granted permission to request surplus food donations.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("users")}
                  style={{
                    padding: "8px 16px",
                    background: "#16834a",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Review NGOs
                </button>
              </div>
            )}

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
                  <small style={{ display: "block", color: "#64748b", marginTop: "4px" }}>
                    {verifiedNgoCount} verified, {pendingNgoCount} pending
                  </small>
                </div>
                <div>
                  <span>Volunteers</span>
                  <strong>{volunteerCount}</strong>
                </div>
              </div>
            </section>

            <section className="admin-section">
              <h2>Recent Food Donations</h2>

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
                        <th>Expiry</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donations.slice(0, 5).map((item) => (
                        <tr key={item.donationId}>
                          <td>#{item.donationId}</td>
                          <td><strong>{item.foodName}</strong></td>
                          <td>{item.donorName}</td>
                          <td>
                            {item.quantity} {item.quantityUnit}
                          </td>
                          <td>
                            <span className={getStatusClass(item.status)}>
                              {item.status}
                            </span>
                          </td>
                          <td>{formatDate(item.expiryTime)}</td>
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <h2>Registered Users ({users.length})</h2>
              {pendingNgoCount > 0 && (
                <span style={{ background: "#fef3c7", color: "#b45309", padding: "4px 12px", borderRadius: "12px", fontSize: "13px", fontWeight: "600" }}>
                  {pendingNgoCount} NGO(s) pending approval
                </span>
              )}
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name / Organization</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Verification</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((item) => (
                    <tr key={item.userId}>
                      <td>#{item.userId}</td>
                      <td>
                        <strong>{item.name}</strong>
                        {item.organizationName && (
                          <div style={{ fontSize: "12px", color: "#64748b" }}>
                            {item.organizationName}
                          </div>
                        )}
                      </td>
                      <td>{item.email}</td>
                      <td>{item.phone || "—"}</td>
                      <td>
                        <span className="admin-role">{item.role}</span>
                      </td>
                      <td>
                        {item.role === "NGO" ? (
                          item.verified ? (
                            <span style={{ color: "#16834a", fontWeight: "600", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                              ✓ Verified
                            </span>
                          ) : (
                            <span style={{ color: "#b45309", background: "#fef3c7", padding: "3px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "600" }}>
                              Pending
                            </span>
                          )
                        ) : (
                          <span style={{ color: "#64748b", fontSize: "12px" }}>
                            {item.verified ? "Active" : "Standard"}
                          </span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "6px" }}>
                          {item.role === "NGO" && !item.verified && (
                            <button
                              onClick={() => handleVerifyNgo(item.userId, item.name)}
                              disabled={actionLoadingId === item.userId}
                              style={{
                                background: "#16834a",
                                color: "white",
                                border: "none",
                                padding: "5px 10px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "12px",
                                fontWeight: "600",
                              }}
                            >
                              {actionLoadingId === item.userId ? "..." : "✓ Verify NGO"}
                            </button>
                          )}

                          <button
                            onClick={() => handleToggleStatus(item.userId)}
                            disabled={actionLoadingId === item.userId || item.role === "ADMIN"}
                            style={{
                              background: "#e2e8f0",
                              color: "#334155",
                              border: "none",
                              padding: "5px 8px",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "11px",
                            }}
                            title="Toggle verification status"
                          >
                            Toggle Status
                          </button>

                          {item.userId !== user.userId && (
                            <button
                              onClick={() => handleDeleteUser(item.userId, item.name)}
                              disabled={actionLoadingId === item.userId}
                              style={{
                                background: "#fee2e2",
                                color: "#b91c1c",
                                border: "none",
                                padding: "5px 8px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "11px",
                              }}
                            >
                              Delete
                            </button>
                          )}
                        </div>
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
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Pickup Address</th>
                    <th>Expiry Time</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {donations.map((item) => (
                    <tr key={item.donationId}>
                      <td>#{item.donationId}</td>
                      <td><strong>{item.foodName}</strong></td>
                      <td>{item.donorName}</td>
                      <td>{item.foodCategory || "FOOD"}</td>
                      <td>
                        {item.quantity} {item.quantityUnit}
                      </td>
                      <td>{item.pickupAddress}</td>
                      <td>{formatDate(item.expiryTime)}</td>
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
                    <th>Food Item</th>
                    <th>NGO</th>
                    <th>Quantity</th>
                    <th>Message</th>
                    <th>Requested At</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {requests.map((item) => (
                    <tr key={item.requestId}>
                      <td>#{item.requestId}</td>
                      <td><strong>{item.foodName}</strong></td>
                      <td>{item.ngoName}</td>
                      <td>{item.requestedQuantity}</td>
                      <td>{item.requestMessage || "—"}</td>
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
            <h2>Volunteer Deliveries & Assignments ({assignments.length})</h2>

            {assignments.length === 0 ? (
              <p className="admin-empty">No volunteer assignments recorded yet.</p>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Assignment ID</th>
                      <th>Food</th>
                      <th>Volunteer</th>
                      <th>Pickup Location</th>
                      <th>Delivery Location</th>
                      <th>Pickup Status</th>
                      <th>Delivery Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {assignments.map((item) => (
                      <tr key={item.assignmentId}>
                        <td>#{item.assignmentId}</td>
                        <td><strong>{item.foodName}</strong></td>
                        <td>{item.volunteerName}</td>
                        <td>{item.pickupAddress || item.donorName}</td>
                        <td>{item.ngoName}</td>
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

        {activeTab === "reports" && (
          <section className="admin-section">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h2>FoodLoop System Reports & Analytics</h2>
                <p>System-wide redistribution performance, user growth, and operational metrics.</p>
              </div>
              <button
                onClick={() => window.print()}
                style={{
                  padding: "8px 18px",
                  background: "#1e293b",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                🖨️ Print Report
              </button>
            </div>

            {reports && (
              <>
                <div className="admin-stats" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
                  <div className="admin-stat-card">
                    <span>Total Donations Logged</span>
                    <h2>{reports.totalDonations}</h2>
                  </div>
                  <div className="admin-stat-card">
                    <span>Delivered Meals</span>
                    <h2 style={{ color: "#16834a" }}>{reports.deliveredDonations}</h2>
                  </div>
                  <div className="admin-stat-card">
                    <span>Active Listings</span>
                    <h2>{reports.availableDonations}</h2>
                  </div>
                  <div className="admin-stat-card">
                    <span>Expired Listings</span>
                    <h2 style={{ color: "#94a3b8" }}>{reports.expiredDonations}</h2>
                  </div>
                  <div className="admin-stat-card">
                    <span>Total NGO Requests</span>
                    <h2>{reports.totalRequests}</h2>
                  </div>
                  <div className="admin-stat-card">
                    <span>Completed Deliveries</span>
                    <h2 style={{ color: "#2563eb" }}>{reports.completedDeliveries}</h2>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px", marginTop: "25px" }}>
                  <div style={{ background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                    <h3 style={{ marginBottom: "15px", color: "#1e293b" }}>User Community Summary</h3>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <tbody>
                        <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "10px 0" }}>Total Registered Users</td>
                          <td style={{ textAlign: "right", fontWeight: "bold" }}>{reports.totalUsers}</td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "10px 0" }}>Food Donors</td>
                          <td style={{ textAlign: "right", fontWeight: "bold" }}>{reports.totalDonors}</td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "10px 0" }}>NGOs (Total)</td>
                          <td style={{ textAlign: "right", fontWeight: "bold" }}>{reports.totalNgos}</td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "10px 0", color: "#16834a" }}>Verified NGOs</td>
                          <td style={{ textAlign: "right", fontWeight: "bold", color: "#16834a" }}>{reports.verifiedNgos}</td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "10px 0", color: "#b45309" }}>Pending NGO Verifications</td>
                          <td style={{ textAlign: "right", fontWeight: "bold", color: "#b45309" }}>{reports.pendingNgos}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: "10px 0" }}>Active Volunteers</td>
                          <td style={{ textAlign: "right", fontWeight: "bold" }}>{reports.totalVolunteers}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div style={{ background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                    <h3 style={{ marginBottom: "15px", color: "#1e293b" }}>Redistribution Pipeline</h3>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <tbody>
                        <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "10px 0" }}>Total Requests Submitted</td>
                          <td style={{ textAlign: "right", fontWeight: "bold" }}>{reports.totalRequests}</td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "10px 0", color: "#d97706" }}>Pending Donor Decisions</td>
                          <td style={{ textAlign: "right", fontWeight: "bold", color: "#d97706" }}>{reports.pendingRequests}</td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "10px 0", color: "#16834a" }}>Accepted Requests</td>
                          <td style={{ textAlign: "right", fontWeight: "bold", color: "#16834a" }}>{reports.acceptedRequests}</td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "10px 0", color: "#ef4444" }}>Rejected Requests</td>
                          <td style={{ textAlign: "right", fontWeight: "bold", color: "#ef4444" }}>{reports.rejectedRequests}</td>
                        </tr>
                        <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "10px 0" }}>Pickups In Transit</td>
                          <td style={{ textAlign: "right", fontWeight: "bold" }}>{reports.collectedPickups}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: "10px 0", color: "#16834a" }}>Successfully Delivered</td>
                          <td style={{ textAlign: "right", fontWeight: "bold", color: "#16834a" }}>{reports.completedDeliveries}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
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
