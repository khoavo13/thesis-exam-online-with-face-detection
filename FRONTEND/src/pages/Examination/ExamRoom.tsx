import { useContext, useEffect, useRef, useState } from "react";
import ExamRoomLayout from "../../components/ExamRoomLayout";
import Examination from "./Examination";
import WaitingRoom from "../WaitingRoom/WaitingRoom";
import { useNavigate, useParams } from "react-router-dom";
import { message } from "antd";
import { axiosDJ } from "../../api/axios";
import ExamRoomContext from "../../context/ExamRoomProvider";
import StudentRoomContext from "../../context/StudentRoomProvider";

let absenceStatus = false;

export default function ExamRoom() {
  const { examInfo, jitsiApiRef } = useContext(ExamRoomContext);
  const { isAbsence, setIsAbsence } = useContext(StudentRoomContext);
  const { roomId, userId } = useParams();

  const navigate = useNavigate();

  const [logItems, setLogItems] = useState<string[]>([]);
  const [item, setItem] = useState<JSX.Element>();

  const absenceRef = useRef<boolean>(absenceStatus);

  const handleExamFinish = () => {
    setItem(
      <WaitingRoom
        examFinished={true}
        openExam={openExam}
        examInfo={examInfo!}
        setLogItems={setLogItems}
      />
    );

    setTimeout(() => {
      navigate("/", { replace: true });
    }, 5000);
  };

  const openExam = () => {
    setItem(
      <Examination
        examId={examInfo?.examId.toString() ?? ""}
        userId={userId ?? ""}
        time={examInfo?.time ?? 0}
        handleExamFinish={handleExamFinish}
        setLogItems={setLogItems}
      />
    );
  };

  const openWaitingRoom = (isFinished: boolean) => {
    setItem(
      <WaitingRoom
        examFinished={isFinished}
        openExam={openExam}
        examInfo={examInfo!}
        setLogItems={setLogItems}
      />
    );
  };

  const verrifyFace = async (image: any) => {
    try {
      const response = await axiosDJ.post("/api/face/recognize/", {
        userId: Number(userId),
        image: image.dataURL,
        roomId: Number(roomId),
        absence: absenceRef.current,
      });

      if (response.data.verification) {
        console.log("Normal, Absence status: ", absenceRef.current);
        if (absenceRef.current) setIsAbsence!(false);
      } else if (!absenceRef.current) {
        console.log("Có bất thường.");
      } else {
        console.log("Still absence");
      }

      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log("isAbsence changed to ", isAbsence);

    absenceRef.current = isAbsence!;
  }, [isAbsence]);

  useEffect(() => {
    if (examInfo) openWaitingRoom(false);
  }, [examInfo]);

  useEffect(() => {
    if (item?.type !== Examination) return;

    const verifyInterval = setInterval(() => {
      jitsiApiRef?.current?.captureLargeVideoScreenshot().then((img) => {
        verrifyFace(img);
      });
    }, 20000);

    return () => {
      clearInterval(verifyInterval);
    };
  }, [item]);

  return <ExamRoomLayout>{item ?? ""}</ExamRoomLayout>;
}
