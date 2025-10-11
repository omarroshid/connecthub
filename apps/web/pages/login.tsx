import React from "react";
import { useAuth } from "./_app";
import { useRouter } from "next/router";
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const { user } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    // Redirect is handled by effect above.
  };

  // Minimal email login for demo
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [err, setErr] = React.useState("");
  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      setErr("Auth failed. Check email/password or use Google.");
    }
  };

  return (
    <main style={{ maxWidth: 420, margin: 'auto', padding: 32 }}>
      <h2>Log In</h2>
      <button onClick={handleGoogle} style={{padding: 10, marginBottom: 18}}>
        Log in with Google
      </button>
      <form onSubmit={handleEmail} style={{marginTop: 10}}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" /><br/>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" /><br/>
        <button type="submit">Log in with Email</button>
      </form>
      {err && <p style={{color:'red'}}>{err}</p>}
    </main>
  );
}
