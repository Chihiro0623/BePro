import { useEffect, useState } from "react";
import ProjectOutline from "./ProjectOutline";
import "../../css/project.css";
import axios from "axios";

export default function ProjectList({ uid, participating }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("/api/post", {
        params: {
          writer: uid,
          posttype: 1,
        },
      })
      .then((res) => {
        setData(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          setData([]);
        } else if (err.response.status === 500) {
          alert("DB error");
        } else {
          alert("error");
        }
      });
  }, []);

  const Projects = () => {
    return (
      <div>
        <h1>지원한 프로젝트</h1>
        <hr />
        <div className="projectList">
          {participating.map((item) => {
            return <ProjectOutline key={item._id} data={item} />;
          })}
        </div>
        <br />
        <br />
        <br />
        <h1>관리중인 프로젝트</h1>
        <hr />
        <div className="projectList">
          {data.map((item) => {
            return <ProjectOutline key={item._id} data={item} />;
          })}
        </div>
      </div>
    );
  };

  return <Projects />;
}
