import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient('https://bhfctmyzzbrdigrrmmtp.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoZmN0bXl6emJyZGlncnJtbXRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MTk1MjIsImV4cCI6MjA1NjM5NTUyMn0.VH1E91hLCrrBL0F1K7ONIVfpS6RBkZp8TlZg5Bq79kk')

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        onLogin(data.session);// Eğer oturum açılmışsa, onLogin'e session bilgisi ilet
      }
    }
    checkSession();
  }, [onLogin]);

  async function handleLogin() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
        onLogin(data.session); // Başarılı girişte ana sayfaya yönlendir
    }
  }


  return (
    <div>
      <h1>Giriş Yap</h1>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Giriş</button>
    </div>
  );
}
