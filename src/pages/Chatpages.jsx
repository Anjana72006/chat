import { useState, useEffect } from "react";
import "./Chat.css";
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
<div className="chat-page">

  <div className="chat-container">

    {/* Sidebar */}
    <div className="sidebar">

      <div className="chat-title">
        💬 React Chat
      </div>


      <div className="room-create">

        <input
          value={newRoom}
          onChange={(e)=>setNewRoom(e.target.value)}
          placeholder="Create new room..."
        />

        <button onClick={createRoom}>
          + Create Room
        </button>

      </div>


      <div className="rooms">

        {rooms.map((r)=>(

          <div
          key={r.id}
          onClick={()=>setRoom(r.name)}
          className={
            room===r.name
            ?"room active"
            :"room"
          }
          >

          💬 {r.name}

          </div>

        ))}

      </div>


      <button
      className="logout"
      onClick={logout}
      >
      Logout
      </button>


    </div>



    {/* Chat Area */}

    <div className="chat-area">


      <div className="chat-header">
        💬 {room}
      </div>


      <div className="messages">


      {messages.map((msg)=>(

      <div
      key={msg.id}
      className={
        msg.user===auth.currentUser.email
        ?"message right"
        :"message left"
      }
      >


      <div className="bubble">

      <strong>{msg.user}</strong>

      <p>{msg.text}</p>


      {
      msg.user===auth.currentUser.email &&
      <button
      className="delete"
      onClick={()=>deleteMessage(msg.id)}
      >
      Delete
      </button>
      }


      </div>


      </div>


      ))}


      </div>



      <div className="send-box">


      <input
      value={message}
      onChange={(e)=>setMessage(e.target.value)}
      onKeyDown={(e)=>{
        if(e.key==="Enter") sendMessage()
      }}
      placeholder="Type a message..."
      />


      <button onClick={sendMessage}>
      Send
      </button>


      </div>


    </div>



  </div>


</div>
);
