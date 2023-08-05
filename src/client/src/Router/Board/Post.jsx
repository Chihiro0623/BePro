import OutlineTitle from "../OutlineTitle";
import "../../css/main.css";
import "../../css/board.css";
import { CssBaseline } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { red, grey } from "@mui/material/colors";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Post({ uid, userName, participating }) {
  const [comment, setComment] = useState("");
  const [isrevise, setIsrevise] = useState(false);
  const [file, setFile] = useState("");
  const [data, setData] = useState({
    posttype: 0,
    title: "",
    writer: "",
    createdAt: "",
    likes: 0,
    _id: "",
    description: "",
    comments: [],
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/post/${sessionStorage.getItem("_id")}`)
      .then((res) => {
        setData(res.data);
        console.log(res.data);
        if (res.data.fileid !== undefined) {
          setFile("http://210.107.197.182:3400/uploaded/" + res.data.fileid._id + "!" + res.data.fileid.originalname);
        }
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

  // window.confirm()을 컨트롤하는 함수
  const useConfirm = (message = null, onConfirm, onCancel) => {
    if (!onConfirm || typeof onConfirm !== "function") {
      return;
    }
    if (onCancel && typeof onCancel !== "function") {
      return;
    }

    const confirmAction = () => {
      if (window.confirm(message)) {
        onConfirm();
      } else {
        onCancel();
      }
    };

    return confirmAction;
  };

  // 게시글 삭제 확인
  const deleteConfirm = () => {
    axios
      .delete(`/api/post/${data._id}`)
      .then(() => {
        alert("게시글이 삭제되었습니다.");
        navigate("/");
      })
      .catch((err) => {
        if (err.response.status === 404) {
          alert("해당하는 글이 존재하지 않습니다.");
        } else if (err.response.status === 500) {
          alert("DB error");
        }
      });
    console.log("post deleted");
  };

  // 게시글 수정
  const cancelConfirm = () => console.log("request canceled.");
  // 게시글 삭제 요청
  const deleteReq = useConfirm("삭제하시겠습니까?", deleteConfirm, cancelConfirm);

  const putreq = () => {
    // 수정완료 버튼을 누른 경우
    if (isrevise) {
      axios
        .put(`/api/post/${data._id}`, {
          title: data.title,
          description: data.description,
        })
        .then(() => {
          alert("수정되었습니다.");
        })
        .catch((err) => {
          if (err.response.status === 400) {
            alert("수정할 수 없는 항목입니다.");
          } else if (err.response.status === 404) {
            alert("해당하는 글이 존재하지 않습니다.");
          } else if (err.response.status === 500) {
            alert("DB error");
          } else {
            alert("error");
            console.log(err);
          }
        });
    }
    setIsrevise(!isrevise);
  };

  const handleComment = (e) => {
    setComment(e.target.value);
  };

  // 좋아요 요청
  const likeit = () => {
    axios
      .put(`/api/post/${data._id}/like`)
      .then((res) => {
        console.log(res.data);
        setData({ ...data, likes: res.data.likes });
      })
      .catch((err) => {
        if (err.response.status === 404) {
          alert("해당 글이 존재하지 않습니다.");
          navigate("/");
        } else if (err.response.status === 500) {
          alert("DB error");
        } else {
          alert("error");
          console.log(err);
        }
      });
  };

  // 댓글 작성
  const writeComment = () => {
    axios
      .post(`/api/post/${data._id}/comments`, {
        description: comment,
      })
      .then((res) => {
        console.log(res);
        setData({ ...data, comments: res.data });
        setComment("");
      })
      .catch((err) => {
        if (err.response.status === 404) {
          alert("해당 글이 존재하지 않습니다.");
          navigate("/");
        } else if (err.response.status === 500) {
          alert("DB error");
        } else {
          alert("error");
          console.log(err);
        }
      });
  };

  // 프로젝트 참가
  const participate = () => {
    axios
      .put(`/api/post/${data._id}/participate`)
      .then(() => {
        alert("프로젝트 참가 신청이 완료 되었습니다.");
        window.location.replace("/post");
      })
      .catch((err) => {
        if (err.response.status === 404) {
          alert("해당하는 글이 존재하지 않습니다.");
          navigate("/");
        } else if (err.response.status === 500) {
          alert("DB error");
        } else {
          alert("error");
          console.log(err);
        }
      });
  };

  const move = () => {
    sessionStorage.setItem("_id", data.projectpage._id);
    window.location.replace("/post");
  };

  // '\n'를 기준으로 태그를 나누어 출력. 줄바꿈 출력 처리를 위한 코드
  const Textfield = (contents) => {
    return contents.split("\n").map((line, index) => {
      return (
        <p key={index} className="post_contents">
          {line}
        </p>
      );
    });
  };

  // 제목 수정
  const putTitle = (e) => {
    setData({ ...data, title: e.target.value });
  };
  // 본문 수정
  const putDescription = (e) => {
    setData({ ...data, description: e.target.value });
  };

  return (
    <div>
      <CssBaseline />
      <header>
        <OutlineTitle uid={uid} userName={userName} />
      </header>
      <main className="board">
        <div className="post">
          <div className="post_box">
            {isrevise ? <input type="text" className="newpost_title" value={data.title} onChange={putTitle} /> : <h2 className="post_title">{data.title}</h2>}
            <h4 className="post_writer">{data.writer}</h4>
            <h6 className="post_date">{data.createdAt.slice(2, 10)}</h6>
            {isrevise ? <textarea className="newpost_textarea" value={data.description} onChange={putDescription} /> : Textfield(data.description)}
            {file !== null && <img src={file} width="500px" />}
            {data.writer === uid && (
              <div className="post_edit">
                <span onClick={putreq}>{isrevise ? "수정완료" : "수정"}</span>
                <span onClick={deleteReq}>삭제</span>
              </div>
            )}
          </div>
          <div className="post_box">
            {data.posttype === 0 ? (
              <button className="post_btn" onClick={move}>
                프로젝트 페이지로 이동하기
              </button>
            ) : (
              data.writer !== uid &&
              participating.filter((item) => item._id === data._id).length !== 1 && (
                <button className="post_btn" onClick={participate}>
                  프로젝트 지원하기
                </button>
              )
            )}
            <button className="post_btn" onClick={likeit}>
              추천
            </button>
            <span className="post_outline_botright_box">
              <span className="post_outline_likes">{data.likes}</span>
              <FavoriteIcon sx={{ fontSize: 14, color: red[500] }} />
              <span className="post_outline_comments">{data.comments.length}</span>
              <ChatBubbleIcon sx={{ fontSize: 14, color: grey[700] }} />
            </span>
          </div>
          <div className="post_box">
            <textarea className="post_textarea" placeholder="댓글을 입력하세요" value={comment} onChange={handleComment} />
            <div className="post_comment_register">
              <button className="post_btn" onClick={writeComment}>
                작성
              </button>
            </div>
          </div>
          {data.comments.length === 0
            ? ""
            : data.comments.map((comment) => {
                return (
                  <div key={comment._id} className="post_box">
                    <div className="comment_info">
                      <h4 className="comment_writer">{comment.writer}</h4>
                      <h6 className="comment_date">{comment.createdAt.slice(2, 10)}</h6>
                    </div>
                    {Textfield(comment.description)}
                  </div>
                );
              })}
        </div>
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
