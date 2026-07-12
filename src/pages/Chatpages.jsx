import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  serverTimestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../firebase";

export default function Chat() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [rooms, setRooms] = useState([]);
  const [room, setRoom] = useState("");
  const [newRoom, setNewRoom] = useState("");

  // Load Rooms
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "rooms"), (snapshot) => {
      const roomList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRooms(roomList);

      if (roomList.length > 0 && room === "") {
        setRoom(roomList[0].name);
      }
    });

    return () => unsubscribe();
  }, [room]);

  // Load Messages
  useEffect(() => {
    const q = query(collection(db, "messages"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filtered = data.filter((msg) => msg.room === room);

      setMessages(filtered);
    });

    return () => unsubscribe();
  }, [room]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    await addDoc(collection(db, "messages"), {
      text: message,
      user: auth.currentUser.email,
      room,
      createdAt: serverTimestamp(),
    });

    setMessage("");
  };

  const createRoom = async () => {
    if (!newRoom.trim()) return;

    const exists = rooms.some(
      (r) => r.name.toLowerCase() === newRoom.toLowerCase()
    );

    if (exists) {
      alert("Room already exists");
      return;
    }

    await addDoc(collection(db, "rooms"), {
      name: newRoom,
    });

    setRoom(newRoom);
    setNewRoom("");
  };

  const deleteMessage = async (id) => {
    await deleteDoc(doc(db, "messages", id));
  };

  const logout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
  <div
    style={{
      display: "flex",
      width: "100%",
      height: "100vh",
      background: "#dadbd3",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div
      style={{
        width: "95%",
        height: "95vh",
        display: "flex",
        background: "#fff",
        boxShadow: "0 2px 15px rgba(0,0,0,0.2)",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "30%",
          background: "#f0f2f5",
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid #ddd",
        }}
      >
        <div
          style={{
            background: "#075E54",
            color: "white",
            padding: "18px",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          💬 React Chat
        </div>

        <div style={{ padding: "15px" }}>
          <input
            value={newRoom}
            onChange={(e) => setNewRoom(e.target.value)}
            placeholder="Create new room..."
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "20px",
              border: "1px solid #ccc",
              outline: "none",
              marginBottom: "10px",
            }}
          />

          <button
            onClick={createRoom}
            style={{
              width: "100%",
              padding: "10px",
              background: "#128C7E",
              color: "white",
              border: "none",
              borderRadius: "20px",
              cursor: "pointer",
            }}
          >
            + Create Room
          </button>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
          }}
        >
          {rooms.map((r) => (
            <div
              key={r.id}
              onClick={() => setRoom(r.name)}
              style={{
                padding: "15px",
                cursor: "pointer",
                background:
                  room === r.name ? "#d9fdd3" : "white",
                borderBottom: "1px solid #eee",
                fontWeight:
                  room === r.name ? "bold" : "normal",
              }}
            >
              💬 {r.name}
            </div>
          ))}
        </div>

        <button
          onClick={logout}
          style={{
            margin: "15px",
            padding: "10px",
            border: "none",
            borderRadius: "20px",
            background: "#d9534f",
            color: "white",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* Chat Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#efeae2",
        }}
      >
        <div
          style={{
            background: "#075E54",
            color: "white",
            padding: "18px",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          💬 {room}
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: "flex",
                justifyContent:
                  msg.user === auth.currentUser.email
                    ? "flex-end"
                    : "flex-start",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  background:
                    msg.user === auth.currentUser.email
                      ? "#DCF8C6"
                      : "white",
                  padding: "12px",
                  borderRadius: "10px",
                  maxWidth: "60%",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                }}
              >
                <strong>{msg.user}</strong>

                <div style={{ marginTop: "5px" }}>
                  {msg.text}
                </div>

                {msg.user === auth.currentUser.email && (
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    style={{
                      marginTop: "8px",
                      border: "none",
                      background: "#d9534f",
                      color: "white",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            padding: "15px",
            background: "#f0f2f5",
          }}
        >
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "25px",
              border: "1px solid #ccc",
              outline: "none",
            }}
          />

          <button
            onClick={sendMessage}
            style={{
              marginLeft: "10px",
              padding: "12px 20px",
              border: "none",
              borderRadius: "25px",
              background: "#128C7E",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
);
}
  
      
  
