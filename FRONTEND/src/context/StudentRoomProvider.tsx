import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ExamRoomContext from "./ExamRoomProvider";
import { Modal } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import useNotification from "../hooks/useNotifcation";
import { InfoCircleFilled } from "@ant-design/icons";

interface IApp {
  children: ReactNode;
}

interface UnusualAction {
  type: string;
  description: string;
  occurAt: Date;
  roomId: number;
  userId: number;
}

interface ChatMessage {
  sender: string;
  message: string;
  isPrivate: boolean;
  time: string;
}

export type StudentRoomType = {
  emitRaiseHand?: () => void;
  emitRequestVerify?: () => void;
  confirmAbsence?: () => void;
  emitIsVerified?: () => void;
  addMessage?: (payload: ChatMessage) => void;
  isMutedRef?: React.MutableRefObject<boolean>;
  countRef?: React.MutableRefObject<number>;
  contextHolder?: React.ReactElement<
    any,
    string | React.JSXElementConstructor<any>
  >;
  isAbsence?: boolean;
  setIsAbsence?: React.Dispatch<React.SetStateAction<boolean>>;
  incomingMessage?: boolean;
  setIncomingMessage?: React.Dispatch<React.SetStateAction<boolean>>;
  chatMessages?: ChatMessage[];
  setChatMessages?: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  isExamStarted?: boolean;
};

const StudentRoomContext = createContext<StudentRoomType>({});

let isMuted: boolean = true;
let countUnusual: number = 0;

export const StudentRoomProvider: FC<IApp> = ({ children }) => {
  const { socket, jitsiApiRef, setIsVerified, examInfo } =
    useContext(ExamRoomContext);

  const { roomId, userId } = useParams();

  const { openNotification } = useNotification();

  const isMutedRef = useRef<boolean>(isMuted);

  const countRef = useRef<number>(countUnusual);

  const [modal, contextHolder] = Modal.useModal();

  const navigate = useNavigate();

  const [isAbsence, setIsAbsence] = useState<boolean>(false);

  const [incomingMessage, setIncomingMessage] = useState<boolean>(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const [isExamStarted, setIsExamStarted] = useState(false);

  const confirmAbsence = () => {
    modal.confirm({
      title: "Xác nhận muốn ra ngoài",
      centered: true,
      onOk: () => {
        informAbsence();
      },
      content: "Bài kiểm tra sẽ bị khóa cho đến khi bạn quay trở lại ",
    });
  };

  const handleKickOut = () => {
    let secondsToGo = 5;

    const instance = modal.warning({
      title: "Bạn đã bị giám thị đuổi khỏi phòng!",
      content: `Chuyển hướng đến trang chủ sau ${secondsToGo} giây.`,
      centered: true,
    });

    const timer = setInterval(() => {
      secondsToGo -= 1;
      instance.update({
        content: `Chuyển hướng đến trang chủ sau ${secondsToGo} giây.`,
      });
    }, 1000);

    setTimeout(() => {
      clearInterval(timer);
      instance.destroy();
      navigate("/", { replace: true });
    }, secondsToGo * 1000);
  };

  const handleAllowCommunicate = () => {
    isMutedRef.current = false;

    openNotification!(
      "top",
      <InfoCircleFilled />,
      <h4 style={{ color: "green" }}>Chú ý</h4>,
      `Bạn đã được cho phép phát biểu!`,
      5
    );
  };

  const handleForceMute = () => {
    isMutedRef.current = true;
    jitsiApiRef?.current?.executeCommand("muteEveryone", "audio");
  };

  const handleUnusualAction = (payload: UnusualAction) => {
    console.log("Type of unusual: ", payload.type);

    openNotification!(
      "top",
      <InfoCircleFilled />,
      <h4 style={{ color: "red" }}>Hệ thống phát hiện bất thường</h4>,
      `${
        payload.type === "NO_FACE_DETECTED"
          ? "Không phát hiện khuôn mặt nào"
          : payload.type === "MORE_THAN_ONE_FACE_DETECTED"
          ? "Phát hiện nhiều khuôn mặt"
          : "Khuôn mặt không trùng khớp"
      }`,
      5
    );
  };

  const handleWarning = (data: {
    roomId: number;
    studentId: number;
    count: number;
  }) => {
    openNotification!(
      "top",
      <InfoCircleFilled />,
      <h4 style={{ color: "red" }}>Bạn bị cảnh cáo lần {data.count}</h4>,
      "",
      5
    );
  };

  const handleDenyAccess = () => {
    let secondsToGo = 3;

    const instance = modal.warning({
      title: "Bạn bị từ chối cho vào phòng thi!",
      content: `Chuyển hướng đến trang chủ sau ${secondsToGo} giây.`,
      centered: true,
    });

    const timer = setInterval(() => {
      secondsToGo -= 1;
      instance.update({
        content: `Chuyển hướng đến trang chủ sau ${secondsToGo} giây.`,
      });
    }, 1000);

    setTimeout(() => {
      clearInterval(timer);
      instance.destroy();
      navigate("/", { replace: true });
    }, secondsToGo * 1000);
  };

  const handleDenyCommunicate = () => {
    openNotification!(
      "top",
      <InfoCircleFilled />,
      <h4 style={{ color: "red" }}>Giám thị không cho phép phát biểu</h4>,
      "",
      5
    );
  };

  const handleAllowAccess = () => {
    setIsVerified!(true);
  };

  const handleExamStart = () => {
    console.log("The exam has started");
    setIsExamStarted(true);
  };

  const emitRaiseHand = () => {
    socket?.emit("request-communicate", Number(roomId), Number(userId));
  };

  const emitRequestVerify = () => {
    socket?.emit("request-manual-verify", Number(roomId), Number(userId));
  };

  const informAbsence = () => {
    socket?.emit("inform-absence", Number(roomId), Number(userId));
    setIsAbsence(true);
  };

  const emitIsVerified = () => {
    socket?.emit("is-verified", Number(roomId), Number(userId));
  };

  const addMessage = (payload: ChatMessage) => {
    setChatMessages((prev) => [...prev, payload]);
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("kick-out", handleKickOut);
    socket.on("allow-communicate", handleAllowCommunicate);
    socket.on("force-mute", handleForceMute);
    socket.on("unusual-action", handleUnusualAction);
    socket.on("allow-access", handleAllowAccess);
    socket.on("warn-unusual-action", handleWarning);
    socket.on("deny-access", handleDenyAccess);
    socket.on("deny-communicate", handleDenyCommunicate);
    socket.on(`exam-${examInfo?.examId}-start`, handleExamStart);

    return () => {
      socket.off("kick-out");
      socket.off("allow-communicate");
      socket.off("force-mute");
      socket.off("unusual-action");
      socket.off("allow-access");
      socket.off("warn-unusual-action");
      socket.off("deny-communicate");
      socket.off(`exam-${examInfo?.examId}-start`);
    };
  }, [socket]);

  return (
    <StudentRoomContext.Provider
      value={{
        emitRaiseHand,
        isMutedRef,
        countRef,
        contextHolder,
        emitRequestVerify,
        confirmAbsence,
        isAbsence,
        setIsAbsence,
        incomingMessage,
        setIncomingMessage,
        emitIsVerified,
        chatMessages,
        addMessage,
        setChatMessages,
        isExamStarted,
      }}
    >
      {children}
    </StudentRoomContext.Provider>
  );
};

export default StudentRoomContext;
