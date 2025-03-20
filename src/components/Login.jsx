import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient('https://bhfctmyzzbrdigrrmmtp.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoZmN0bXl6emJyZGlncnJtbXRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MTk1MjIsImV4cCI6MjA1NjM5NTUyMn0.VH1E91hLCrrBL0F1K7ONIVfpS6RBkZp8TlZg5Bq79kk')

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        onLogin(data.session);// Eğer oturum açılmışsa, onLogin'e session bilgisi ilet
      }
      setLoading(false);
    }
    checkSession();
  }, [onLogin]);

  async function handleLogin(e) {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
        onLogin(data.session); // Başarılı girişte ana sayfaya yönlendir
    }
    setLoading(false);
  }
  async function handleSignUp(e) {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) {
      setErrorMsg(error.message);
    } else {
      alert("Kayıt başarılı! Lütfen giriş yapın.");
      setIsSignUp(false); // Kayıt başarılıysa giriş ekranına dön
    }
    setLoading(false);
  }

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="login-container">
      <div className="login-box">
        <h1>{isSignUp ? "Kayıt Ol" : "Giriş Yap"}</h1>
        {errorMsg && <p className="error-message">{errorMsg}</p>}
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

        {isSignUp ? (
          <button onClick={handleSignUp}>Kayıt Ol</button>
        ) : (
          <button onClick={handleLogin}>Giriş</button>
        )}

        <p>
          {isSignUp ? "Zaten hesabınız var mı?" : "Hesabınız yok mu?"}{" "}
          <button onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Giriş Yap" : "Kayıt Ol"}
          </button>
        </p>
      </div>
    </div>
  );
  }
