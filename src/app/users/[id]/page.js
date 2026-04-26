"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function UserPage({ params }) {
  // In Next.js 15, params is a Promise — must unwrap with React.use()
  const { id: userId } = use(params);

  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");

  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch single user on page load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${userId}`);
        setUser(res.data);
        setFormName(res.data.name);
        setFormEmail(res.data.email);
      } catch {
        setError("User not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  // OPTIMISTIC UPDATE
  const handleUpdate = async () => {
    if (!user) return;

    // 1. Save backup in case API fails
    const previousUser = { ...user };

    // 2. Update UI immediately (optimistic)
    const updatedUser = { ...user, name: formName, email: formEmail };
    setUser(updatedUser);
    setShowForm(false);
    setUpdating(true);

    try {
      // 3. Call the API
      await api.put(`/users/${userId}`, updatedUser);
    } catch {
      // 4. Rollback if API fails
      setUser(previousUser);
      setFormName(previousUser.name);
      setFormEmail(previousUser.email);
      alert("Update failed. Changes reverted.");
    } finally {
      setUpdating(false);
    }
  };

  // OPTIMISTIC DELETE
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    setDeleting(true);

    // 1. Redirect immediately (optimistic)
    router.push("/users");

    try {
      // 2. Call API in the background
      await api.delete(`/users/${userId}`);
    } catch {
      console.error("Delete failed");
    }
  };

  if (loading) return <p style={styles.center}>Loading user...</p>;
  if (error || !user) return <p style={{ ...styles.center, color: "red" }}>{error}</p>;

  return (
    <div style={styles.container}>
      <button style={styles.back} onClick={() => router.push("/users")}>
        ← Back to Users
      </button>

      <h1 style={styles.heading}>👤 User #{user.id}</h1>

      <div style={styles.card}>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Website:</strong> {user.website}</p>
      </div>

      <div style={styles.actions}>
        <button
          style={styles.updateBtn}
          onClick={() => setShowForm((prev) => !prev)}
          disabled={updating}
        >
          {showForm ? "Cancel" : "✏️ Update"}
        </button>

        <button
          style={styles.deleteBtn}
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "🗑️ Delete"}
        </button>
      </div>

      {showForm && (
        <div style={styles.form}>
          <h2>Edit User</h2>

          <label style={styles.label}>Name</label>
          <input
            style={styles.input}
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Name"
          />

          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
            placeholder="Email"
          />

          <button
            style={styles.updateBtn}
            onClick={handleUpdate}
            disabled={updating || !formName || !formEmail}
          >
            {updating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: 600, margin: "0 auto", padding: "2rem" },
  center: { textAlign: "center", marginTop: "3rem" },
  heading: { fontSize: "1.8rem", marginBottom: "1rem" },
  back: {
    background: "none",
    border: "1px solid #ccc",
    borderRadius: 6,
    padding: "0.3rem 0.8rem",
    cursor: "pointer",
    marginBottom: "1.5rem",
    fontSize: "0.9rem",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: "1.5rem",
    lineHeight: 1.8,
    marginBottom: "1.5rem",
  },
  actions: { display: "flex", gap: "1rem", marginBottom: "1.5rem" },
  updateBtn: {
    padding: "0.5rem 1.2rem",
    backgroundColor: "#0070f3",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: "0.95rem",
  },
  deleteBtn: {
    padding: "0.5rem 1.2rem",
    backgroundColor: "#e00",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: "0.95rem",
  },
  form: {
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: { fontWeight: 600, fontSize: "0.9rem" },
  input: {
    padding: "0.5rem 0.8rem",
    border: "1px solid #ccc",
    borderRadius: 6,
    fontSize: "1rem",
    marginBottom: "0.5rem",
  },
};