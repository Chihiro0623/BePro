import Outline from "./Router/Outline";
import Login from "./Router/LoginRouter/Login";
import SignUp from "./Router/LoginRouter/SignUp";
import Post from "./Router/Board/Post";
import WritePost from "./Router/Board/WritePost";
import ParticipantList from "./Router/ProjectRouter/ParticipantList";
import Participant from "./Router/ProjectRouter/Participant";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [uid, setUid] = useState("");
  const [userName, setUserName] = useState("");
  const [participating, setParticipating] = useState([]);

  useEffect(() => {
    axios
      .get("/api/user/me")
      .then((res) => {
        setUid(res.data.data.user.userid);
        setUserName(res.data.data.user.username);
        setParticipating(res.data.data.user.participating);
        console.log(res.data);
      })
      .catch((err) => {
        if (err.response.status) {
          setUid(null);
          setUserName(null);
        } else {
          alert("error");
          console.log(err);
        }
      });
    // setUid(sessionStorage.getItem("uid"));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Outline uid={uid} userName={userName} participating={participating} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/post" element={<Post uid={uid} userName={userName} participating={participating} />} />
        <Route path="/newpost" element={<WritePost uid={uid} userName={userName} />} />
        <Route path="/project/participant" element={<ParticipantList uid={uid} userName={userName} />} />
      </Routes>
    </BrowserRouter>
  );
}
