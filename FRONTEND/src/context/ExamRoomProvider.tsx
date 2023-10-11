import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import axios from "../api/axios";
import { message } from "antd";
import AppContext from "./AppProvider";
import { IJitsiMeetExternalApi } from "@jitsi/react-sdk/lib/types";

interface IApp {
  children: ReactNode;
}

export type ExamRoomType = {
  socket?: Socket;
  examInfo?: IExamInfo;
  isVerified?: boolean;
  setIsVerified?: React.Dispatch<React.SetStateAction<boolean>>;
  jitsiApiRef?: React.MutableRefObject<IJitsiMeetExternalApi | undefined>;
};

export type OnlineUser = {
  id: number;
  socketId: string;
};

export interface IExamInfo {
  name: string;
  type: string;
  startDate: string;
  initFormatDate: string;
  time: number;
  examId: number;
}

const ExamRoomContext = createContext<ExamRoomType>({});

export const ExamRoomProvider: FC<IApp> = ({ children }) => {
  const { auth } = useContext(AppContext);
  const { roomId, userId } = useParams();
  const [socket, setSocket] = useState<Socket>();
  const [examInfo, setExamInfo] = useState<IExamInfo>();
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const jitsiApiRef = useRef<IJitsiMeetExternalApi>();

  const getRoomInfo = async () => {
    try {
      const response = await axios.get(
        `/api/rooms/${auth?.roles.toLowerCase()}/${userId}`
      );

      // @ts-ignore
      const requestData = response.data.find((room) => room.id == roomId);

      console.log(requestData);

      setExamInfo({
        name:
          requestData.exam.subject.name + " " + requestData.exam.subject.code,
        type: requestData.exam.examType,
        startDate: new Intl.DateTimeFormat("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(new Date(new Date(requestData.exam.startDate))),
        initFormatDate: requestData.exam.startDate,
        time: requestData.exam.time,
        examId: requestData.exam.id,
      });
    } catch (error) {
      message.error("Có lỗi xảy ra!");
      console.error(error);
    }
  };

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_REACT_SOCKET_URL);

    newSocket.on("connect", () => {
      setSocket(newSocket);
    });

    // newSocket.on("user-leaved", (data: any) => {
    //   console.log("Some user has leaved: ", data);
    // });

    return () => {
      // newSocket.emit("leave-room", {
      //   roomId: Number(roomId),
      //   userId: Number(userId),
      // });
      newSocket.off("connect");
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (auth) getRoomInfo();
  }, [auth]);

  useEffect(() => {
    if (!socket?.connected) return;

    socket.emit("joinRoom", {
      roomId: Number(roomId),
      userId: Number(userId),
    });

    return () => {};
  }, [socket]);

  return (
    <ExamRoomContext.Provider
      value={{ socket, examInfo, setIsVerified, jitsiApiRef, isVerified }}
    >
      {children}
    </ExamRoomContext.Provider>
  );
};

export default ExamRoomContext;
