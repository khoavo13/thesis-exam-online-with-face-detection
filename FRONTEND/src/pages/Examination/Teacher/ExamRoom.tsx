import { useContext, useEffect, useRef, useState } from "react";
import ExamRoomLayout from "../../../components/ExamRoomLayout";
import VerifyFace from "../../VerifyFace/VerifyFace";
import Meeting from "./Meeting";
import ExamRoomContext from "../../../context/ExamRoomProvider";
import Notify from "./Notify";
import SuperviseRoom from "./SuperviseRoom";
import NotifyRoom, { ITab } from "./NotifyRoom";
import StudentList from "./StudentList";
import RoomInfo from "./RoomInfo";
import VerifyException from "./VerifyException";

const initialItems: ITab[] = [
  {
    label: "Thông tin phòng thi",
    key: "1",
    children: <RoomInfo />,
  },
  {
    label: "Danh sách sinh viên",
    key: "2",
    children: <StudentList />,
  },
  {
    label: "Thông báo",
    key: "3",
    children: <Notify />,
  },
  {
    label: "Ngoại lệ xác thực",
    key: "4",
    children: <VerifyException />,
  },
];

export default function ExamRoom() {
  const { examInfo } = useContext(ExamRoomContext);
  const [item, setItem] = useState<JSX.Element>();
  const [notifyRoomItems, setNotifyRoomItems] = useState<ITab[]>(initialItems);

  const openSuperviseRoom = () => {
    setItem(
      <SuperviseRoom
        leftNode={<Meeting />}
        rightNode={<NotifyRoom tabList={notifyRoomItems} />}
      />
    );
  };

  const openVerifyRoom = () => {
    setItem(<VerifyFace openRoom={openSuperviseRoom} />);
  };

  useEffect(() => {
    if (examInfo) openVerifyRoom();
  }, [examInfo]);

  return <ExamRoomLayout>{item ?? ""}</ExamRoomLayout>;
}
