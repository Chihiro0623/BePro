import OutlineTitle from "../OutlineTitle";
import ResumeTable from "../UserRouter/ResumeTable";
import Participant from "./Participant";
import "../../css/main.css";
import "../../css/board.css";
import "../../css/project.css";
import { CssBaseline } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ParticipantList({ uid, userName }) {
  const [data, setData] = useState({
    posttype: 0,
    title: "",
    writer: "",
    createdAt: "",
    likes: 0,
    _id: "",
    description: "",
    comments: [],
    participants: [],
  });
  const [detail, setDetail] = useState(false);
  const [participantUid, setParticipantUid] = useState("");
  const [participant, setParticipant] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/post/${sessionStorage.getItem("_id")}`)
      .then((res) => {
        setData(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          alert("해당 글이 존재하지 않습니다.");
          navigate("/");
        } else if (err.response.status === 500) {
          alert("DB error");
        } else {
          console.log(err);
        }
      });
  }, []);

  const setDatafunc = (item) => {
    setParticipant(item);
  };

  const participantDetail = (id) => {
    if (data.writer !== uid) {
      alert("유저의 이력서는 프로젝트 관리자만 확인 가능합니다.");
      return;
    }
    console.log(id);
    setParticipantUid(id);
    setDetail(!detail);
  };

  //Participant 컴포넌트 이용해야됨
  const ParticipantList = () => {
    return (
      <div className="participant_list">
        {data.participants.map((participant) => {
          return <Participant key={participant} participant={participant} participantDetail={participantDetail} />;
        })}
      </div>
    );
  };

  return (
    <div>
      <CssBaseline />
      <header>
        <OutlineTitle userName={userName} />
      </header>
      <main>
        <h1>{data.title}</h1>
        <p>{data.createdAt.slice(2, 10)}</p>
        {detail ? (
          <ResumeTable
            propsData={participant}
            setDatafunc={(item) => {
              setDatafunc(item);
            }}
            propsToggle={false}
            uid={participantUid}
          />
        ) : (
          <ParticipantList />
        )}
      </main>
      <footer>
        <div className="info">
          <a href="http://www.ajou.ac.kr" target="_blank" rel="noreferrer">
            <img src="https://www.ajou.ac.kr/_res/ajou/kr/img/intro/img-system06.png" alt="http://www.ajou.ac.kr" width="200px" />
          </a>
        </div>
      </footer>
    </div>
  );
}
