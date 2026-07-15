import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function AuthPages() {

  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");



  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      if (isLogin) {

        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      } else {

        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      }


      navigate("/chat");


    } catch (error) {

      alert(error.message);

    }
  };



  return (

    <div
      style={{
        minHeight:"100vh",
        width:"100%",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        background:
          "linear-gradient(135deg,#020617,#111827,#1f2937)",
        fontFamily:"Arial, sans-serif"
      }}
    >


      <div
        style={{
          width:"380px",
          padding:"40px",
          borderRadius:"25px",
          background:
            "rgba(255,255,255,0.08)",
          backdropFilter:"blur(15px)",
          boxShadow:
            "0 20px 50px rgba(0,0,0,.5)",
          color:"white"
        }}
      >


        <h1
          style={{
            textAlign:"center",
            marginBottom:"10px",
            fontSize:"32px"
          }}
        >
          💬 React Chat
        </h1>


        <p
          style={{
            textAlign:"center",
            color:"#cbd5e1",
            marginBottom:"30px"
          }}
        >
          {isLogin
            ? "Login to continue"
            : "Create your account"}
        </p>



        <form onSubmit={handleSubmit}>


          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>
              setEmail(e.target.value)
            }
            required
            style={{
              width:"100%",
              padding:"15px",
              marginBottom:"18px",
              borderRadius:"12px",
              border:"1px solid #374151",
              background:"#111827",
              color:"white",
              outline:"none",
              fontSize:"15px",
              boxSizing:"border-box"
            }}
          />



          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>
              setPassword(e.target.value)
            }
            required
            style={{
              width:"100%",
              padding:"15px",
              marginBottom:"22px",
              borderRadius:"12px",
              border:"1px solid #374151",
              background:"#111827",
              color:"white",
              outline:"none",
              fontSize:"15px",
              boxSizing:"border-box"
            }}
          />



          <button
            type="submit"
            style={{
              width:"100%",
              padding:"15px",
              borderRadius:"12px",
              border:"none",
              cursor:"pointer",
              color:"white",
              fontSize:"16px",
              fontWeight:"700",
              background:
                "linear-gradient(135deg,#2563eb,#3b82f6)"
            }}
          >

            {isLogin ? "Login" : "Register"}

          </button>


        </form>




        <div
          style={{
            textAlign:"center",
            marginTop:"25px",
            color:"#cbd5e1"
          }}
        >

          {isLogin
          ? "Don't have an account?"
          : "Already have an account?"}


          <span
            onClick={()=>
              setIsLogin(!isLogin)
            }
            style={{
              color:"#60a5fa",
              marginLeft:"8px",
              cursor:"pointer",
              fontWeight:"700"
            }}
          >
            {isLogin
            ? "Register"
            : "Login"}

          </span>


        </div>


      </div>


    </div>

  );
}

   
