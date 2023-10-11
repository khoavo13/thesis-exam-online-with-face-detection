import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ExamRoomContext from "./ExamRoomProvider";
import { Form, Input, Modal, Typography, message } from "antd";
import useNotification from "../hooks/useNotifcation";
import { InfoCircleFilled } from "@ant-design/icons";
import AppContext from "./AppProvider";
import { NotifyType } from "../components/NotifyTag";
import uniqid from "uniqid";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import moment from "moment";
import useLoad from "../hooks/useLoad";

const { Text } = Typography;

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

interface UserAndRoom {
  roomId: number;
  userId: number;
}

interface OnlineUser {
  userId: number;
  jitsiId: string;
  name: string;
  isAuthen: boolean;
}

export interface UserInfo {
  id: number;
  userNumber: string;
  email: string;
  fullName: string;
  isAuthen: boolean;
  warningCount: number;
}

interface INotify {
  uid: string;
  type: NotifyType;
  userId: number;
  time: string;
  isHandled: boolean;
  warningCount?: number;
}

export type TeacherRoomType = {
  notifyItems?: INotify[];
  verifyExceptionItems?: INotify[];
  users?: OnlineUser[];
  studentList?: UserInfo[];
  // unAuthenUsers?: User[];
  emitAllowCommunicate?: (payload: UserAndRoom) => void;
  denyCommunicate?: (payload: UserAndRoom) => void;
  kickStudent?: (payload: UserAndRoom) => void;
  forceMute?: (payload: UserAndRoom) => void;
  removeNotify?: (uid: string) => void;
  setUsers?: React.Dispatch<React.SetStateAction<OnlineUser[]>>;

  confirmKickOut?: (payload: UserAndRoom, uid: string) => void;
  allowAccess?: (payload: UserAndRoom) => void;
  contextHolder?: React.ReactElement<
    any,
    string | React.JSXElementConstructor<any>
  >;
  contextProposeHolder?: React.ReactElement<
    any,
    string | React.JSXElementConstructor<any>
  >;
  toggleNotifyTagStatus?: (uid: string, notify?: number) => void;
  increaseUnusualCount?: (userId: number) => void;
  denyAccess?: (payload: UserAndRoom) => void;
  emitWarning?: (data: { roomId: number; studentId: number }) => void;
};

const TeacherRoomContext = createContext<TeacherRoomType>({});

