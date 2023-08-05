import { useNavigate } from "react-router-dom";
import PostOutline from "./PostOutline";
import { useEffect, useState } from "react";
import axios from "axios";
import "../../css/board.css";
import Search from "@mui/icons-material/Search";
import CreateIcon from "@mui/icons-material/Create";

export default function BoardOutline({ uid }) {
  const [posts, setPosts] = useState([]);
  const [postType, setPostType] = useState(0);
  const [searchWord, setSearchWord] = useState("");

  useEffect(() => {
    axios
      .get("/api/post")
      .then((res) => {
        setPosts(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setPosts([]);
        } else {
          alert("error");
        }
      });
  }, []);

  const navigate = useNavigate();

  const getPost = (_id) => {
    if (uid === null) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    } else {
      sessionStorage.setItem("_id", _id);
      console.log(_id + " is clicked");
      navigate("/post");
    }
  };

  const post_all = () => {
    if (postType === 0) return;
    console.log("all");
    axios
      .get("/api/post")
      .then((res) => {
        setPosts(res.data);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setPosts([]);
        } else if (err.response.status === 500) {
          alert("DB error");
        } else {
          alert("error");
        }
      })
      .then(() => {
        setPostType(0);
      });
  };

  const post_1 = () => {
    if (postType === 1) return;
    console.log("post_1 clicked");
    axios
      .get("/api/post", {
        params: {
          posttype: 0,
        },
      })
      .then((res) => {
        setPosts(res.data);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setPosts([]);
        } else if (err.response.status === 500) {
          alert("DB error");
        } else {
          alert("error");
        }
      })
      .then(() => {
        setPostType(1);
      });
  };

  const post_2 = () => {
    if (postType === 2) return;
    console.log("post_2 clicked");
    axios
      .get("/api/post", {
        params: {
          posttype: 1,
        },
      })
      .then((res) => {
        setPosts(res.data);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setPosts([]);
        } else if (err.response.status === 500) {
          alert("DB error");
        } else {
          alert("error");
        }
      })
      .then(() => {
        setPostType(2);
      });
  };

  const post_3 = () => {
    if (postType === 3) return;
    console.log("post_3 clicked");
    axios
      .get("/api/post", {
        params: {
          writer: uid,
        },
      })
      .then((res) => {
        setPosts(res.data);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setPosts([]);
        } else if (err.response.status === 500) {
          alert("DB error");
        } else {
          alert("error");
        }
      })
      .then(() => {
        setPostType(3);
      });
  };

  const searchPost = (e) => {
    setPostType(4);
    e.preventDefault();
    console.log(searchWord);
    axios
      .get("/api/post", {
        params: {
          title: searchWord,
        },
      })
      .then((res) => {
        console.log(res);
        setPosts(res.data);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setPosts([]);
        } else if (err.response.status === 500) {
          alert("DB error");
        } else {
          alert("error");
        }
      });
  };

  const writePost = () => {
    navigate("/newpost");
  };

  const PostOutlines = () => {
    return posts.map((post) => {
      return (
        <div
          onClick={() => {
            getPost(post._id);
          }}
          key={post._id}
        >
          <PostOutline uid={uid} post={post} />
        </div>
      );
    });
  };

  return (
    <div>
      <div className="filter">
        <span onClick={post_all}>전체</span>
        <span onClick={post_1}>구인</span>
        <span onClick={post_2}>프로젝트</span>
        <span onClick={post_3}>내 글</span>
      </div>
      <div className="postOutline_top">
        <form>
          <input type="text" placeholder="검색" value={searchWord} className="search" onChange={(e) => setSearchWord(e.target.value)} />
          <button onClick={searchPost} className="searchIcon">
            <Search />
          </button>
        </form>
        <button className="post_write" onClick={writePost} style={{ display: uid === null ? "none" : "box" }}>
          <CreateIcon color="primary" />
        </button>
      </div>
      <PostOutlines />
    </div>
  );
}
