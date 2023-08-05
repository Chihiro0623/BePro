import "../../css/project.css";
import { useNavigate } from "react-router-dom";

export default function ProjectOutline({ data }) {
  const navigate = useNavigate();

  const project = () => {
    console.log(data._id);
    if (data._id === undefined) sessionStorage.setItem("_id", data._id);
    else sessionStorage.setItem("_id", data._id);
    navigate("/project/participant");
  };

  return (
    <div className="projectOutline" onClick={project}>
      <h3>{data.title.length > 25 ? data.title.slice(0, 25) + "..." : data.title}</h3>
      <p className="projectOutline_date">{data.createdAt.slice(2, 10)}</p>
    </div>
  );
}
