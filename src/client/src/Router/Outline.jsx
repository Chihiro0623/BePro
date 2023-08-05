import React from "react";
import { Box, Tabs, Tab, CssBaseline } from "@mui/material";
import "../css/main.css";
import BoardOutline from "./Board/BoardOutline";
import OutlineTitle from "./OutlineTitle";
import Profile from "./UserRouter/Profile";
import Resume from "./UserRouter/Resume";
import ProjectList from "./ProjectRouter/ProjectList";
import { useEffect, useState } from "react";

export default function Outline({ uid, userName, participating }) {
  const [currentTab, setCurrentTab] = useState(0);

  // useEffect(() => {
  //   if (sessionStorage.getItem("tab") === null) {
  //     setCurrentTab(0);
  //   } else {
  //     setCurrentTab(parseInt(sessionStorage.getItem("tab")));
  //   }
  // }, []);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    // sessionStorage.setItem("tab", newValue);
  };

  return (
    <div>
      <CssBaseline />
      <header>
        <OutlineTitle userName={userName} />
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="basic tabs" centered>
            <Tab label="게시판" value={0} />
            <Tab label="프로필" value={1} />
            <Tab label="이력서" value={2} />
            <Tab label="내 프로젝트" value={3} />
          </Tabs>
        </Box>
      </header>
      <main>
        {currentTab === 0 && (
          <div className="board">
            <BoardOutline uid={uid} />
          </div>
        )}
        {currentTab === 1 && uid !== null && <Profile uid={uid} />}
        {currentTab === 2 && uid !== null && <Resume uid={uid} />}
        {currentTab === 3 && uid !== null && <ProjectList uid={uid} participating={participating} />}
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
