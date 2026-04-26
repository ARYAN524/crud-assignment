"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function UsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data);
      } catch (err) {
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p style={styles.center}>Loading users...</p>;
  if (error) return <p style={{ ...styles.center, color: "red" }}>{error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>👥 All Users</h1>

      <div style={styles.grid}>
        {users.map((user) => (
          <div key={user.id} style={styles.card}>
            <h2 style={styles.name}>{user.name}</h2>
            <p style={styles.email}>📧 {user.email}</p>

            <button
              style={styles.button}
              onClick={() => router.push(`/users/${user.id}`)}
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: 800, margin: "0 auto", padding: "2rem" },
  heading: { fontSize: "1.8rem", marginBottom: "1.5rem" },
  center: { textAlign: "center", marginTop: "3rem" },
  grid: { display: "flex", flexDirection: "column", gap: "1rem" },
  card: {
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: "1rem 1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    flexWrap: "wrap",
  },
  name: { flex: 1, margin: 0, fontSize: "1.1rem" },
  email: { flex: 1, margin: 0, color: "#555" },
  button: {
    padding: "0.4rem 1rem",
    backgroundColor: "#0070f3",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: "0.9rem",
  },
};