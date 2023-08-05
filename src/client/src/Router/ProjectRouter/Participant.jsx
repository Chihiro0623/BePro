import axios from "axios";
import { useState, useEffect } from "react";
import "../../css/project.css";

export default function Participant({ participant, participantDetail }) {
  const [userinfo, setUserinfo] = useState({ fileid: "", username: "" });
  const [file, setFile] = useState("");

  useEffect(() => {
    console.log(participant);
    axios
      .get(`/api/user/${participant}`)
      .then((res) => {
        setUserinfo(res.data.data.user);
        console.log(res.data.data.user);
        if (res.data.data.user.fileid !== undefined) {
          console.log(res.data);
          setFile("http://210.107.197.182:3400/uploaded/" + res.data.data.user.fileid._id + "!" + res.data.data.user.fileid.originalname);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 404) {
          alert("해당하는 유저가 존재하지 않습니다.");
        } else if (err.response.status === 500) {
          alert("DB error");
        } else {
          alert("error");
          console.log(err);
        }
      });
  }, []);
  return (
    <div className="participant" key={participant} onClick={() => participantDetail(participant)}>
      <img src={file ? file : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5aSSsOYE2kGFloVt8UbHgjAwZ6Z7GaCpbDQ&usqp=CAU"} width="100px" />
      <div>
        <h4>{userinfo.username}</h4>
        <p>{userinfo.position ? userinfo.position : "(포지션 없음)"}</p>
      </div>
    </div>
  );
}
