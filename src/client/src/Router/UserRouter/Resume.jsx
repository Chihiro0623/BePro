import { useState, useEffect } from "react";
import ResumeTable from "./ResumeTable";
import axios from "axios";
import "../../css/user.css";

function Resume(props) {
  const [data, setData] = useState({});

  // useEffect(() => {
  //   axios
  //     .get(`/api/user/${props.uid}/resume`)
  //     .then((res) => setData(res.data.data.user));
  // }, []);

  const [toggle, setToggle] = useState(false);

  // const clickEditBtn = () => {
  //   if (toggle === true) {
  //     axios.put(`/api/user/${props.uid}/resume`, data).then(()=>{alert("수정되었습니다.")})
  //     console.log(data);
  //     console.log("ok");
  //   }
  //   if (!data.name) {
  //     alert("이름을 입력해 주세요.");
  //   }

  //   if (!data.email) {
  //     alert("메일을 입력해 주세요.");
  //   }

  //   if (!data.contact) {
  //     alert("연락처를 입력해 주세요.");
  //   }
  //   if (!data.career) {
  //     alert("연락처를 입력해 주세요.");
  //   }
  //   if (!data.interest) {
  //     alert("연락처를 입력해 주세요.");
  //   }
  //   if (data.name && data.email && data.phone && data.career && data.interest && data.position) {
  //     setToggle(!toggle);
  //   }
  // };

  const clickEditBtn = () => {
    setToggle(!toggle);
  };

  const clickConfirmBtn = () => {
    axios.put(`/api/user/${props.uid}`, data).then(() => console("수정하였습니다."));
    setToggle(!toggle);
  };

  const clickCancelBtn = () => {
    axios.get(`/api/user/${props.uid}`).then((res) => setData(res.data.data.user));
    setToggle(!toggle);
  };

  const setDatafunc = (item) => {
    setData(item);
  };

  return (
    <div>
      <ResumeTable
        propsData={data}
        setDatafunc={(item) => {
          setDatafunc(item);
        }}
        propsToggle={toggle}
        uid={props.uid}
      />
      <div className="editContainer">
        <span id="edit-btn" onClick={clickEditBtn}>
          {toggle || !props.uid ? null : "수정"}
        </span>
        {toggle ? <span onClick={clickConfirmBtn}>확인</span> : null}
        {toggle ? <span onClick={clickCancelBtn}>취소</span> : null}
      </div>
    </div>
  );
}

export default Resume;
