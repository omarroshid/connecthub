import React, { useState, useEffect } from "react";
import { useAuth } from "./_app";
import { useRouter } from "next/router";

export default function Onboarding() {
  const { user, loading } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<"fan" | "creator">("fan");
  const [bio, setBio] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  useEffect(() => {
    if (user) setDisplayName(user.displayName || "");
  }, [user]);
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);
  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    try {
      const resp = await fetch("/user/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user?.uid,
          email: user?.email,
          displayName,
          role,
          bio,
        }),
      });
      if (resp.ok) {
        setSuccess(true);
        router.push("/dashboard");
      } else {
        const err = await resp.json();
        setError(err.error || "Failed to onboard.");
      }
    } catch (err) {
      setError("Failed to connect to backend.");
    }
  };
  if (loading || !user) return <p>Loading...</p>;
  return (
    <main style={{ maxWidth: 480, margin: 'auto', padding: 32 }}>
      <h2>Welcome! Tell us about yourself</h2>
      <form onSubmit={handleComplete}>
        <label>Name:<br />
          <input value={displayName} onChange={e => setDisplayName(e.target.value)} required />
        </label><br /><br />
        <label>Role:<br />
          <select value={role} onChange={e => setRole(e.target.value as any)}>
            <option value="fan">Fan</option>
            <option value="creator">Creator</option>
          </select>
        </label><br /><br />
        <label>Bio:<br />
          <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} />
        </label><br /><br />
        <button type="submit">Complete setup</button>
      </form>
      {success && <p style={{ color: 'green' }}>Onboarding complete! 🎉</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </main>
  );
}
