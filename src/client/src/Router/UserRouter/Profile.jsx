import { useEffect, useState } from "react";
import { useRef } from "react";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "../../css/user.css";
import axios from "axios";

function Profile(props) {
  const [profile, setProfile] = useState({});
  const [toggle, setToggle] = useState(false);
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    axios.get(`/api/user/${props.uid}`).then((res) => {
      setProfile(res.data.data.user);
      console.log("ok");
      if (res.data.data.user.fileid !== undefined) {
        setFile("http://210.107.197.182:3400/uploaded/" + res.data.data.user.fileid._id + "!" + res.data.data.user.fileid.originalname);
      }
    });
  }, []);

  const formData = new FormData();

  const handleFile = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const clickConfirmBtn = () => {
    formData.append("file", file);
    formData.append("fileName", fileName);
    axios
      .post(`/api/file`, formData)
      .then((res) => {
        console.log(res);
        // setProfile((prevState) => {
        //   return { ...prevState, fileid: res.data.fileid };
        // });
        return res.data.fileid;
      })
      .then((item) => {
        const edited = { ...profile, fileid: item };
        axios
          .put(`/api/user/${props.uid}`, edited)
          .then((res) => {
            console.log(res);
            setProfile(profile);
            // setToggle(!toggle);
            if (res.data.data.user.fileid !== undefined)
              setFile("http://210.107.197.182:3400/uploaded/" + res.data.data.user.fileid._id + "!" + res.data.data.user.fileid.originalname);
          })
          .then(() => setToggle(!toggle));
      });
  };
  // const clickEditBtn = () => {
  //   if (toggle === true) {

  //   }
  //   if (!profile.name) {
  //     alert("이름을 입력해 주세요.");
  //   }

  //   if (!profile.email) {
  //     alert("메일을 입력해 주세요.");
  //   }

  //   if (!profile.contact) {
  //     alert("연락처를 입력해 주세요.");
  //   }
  //   if (profile.name && profile.email && profile.contact) {
  //     console.log(profile);
  //     setToggle(!toggle);
  //   }
  // };

  const nameChangeHandler = (event) => {
    setProfile((prevState) => {
      return { ...prevState, username: event.target.value };
    });
  };
  const phoneChangeHandler = (event) => {
    setProfile((prevState) => {
      return { ...prevState, contact: event.target.value };
    });
  };
  const mailChangeHandler = (event) => {
    setProfile((prevState) => {
      return { ...prevState, email: event.target.value };
    });
  };
  const clickEditBtn = () => {
    setToggle(!toggle);
  };

  const clickCancelBtn = () => {
    axios.get(`/api/user/${props.uid}`).then((res) => setProfile(res.data.data.user));
    setToggle(!toggle);
  };

  return (
    <TableContainer component={Paper}>
      <Table className="profile_table" sx={{ borderColor: "divider" }} aria-label="profile table">
        <TableHead>
          <TableRow>
            <TableCell id="table-head" colSpan={3} align="center">
              <p>내 프로필</p>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableRow>
          <TableCell id="img-cell" width="300px" height="400px" align="center" rowSpan={4}>
            {toggle ? (
              <div>
                <input accept="image/*" type="file" onChange={handleFile} />
              </div>
            ) : (
              <div>
                <img
                  src={file !== null ? file : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5aSSsOYE2kGFloVt8UbHgjAwZ6Z7GaCpbDQ&usqp=CAU"}
                  alt=""
                />
              </div>
            )}
          </TableCell>
          <TableCell className="profile_th" rowSpan={1} align="left">
            이름
          </TableCell>
          <TableCell className="profile_td" rowSpan={1} align="right">
            {toggle ? <input onChange={nameChangeHandler} value={profile.username}></input> : profile.username}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="profile_th" rowSpan={1} align="left">
            연락처
          </TableCell>
          <TableCell className="profile_td" rowSpan={1} align="right">
            {toggle ? <input onChange={phoneChangeHandler} value={profile.contact}></input> : profile.contact}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="profile_th" rowSpan={1} align="left">
            이메일
          </TableCell>
          <TableCell className="profile_td" rowSpan={1} align="right">
            {toggle ? <input onChange={mailChangeHandler} value={profile.email}></input> : profile.email}
          </TableCell>
        </TableRow>
      </Table>
      <div className="editContainer">
        <span id="edit-btn" onClick={clickEditBtn}>
          {toggle || !props.uid ? null : "수정"}
        </span>
        {toggle ? <span onClick={clickConfirmBtn}>확인</span> : null}
        {toggle ? <span onClick={clickCancelBtn}>취소</span> : null}
      </div>
    </TableContainer>
  );
}

export default Profile;
