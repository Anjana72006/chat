import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../firebase";

function Chat() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("general");

  const bottomRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, "messages"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filtered = data
        .filter((msg) => msg.room === room)
        .sort(
          (a, b) =>
            (a.createdAt?.seconds || 0) -
            (b.createdAt?.seconds || 0)
        );

      setMessages(filtered);
    });

    return () => unsubscribe();
  }, [room]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (message.trim() === "") return;

    await addDoc(collection(db, "messages"), {
      text: message,
      user: auth.currentUser.email,
      room: room,
      createdAt: serverTimestamp(),
    });

    setMessage("");
  };

  const deleteMessage = async (id) => {
    try {
      await deleteDoc(doc(db, "messages", id));
    } catch (error) {
      alert(error.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div style={styles.page}>
      <div style={styles.chatContainer}>
        <div style={styles.header}>
          <h2>💬 React Chat</h2>

          <div>
            <select
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              style={styles.select}
            >
              <option value="general">General</option>
              <option value="tech">Tech</option>
              <option value="sports">Sports</option>
            </select>

            <button style={styles.logout} onClick={logout}>
              Logout
            </button>
          </div>
        </div>

        <div style={styles.messages}>
          {messages.length === 0 ? (
            <p style={{ textAlign: "center", color: "gray" }}>
              No messages yet.
            </p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  ...styles.message,
                  alignSelf:
                    msg.user === auth.currentUser.email
                      ? "flex-end"
                      : "flex-start",
                  background:
                    msg.user === auth.currentUser.email
                      ? "#DCF8C6"
                      : "#ffffff",
                }}
              >
                <small style={styles.user}>{msg.user}</small>

                <div>{msg.text}</div>

                {msg.user === auth.currentUser.email && (
                  <button
                    style={styles.deleteBtn}
                    onClick={() => deleteMessage(msg.id)}
                  >
                    🗑 Delete
                  </button>
                )}
              </div>
            ))
          )}

          <div ref={bottomRef}></div>
        </div>

        <div style={styles.inputArea}>
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={styles.input}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />

          <button style={styles.send} onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    background: "#d9dbd5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  chatContainer: {
    width: "900px",
    height: "90vh",
    background: "#ece5dd",
    display: "flex",
    flexDirection: "column",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
  },

  header: {
    background: "#075E54",
    color: "white",
    padding: "15px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  select: {
    padding: "8px",
    borderRadius: "5px",
    marginRight: "10px",
  },

  logout: {
    padding: "8px 14px",
    border: "none",
    borderRadius: "5px",
    background: "#d9534f",
    color: "white",
    cursor: "pointer",
  },

  messages: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  message: {
    padding: "10px 14px",
    borderRadius: "10px",
    maxWidth: "60%",
    wordBreak: "break-word",
    boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
  },

  user: {
    color: "#555",
    fontWeight: "bold",
    display: "block",
    marginBottom: "5px",
  },

  inputArea: {
    display: "flex",
    padding: "15px",
    background: "#f0f0f0",
  },

  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "25px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "16px",
  },

  send: {
    marginLeft: "10px",
    padding: "12px 22px",
    background: "#128C7E",
    color: "white",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  deleteBtn: {
    marginTop: "8px",
    padding: "5px 10px",
    background: "#d9534f",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "12px",
    alignSelf: "flex-end",
  },
};

export default Chat;