export const TeacherRoomProvider: FC<IApp> = ({ children }) => {
  const { socket } = useContext(ExamRoomContext);
  const { roomId, userId } = useParams();
  const { auth } = useContext(AppContext);

  const [notifyItems, setNotifyItems] = useState<INotify[]>([]);
  const [verifyExceptionItems, setVerifyExceptionItems] = useState<INotify[]>(
    []
  );

  const [users, setUsers] = useState<OnlineUser[]>([]);
  const [studentList, setStudentList] = useState<UserInfo[]>([]);
  const studentsRef = useRef(studentList);

  const { openNotification } = useNotification();

  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();
  const [proposeModal, contextProposeHolder] = Modal.useModal();

  const { showLoading, hideLoading } = useLoad();

  const getStudentList = async () => {
    try {
      const response = await axios.get(`/api/rooms/${roomId}/students`);

      const requestData: UserInfo[] = response.data.map((user: UserInfo) => {
        return {
          id: user.id,
          userNumber: user.userNumber,
          email: user.email,
          fullName: user.fullName,
          isAuthen: false,
          warningCount: 0,
        };
      });

      setStudentList(requestData);
      studentsRef.current = requestData;
    } catch (error) {
      message.error("Có lỗi xảy ra!");
      console.error(error);
    }
  };

  const submitKickout = async (params: {
    roomId: number;
    studentId: number;
    description: string;
  }) => {
    try {
      showLoading!();
      const response = await axios.post(
        `api/users/unusual-action?roomId=${params.roomId}&studentId=${params.studentId}`,
        {
          type: 0,
          description: params.description,
        }
      );
      hideLoading!();

      if (response.status === 200) {
        message.success("Submit thành công!");
      }
    } catch (error) {
      hideLoading!();
      message.error("Lỗi submit form!");
      console.error(error);
    }
  };

  const confirmKickOut = (payload: UserAndRoom, uid?: string) => {
    modal.confirm({
      title: "Xác nhận đình chỉ thi với sinh viên",
      centered: true,
      onOk: () => {
        submitKickout({
          roomId: payload.roomId,
          studentId: payload.userId,
          description: form.getFieldValue("kickout-submit"),
        });
        form.resetFields();
        kickStudent(payload);
        uid ? toggleNotifyTagStatus!(uid) : "";
      },
      content: (
        <Form form={form} onFinish={handleFormSubmit}>
          <Form.Item label="Lý do" name="kickout-submit">
            <Input.TextArea />
          </Form.Item>
        </Form>
      ),
    });
  };

  const handleFormSubmit = async (values: any) => {
    console.log(values);
  };

  const handleUserJoined = (payload: {
    roomId: number;
    id: number;
    socketId: string;
    user_number: number;
    full_name: string;
  }) => {
    console.log("---------------------------");
    console.log("User joined: ", payload);
    console.log("---------------------------");

    if (payload.id == auth?.id) return;

    setUsers((prev) => {
      if (prev.some((user) => user.userId == payload.id)) return prev;

      return [
        ...prev,
        {
          userId: payload.id,
          jitsiId: "",
          name: `${payload.full_name} (${payload.user_number})`,
          isAuthen: false,
          warningCount: 0,
        },
      ];
    });
  };

  const handleUnusualAction = useCallback(
    (payload: UnusualAction) => {
      console.log("Có bất thường ", payload.userId);
      console.log("Student ref is: ", studentsRef.current);
      const listRef = studentsRef.current;

      let unusualUser = listRef.find((user) => user.id == payload.userId);
      console.log("Unusual user: ", unusualUser);

      const textName =
        unusualUser?.fullName + " (" + unusualUser?.userNumber + ")";

      openNotification!(
        "top",
        <InfoCircleFilled />,
        <h4 style={{ color: "red" }}>Hệ thống phát hiện bất thường</h4>,
        <>
          {payload.type === "NO_FACE_DETECTED"
            ? `Không phát hiện khuôn mặt của ${textName}`
            : payload.type === "MORE_THAN_ONE_FACE_DETECTED"
            ? `Phát hiện nhiều khuôn mặt trong khung hình của ${textName}`
            : `Khuôn mặt của ${textName} không trùng khớp`}
        </>,
        5
      );

      setNotifyItems((prev) => {
        if (
          prev.some(
            (item) => item.userId == payload.userId && item.type == payload.type
          )
        )
          return prev;

        return [
          ...prev,
          {
            uid: uniqid(),
            type:
              payload.type === "NO_FACE_DETECTED"
                ? "unusual-1"
                : payload.type === "MORE_THAN_ONE_FACE_DETECTED"
                ? "unusual-3"
                : "unusual-2",
            userId: payload.userId,
            time: moment().format("LT"),
            isHandled: false,
            warningCount: unusualUser?.warningCount,
          },
        ];
      });
    },
    [studentList]
  );

  const handleRequestCommunicate = (payload: {
    roomId: number;
    studentId: number;
  }) => {
    const { studentId } = payload;

    if (
      notifyItems.some(
        (ele) => ele.userId === payload.studentId && ele.type === "raise-hand"
      )
    )
      return;

    setNotifyItems((prev) => [
      ...prev,
      {
        uid: uniqid(),
        type: "raise-hand",
        userId: studentId,
        time: moment().format("LT"),
        isHandled: false,
      },
    ]);
  };

  const handleRequestVerify = (payload: {
    roomId: number;
    studentId: number;
    full_name: string;
    user_number: number;
  }) => {
    const { studentId } = payload;

    console.log("handleRequestVerify");
    if (
      verifyExceptionItems.some(
        (ele) => ele.userId === payload.studentId && ele.type === "verify"
      )
    )
      return;

    setVerifyExceptionItems((prev) => [
      ...prev,
      {
        uid: uniqid(),
        type: "verify",
        userId: studentId,
        time: moment().format("LT"),
        isHandled: false,
      },
    ]);
  };

  const handleInformAbsence = (payload: {
    roomId: number;
    studentId: number;
  }) => {
    setNotifyItems((prev) => [
      ...prev,
      {
        uid: uniqid(),

        type: "inform-absence",
        userId: payload.studentId,
        time: moment().format("LT"),
        isHandled: false,
      },
    ]);
  };

  const handleUserLeave = (payload: UserAndRoom) => {
    console.log("Someone leaved: ", payload.userId);
    removeUser(payload.userId);
  };

  const handleUserIsVerified = (payload: {
    roomId: number;
    studentId: number;
    full_name: string;
    user_number: number;
  }) => {
    console.log("user verified: ", payload);
    verifyUser(payload.studentId);
  };

  const removeNotify = (uid: string) => {
    setNotifyItems((prev) => {
      const newNotifyItems = prev.filter((ele) => ele.uid !== uid);
      return newNotifyItems;
    });
  };

  const removeUser = (id: number) => {
    setUsers((prev) => {
      const newUsers = prev.filter((user) => user.userId != id);
      return newUsers;
    });
  };

  const verifyUser = (userId: number) => {
    setUsers((prev) => {
      const newUsers = prev.map((user) => {
        if (user.userId != userId) return user;

        return {
          ...user,
          isAuthen: true,
        };
      });

      return newUsers;
    });

    setStudentList((prev) => {
      const targetStudent = prev.find((student) => student.id == userId);
      if (!targetStudent) return prev;
      targetStudent.isAuthen = true;

      const newStudentList = [targetStudent].concat(
        prev.filter((student) => student.id != userId)
      );

      studentsRef.current = newStudentList;
      return newStudentList;
    });
  };

  const toggleNotifyTagStatus = (uid: string, notify: number = 1) => {
    const setItems = notify == 1 ? setNotifyItems : setVerifyExceptionItems;

    setItems((prev) => {
      const targetNotify = prev.find((notify) => notify.uid == uid);
      if (!targetNotify) return prev;
      targetNotify.isHandled = true;

      const newNotifyItems = [targetNotify].concat(
        prev.filter((ele) => ele.uid !== uid)
      );
      return newNotifyItems;
    });
  };

  const proposeKickout = (userId: number, warningCount: number) => {
    proposeModal.confirm({
      title: "Đề xuất đình chỉ thi với sinh viên",
      centered: true,
      onOk: () => {
        confirmKickOut({ roomId: Number(roomId), userId: userId });
      },
      content: `Sinh viên đã bị cảnh cáo ${warningCount} lần`,
    });
  };

  const increaseUnusualCount = (userId: number) => {
    setStudentList((prev) => {
      const newStudentList = prev.map((student) => {
        if (student.id != userId) return student;

        return {
          ...student,
          warningCount: student.warningCount + 1,
        };
      });

      studentsRef.current = newStudentList;
      console.log("New student list: ", newStudentList);
      return newStudentList;
    });

    studentsRef.current.forEach((stu) => {
      if (stu.id != userId) return;

      const count = stu.warningCount + 1;
      if (count % 3 == 0) proposeKickout(userId, count);
    });
  };

  const emitAllowCommunicate = (payload: {
    roomId: number;
    userId: number;
  }) => {
    socket?.emit("allow-communicate", payload.roomId, payload.userId);
  };

  const kickStudent = (payload: UserAndRoom) => {
    socket?.emit("kick-out", payload);
  };

  const forceMute = (payload: UserAndRoom) => {
    socket?.emit("force-mute", payload);
  };

  const allowAccess = (payload: UserAndRoom) => {
    verifyUser(payload.userId);
    socket?.emit("allow-access", payload.roomId, payload.userId);
  };

  const emitWarning = (data: { roomId: number; studentId: number }) => {
    const targetStudent = studentsRef.current.find(
      (student) => student.id == data.studentId
    );
    socket?.emit("warn-unusual-action", {
      roomId: data.roomId,
      studentId: data.studentId,
      count: targetStudent?.warningCount! + 1,
    });
  };

  const denyAccess = (payload: UserAndRoom) => {
    socket?.emit("deny-access", payload.roomId, payload.userId);
  };

  const denyCommunicate = (payload: { roomId: number; userId: number }) => {
    socket?.emit("deny-communicate", payload.roomId, payload.userId);
  };

  useEffect(() => {
    getStudentList();
  }, []);

  useEffect(() => {
    console.log("Users: ", users);
  }, [users]);

  useEffect(() => {
    if (!socket) return;

    console.log(socket);

    socket.on("user-joined", handleUserJoined);
    socket.on("user-leaved", handleUserLeave);
    socket.on("unusual-action", handleUnusualAction);
    socket.on("request-communicate", handleRequestCommunicate);
    socket.on("request-manual-verify", handleRequestVerify);
    socket.on("inform-absence", handleInformAbsence);
    socket.on("is-verified", handleUserIsVerified);

    return () => {
      if (!socket) return;

      // socket.off("user-joined");
      socket.off("user-leaved");
      socket.off("unusual-action");
      socket.off("request-communicate");
      socket.off("request-manual-verify");
      socket.off("inform-absence");
      socket.off("is-verified");
      socket.off("warn-unusual-action");
    };
  }, [socket]);

  return (
    <TeacherRoomContext.Provider
      value={{
        notifyItems,
        verifyExceptionItems,
        users,
        emitAllowCommunicate,
        denyCommunicate,
        kickStudent,
        forceMute,
        setUsers,
        removeNotify,
        confirmKickOut,
        contextHolder,
        contextProposeHolder,
        allowAccess,
        studentList,
        toggleNotifyTagStatus,
        increaseUnusualCount,
        emitWarning,
        denyAccess,
      }}
    >
      {children}
    </TeacherRoomContext.Provider>
  );
};

export default TeacherRoomContext;
