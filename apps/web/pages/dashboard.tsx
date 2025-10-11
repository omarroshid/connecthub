import React from "react";
import { useAuth } from "./_app";

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <main style={{ maxWidth: 600, margin: 'auto', padding: 32 }}>
      <h1>Dashboard</h1>
      {user ? (
        <div>
          <p>Welcome {user.displayName || user.email}!</p>
          <p>You are signed in.</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      {/* Future: links to bookings, profile, earnings, etc */}
    </main>
  );
}
