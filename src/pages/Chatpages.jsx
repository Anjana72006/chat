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
        background:
          "linear-gradient(135deg,#0f172a,#1e293b,#111827)",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "95%",
          height: "95vh",
          display: "flex",
          background: "#ffffff",
          borderRadius: "22px",
          overflow: "hidden",
          boxShadow: "0 20px 50px rgba(0,0,0,.45)",
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            width: "30%",
            background: "#111827",
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid #2d3748",
          }}
        >
          <div
            style={{
              background:
                "linear-gradient(135deg,#1f2937,#111827)",
              color: "#fff",
              padding: "22px",
              fontSize: "24px",
              fontWeight: "bold",
              letterSpacing: "1px",
            }}
          >
            💬 React Chat
          </div>

          <div style={{ padding: "16px" }}>
            <input
              value={newRoom}
              onChange={(e) => setNewRoom(e.target.value)}
              placeholder="Create new room..."
              style={{
                width: "100%",
                padding: "13px 16px",
                borderRadius: "12px",
                border: "1px solid #374151",
                background: "#1f2937",
                color: "#fff",
                outline: "none",
                marginBottom: "12px",
                fontSize: "15px",
                boxSizing: "border-box",
              }}
            />

            <button
              onClick={createRoom}
              style={{
                width: "100%",
                padding: "13px",
                background:
                  "linear-gradient(135deg,#3b82f6,#2563eb)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "15px",
                transition: ".3s",
              }}
            >
              + Create Room
            </button>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "0 8px",
            }}
          >
            {rooms.map((r) => (
              <div
                key={r.id}
                onClick={() => setRoom(r.name)}
                style={{
                  padding: "16px",
                  margin: "8px 0",
                  borderRadius: "12px",
                  cursor: "pointer",
                  background:
                    room === r.name ? "#2563eb" : "#1f2937",
                  color: "white",
                  fontWeight: "600",
                  transition: ".25s",
                  boxShadow:
                    room === r.name
                      ? "0 10px 20px rgba(37,99,235,.3)"
                      : "none",
                }}
              >
                # {r.name}
              </div>
            ))}
                      </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            style={{
              margin: "16px",
              padding: "14px",
              border: "none",
              borderRadius: "12px",
              background:
                "linear-gradient(135deg,#ef4444,#dc2626)",
              color: "white",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "15px",
            }}
          >
            Logout
          </button>
        </div>


        {/* Chat Area */}
        <div
          style={{
            width: "70%",
            display: "flex",
            flexDirection: "column",
            background: "#f8fafc",
          }}
        >

          {/* Chat Header */}
          <div
            style={{
              height: "75px",
              display: "flex",
              alignItems: "center",
              padding: "0 25px",
              background:
                "linear-gradient(135deg,#ffffff,#e5e7eb)",
              borderBottom: "1px solid #d1d5db",
              fontSize: "22px",
              fontWeight: "700",
              color: "#111827",
            }}
          >
            #{room || "Select Room"}
          </div>


          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "20px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
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
                }}
              >

                <div
                  style={{
                    maxWidth: "65%",
                    padding: "12px 16px",
                    borderRadius:
                      msg.user === auth.currentUser.email
                        ? "18px 18px 0 18px"
                        : "18px 18px 18px 0",

                    background:
                      msg.user === auth.currentUser.email
                        ? "#2563eb"
                        : "#e5e7eb",

                    color:
                      msg.user === auth.currentUser.email
                        ? "white"
                        : "#111827",

                    position: "relative",
                    boxShadow:
                      "0 4px 10px rgba(0,0,0,.12)",
                  }}
                >

                  <div
                    style={{
                      fontSize: "12px",
                      opacity: ".7",
                      marginBottom: "5px",
                    }}
                  >
                    {msg.user}
                  </div>


                  <div
                    style={{
                      fontSize: "16px",
                    }}
                  >
                    {msg.text}
                  </div>


                  {msg.user === auth.currentUser.email && (
                    <button
                      onClick={() =>
                        deleteMessage(msg.id)
                      }
                      style={{
                        marginTop: "8px",
                        background: "transparent",
                        border: "none",
                        color: "#fecaca",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                    >
                      Delete
                    </button>
                  )}

                </div>

              </div>
            ))}

          </div>


          {/* Message Input */}
          <div
            style={{
              display: "flex",
              padding: "18px",
              background: "white",
              borderTop: "1px solid #d1d5db",
              gap: "12px",
            }}
          >

            <input
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="Type a message..."
              style={{
                flex: 1,
                padding: "15px 18px",
                borderRadius: "25px",
                border: "1px solid #cbd5e1",
                outline: "none",
                fontSize: "15px",
                background: "#f8fafc",
              }}
            />


            <button
              onClick={sendMessage}
              style={{
                width: "120px",
                border: "none",
                borderRadius: "25px",
                background:
                  "linear-gradient(135deg,#2563eb,#1d4ed8)",
                color: "white",
                fontWeight: "700",
                cursor: "pointer",
                fontSize: "15px",
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

 
        
     
            
           
       
