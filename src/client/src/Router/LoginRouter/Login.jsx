import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import "../../css/login.css";
import axios from "axios";

export default function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const signin = (e) => {
    e.preventDefault();
    if (userId === "") {
      alert("아이디을 입력해주세요.");
      return;
    }
    if (password === "") {
      alert("비밀번호를 입력해주세요.");
      return;
    }
    axios
      .post("/api/auth/signin", {
        userid: userId,
        password: password,
      })
      .then((res) => {
        console.log(res.headers);
        window.location.replace("/");
        // console.log(res);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setErrorMessage("* 아이디가 존재하지 않습니다.");
        } else if (err.response.status === 401) {
          setErrorMessage("* 비밀번호가 일치하지 않습니다.");
        } else {
          alert("error");
          console.log(err);
        }
      });
  };

  const onChange = (e) => {
    if (e.target.id === "textfield-id") setUserId(e.target.value);
    else setPassword(e.target.value);
  };

  return (
    <div className="login">
      <a href="/" className="login_title">
        <h1 className="login_title">베 프 로</h1>
      </a>
      <Box
        className="login_box"
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField id="textfield-id" label="아이디" variant="standard" onChange={onChange} />
        <TextField id="textfield-password" label="비밀번호" variant="standard" type="password" onChange={onChange} />
        <button className="login_button" onClick={signin}>
          로그인
        </button>
      </Box>
      <div className="signup_massege">
        <a>아직 회원이 아니세요?</a>
        <a href="SignUp" className="signup_link">
          회원가입
        </a>
      </div>
      <p className="errorMessage">{errorMessage}</p>
    </div>
  );
}
