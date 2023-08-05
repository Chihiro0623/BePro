import axios from "axios";
import "../css/main.css";

export default function OutlineTitle({ userName }) {
  const logout = (e) => {
    e.preventDefault();
    console.log("logout clicked");
    axios.get("/api/auth/logout").then(() => {
      console.log("logout");
      window.location.replace("/");
    });
  };
  return (
    <div className="title">
      <a href="/" className="title_link">
        <h1 className="title_h1">베 프 로</h1>
      </a>
      {userName === null ? (
        <a className="login_link" href="Login">
          로그인하세요
        </a>
      ) : (
        <div>
          <a className="login_link">안녕하세요 {userName}님!</a>
          <a className="logout" onClick={logout} href="/">
            로그아웃
          </a>
        </div>
      )}
    </div>
  );
}
