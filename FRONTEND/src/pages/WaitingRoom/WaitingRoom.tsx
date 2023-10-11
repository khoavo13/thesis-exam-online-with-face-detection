import { Button, Layout, message } from "antd";
import { useContext, useEffect, useRef, useState } from "react";

import VerifyFace from "../VerifyFace/VerifyFace";
import useNotification from "../../hooks/useNotifcation";
import { InfoCircleFilled } from "@ant-design/icons";
import Meeting from "../Examination/Meeting";
import { IJitsiMeetExternalApi } from "@jitsi/react-sdk/lib/types";
import ExamRoomContext from "../../context/ExamRoomProvider";
import StudentRoomContext from "../../context/StudentRoomProvider";

export interface WaitingRoomProps {
  name: string;
  date: string;
  time: string;
  children?: React.ReactNode;
}

export interface IExamInfo {
  name: string;
  type: string;
  initFormatDate: string;
  startDate: string;
  time: number;
  examId: number;
}

interface IWaitingRoom {
  openExam: () => void;
  examInfo: IExamInfo;
  examFinished: boolean;
  setLogItems: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function WaitingRoom({
  openExam,
  examInfo,
  examFinished,
  setLogItems,
}: IWaitingRoom) {
  const [exceedLimit, setExceedLimit] = useState<boolean>(false);
  const { openNotification } = useNotification();
  const { isVerified } = useContext(ExamRoomContext);
  const { emitRequestVerify, emitIsVerified, contextHolder, isExamStarted } =
    useContext(StudentRoomContext);

  const checkTime = () => {
    const countTime =
      new Date().getTime() - new Date(examInfo.initFormatDate).getTime();
    if (
      countTime > 0
      // && countTime < examInfo.time
    ) {
      openExam();
    } else {
      openNotification!(
        "top",
        <InfoCircleFilled />,
        <h4 style={{ color: "green" }}>Thông báo</h4>,
        "Chưa đến giờ làm bài"
      );
    }
  };

  const renderWaitingRoom = () => {
    return (
      <div
        style={{
          margin: 0,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          style={{
            textAlign: "center",
          }}
        >
          <h2>Môn thi: {examInfo?.name}</h2>
          <br></br>
          <p>Bắt đầu lúc: {examInfo?.startDate}</p>
          <p>Giới hạn thời gian: {examInfo?.time} phút</p>
          <br></br>

          <Button type="primary" onClick={checkTime}>
            Bắt đầu làm bài
          </Button>
        </div>
      </div>
    );
  };

  const renderExamFinished = () => {
    return (
      <div
        style={{
          margin: 0,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          style={{
            textAlign: "center",
          }}
        >
          <h2>Môn thi: {examInfo?.name}</h2>
          <br></br>
          <p>Bắt đầu lúc: {examInfo?.startDate}</p>
          <p>Giới hạn thời gian: {examInfo?.time} phút</p>
          <br></br>
          <h3>Bài thi đã kết thúc</h3>
          <h5>Hệ thống sẽ tự động chuyển hướng</h5>
        </div>
      </div>
    );
  };

  const renderVerifyFace = () => {
    return <VerifyFace setExceedLimit={setExceedLimit} />;
  };

  const renderMeeting = () => {
    return (
      <div>
        {contextHolder}
        <Meeting setLogItems={setLogItems} />
      </div>
    );
  };

  useEffect(() => {
    if (exceedLimit) emitRequestVerify!();
  }, [exceedLimit]);

  useEffect(() => {
    if (isVerified) emitIsVerified!();
  }, [isVerified]);

  useEffect(() => {
    if (isExamStarted) openExam();
  }, [isExamStarted]);

  return !examFinished
    ? !isVerified
      ? !exceedLimit
        ? renderVerifyFace()
        : renderMeeting()
      : renderWaitingRoom()
    : renderExamFinished();
}
