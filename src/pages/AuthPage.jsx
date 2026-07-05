import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const navigate = useNavigate();

  const handleAuth = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }

      navigate("/chat");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>💬 Chat App</h2>
        <p style={styles.subtitle}>
          {isLogin ? "Welcome back!" : "Create your account"}
        </p>

        <input
          style={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleAuth} style={styles.button}>
          {isLogin ? "Login" : "Sign Up"}
        </button>

        <p style={styles.switchText}>
          {isLogin ? "New here?" : "Already have an account?"}{" "}
          <span style={styles.link} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Create account" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

/* 🎨 STYLES */
const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #075E54, #128C7E)",
    fontFamily: "Arial",
  },
  card: {
    width: "320px",
    padding: "25px",
    borderRadius: "12px",
    backgroundColor: "white",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    textAlign: "center",
  },
  title: {
    marginBottom: "5px",
    color: "#075E54",
  },
  subtitle: {
    marginBottom: "20px",
    fontSize: "14px",
    color: "gray",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#075E54",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
  switchText: {
    marginTop: "15px",
    fontSize: "13px",
  },
  link: {
    color: "#128C7E",
    cursor: "pointer",
    fontWeight: "bold",
  },
};