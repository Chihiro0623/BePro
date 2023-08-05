import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useEffect } from "react";
import axios from "axios";

import "../../css/user.css";

function ResumeTable(props) {
  useEffect(() => {
    axios.get(`/api/user/${props.uid}`).then((res) => {
      props.setDatafunc(res.data.data.user);
      console.log(res.data);
    });
  }, []);

  const nameChangeHandler = (event) => {
    props.setDatafunc((prevState) => {
      return { ...prevState, username: event.target.value };
    });
  };
  const phoneChangeHandler = (event) => {
    props.setDatafunc((prevState) => {
      return { ...prevState, contact: event.target.value };
    });
  };
  const mailChangeHandler = (event) => {
    props.setDatafunc((prevState) => {
      return { ...prevState, email: event.target.value };
    });
  };

  const positionChangeHandler = (event) => {
    props.setDatafunc((prevState) => {
      return { ...prevState, position: event.target.value };
    });
  };

  const careerChangeHandler = (event) => {
    props.setDatafunc((prevState) => {
      return { ...prevState, career: event.target.value };
    });
  };

  const interestChangeHandler = (event) => {
    props.setDatafunc((prevState) => {
      return { ...prevState, field: event.target.value };
    });
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={3} align="center">
              이 력 서
            </TableCell>
          </TableRow>
        </TableHead>
        <TableRow>
          <TableCell align="center">이름</TableCell>
          <TableCell align="center">{props.propsData.username}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="center">연락처</TableCell>
          <TableCell align="center">
            {props.propsToggle ? <input onChange={phoneChangeHandler} value={props.propsData.contact}></input> : props.propsData.contact}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="center">메일</TableCell>
          <TableCell align="center">
            {props.propsToggle ? <input onChange={mailChangeHandler} value={props.propsData.email}></input> : props.propsData.email}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="center">희망 포지션</TableCell>
          <TableCell align="center">
            {props.propsToggle ? <input onChange={positionChangeHandler} value={props.propsData.position}></input> : props.propsData.position}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="center">경력</TableCell>
          <TableCell align="center">
            {props.propsToggle ? <input onChange={careerChangeHandler} value={props.propsData.career}></input> : props.propsData.career}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell align="center">관심 분야</TableCell>
          <TableCell align="center">
            {props.propsToggle ? <input onChange={interestChangeHandler} value={props.propsData.field}></input> : props.propsData.field}
          </TableCell>
        </TableRow>
      </Table>
    </TableContainer>
  );
}

export default ResumeTable;
