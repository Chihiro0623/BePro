import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import "../../css/login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  //   const signin = async () => {
  //     await signInWithEmailAndPassword(auth, email, password)
  //       .then((result) => {
  //         console.log(result);
  //         console.log(result.user.accessToken);
  //         console.log(result.user.displayName);
  //         console.log(result.user.uid);
  //         console.log(userType);
  //         setAccessToken(result.user.accessToken);
  //         setThisUid(result.user.uid);
  //       })
  //       .catch((error) => {
  //         switch (error.code) {
  //           case "auth/wrong-password":
  //             setErrorMessage("*비밀번호가 일치하지 않습니다.");
  //             break;
  //           case "auth/invalid-email":
  //             setErrorMessage("*잘못된 이메일 주소입니다");
  //             break;
  //           case "auth/user-not-found":
  //             setErrorMessage("*가입되지 않은 이메일입니다.");
  //             break;
  //           default:
  //             console.log(error);
  //         }

  //         console.log(error);
  //       });
  //   };

  const navigate = useNavigate();

  const signup = (e) => {
    e.preventDefault();
    if (userName === "") {
      setErrorMessage("* 이름을 입력해주세요.");
      return;
    }
    if (userId === "") {
      setErrorMessage("* 아이디를 입력해주세요.");
      return;
    }
    if (password === "") {
      setErrorMessage("* 비밀번호를 입력해주세요.");
      return;
    }
    if (repeatedPassword === "") {
      setErrorMessage("* 비밀번호를 한 번 더 입력해주세요.");
      return;
    }
    if (password !== repeatedPassword) {
      setErrorMessage("* 비밀번호가 일치하지 않습니다.");
      return;
    }

    axios
      .post("/api/auth/signup", {
        userid: userId,
        password: password,
        username: userName,
      })
      .then((response) => {
        console.log(response);
        alert("회원가입에 성공했습니다!");
        window.location.replace("/login");
      })
      .catch((err) => {
        if (err.response.status === 409) {
          setErrorMessage("* 아이디가 중복되었습니다.");
        } else {
          alert("error");
          console.log(err);
        }
      });
  };

  const onChange = (e) => {
    if (e.target.id === "textfield-id") setUserId(e.target.value);
    else if (e.target.id === "textfield-password") setPassword(e.target.value);
    else if (e.target.id === "textfield-userName") setUserName(e.target.value);
    else setRepeatedPassword(e.target.value);
    // console.log(userId);
    // console.log(password);
    // console.log(repeatedPassword);
    // console.log(userName);
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
        <TextField id="textfield-userName" label="이름" variant="standard" onChange={onChange} />
        <TextField id="textfield-id" label="아이디" variant="standard" onChange={onChange} />
        <TextField id="textfield-password" label="비밀번호" variant="standard" type="password" onChange={onChange} />
        <TextField id="textfield-repeatPassword" label="비밀번호 확인" variant="standard" type="password" onChange={onChange} />
        <button className="login_button" onClick={signup}>
          회원가입
        </button>
      </Box>
      <p className="errorMessage">{errorMessage}</p>
    </div>
  );
}
