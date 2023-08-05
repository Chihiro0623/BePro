import OutlineTitle from "../OutlineTitle";
import { CssBaseline } from "@mui/material";
import "../../css/main.css";
import "../../css/board.css";
import { useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function WritePost({ uid, userName }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [posttype, setPosttype] = useState(0);
  const [selected, setSelected] = useState("");
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("");
  const [selectList, setSelectList] = useState([]);

  // fullpath
  // 3, 1.pdf
  // fileid, originalname
  // as;lkdfja;lskdjf;alskdjf/3!1.pdf

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/post", {
        params: {
          writer: uid,
          posttype: 1,
        },
      })
      .then((res) => {
        console.log(res);
        setSelectList(
          res.data.map((item) => {
            return { title: item.title, _id: item._id };
          })
        );
        setSelected(res.data[0]._id);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setSelectList([]);
        } else if (err.response.status === 500) {
          alert("DB error");
        } else {
          alert("error");
        }
      });
  }, []);

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleContent = (e) => {
    setContent(e.target.value);
  };

  const posttypeChange = (e) => {
    e.preventDefault();
    console.log(parseInt(e.target.value));
    setPosttype(parseInt(e.target.value));
  };

  const handleSelect = (e) => {
    setSelected(e.target.value);
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const submitPost = () => {
    if (title === "") {
      alert("제목을 입력해주세요.");
      return;
    }
    if (content === "") {
      alert("내용을 입력해주세요.");
      return;
    }
    if (posttype === 1 && !file) {
      alert("파일을 등록해주세요.");
      return;
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("fileName", fileName);

    console.log(file);
    console.log(fileName);

    if (posttype === 1) {
      axios
        .post("/api/file", formData)
        .then((res) => {
          console.log(res.data);
          axios
            .post("/api/post", {
              title: title,
              description: content,
              posttype: posttype,
              writer: uid,
              fileid: res.data.fileid,
            })
            .then((res) => {
              console.log(res);
              alert("게시글이 작성되었습니다.");
              sessionStorage.setItem("_id", res.data.postid);
              navigate("/post");
            })
            .catch((err) => {
              if (err.response.status === 500) {
                alert("DB error");
              }
            });
        })
        .catch((err) => {
          if (err.response.status === 500) {
            alert("DB error");
          } else {
            alert("error");
          }
        });
    } else {
      console.log(selected);
      axios
        .post("/api/post", {
          title: title,
          description: content,
          posttype: posttype,
          projectpage: selected,
        })
        .then((res) => {
          console.log(res);
          alert("게시글이 작성되었습니다.");
          sessionStorage.setItem("_id", res.data.postid);
          navigate("/post");
        })
        .catch((err) => {
          if (err.response.status === 500) {
            alert("DB error");
          }
        });
    }
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
            <h2 className="newpost_h1">게시글 작성</h2>
            <RadioGroup row onChange={posttypeChange}>
              <FormControlLabel value="0" control={<Radio size="small" />} label="구인 글" />
              <FormControlLabel value="1" control={<Radio size="small" />} label="프로젝트 소개 글" />
            </RadioGroup>
            <input type="text" className="newpost_title" placeholder="제목을 입력하세요" onChange={handleTitle} />
            <textarea className="newpost_textarea" placeholder="내용을 입력하세요" value={content} onChange={handleContent} />
            <div className="newpost_footer">
              {posttype === 0 ? (
                <div className="newpost_chooseproject">
                  프로젝트 선택 :
                  <select onChange={handleSelect} value={selected}>
                    {selectList.map((item) => (
                      <option value={item._id} key={item._id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <input accept="application/pdf" type="file" onChange={handleFile} />
              )}

              <button className="post_btn" onClick={submitPost}>
                작성
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
