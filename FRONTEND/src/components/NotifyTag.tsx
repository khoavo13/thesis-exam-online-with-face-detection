import {
  AudioOutlined,
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  EllipsisOutlined,
  EyeTwoTone,
  InfoCircleFilled,
  PushpinOutlined,
  SecurityScanFilled,
  SecurityScanTwoTone,
  SettingOutlined,
} from "@ant-design/icons";
import { Card, Dropdown, MenuProps, Typography, Tooltip } from "antd";
import { ReactNode, useContext } from "react";
import ExamRoomContext from "../context/ExamRoomProvider";
import TeacherRoomContext from "../context/TeacherRoomProvider";
import { useParams } from "react-router-dom";

const { Meta } = Card;
const { Text } = Typography;

export type NotifyType =
  | "unusual-1"
  | "unusual-2"
  | "unusual-3"
  | "raise-hand"
  | "verify"
  | "inform-absence";

interface NotifyTagProps {
  uid: string;
  type: NotifyType;
  userName: string;
  jitsiId: string;
  userId: number;
  time: string;
  isHandled: boolean;
  warningCount?: number;
}

export default function NotifyTag({
  type,
  userName,
  jitsiId,
  uid,
  userId,
  time,
  isHandled,
  warningCount,
}: NotifyTagProps) {
  const { roomId } = useParams();
  const { jitsiApiRef } = useContext(ExamRoomContext);
  const {
    removeNotify,
    emitAllowCommunicate,
    denyCommunicate,
    confirmKickOut,
    forceMute,
    allowAccess,
    toggleNotifyTagStatus,
    increaseUnusualCount,
    denyAccess,
    emitWarning,
  } = useContext(TeacherRoomContext);

  const items: MenuProps["items"] = [
    {
      label: "Buộc dừng thi",
      key: "1",
      onClick: () => {
        confirmKickOut!(
          {
            userId,
            roomId: Number(roomId),
          },
          uid
        );
      },
    },
    {
      label: "Cảnh cáo",
      key: "2",
      onClick: () => {
        toggleNotifyTagStatus!(uid);
        increaseUnusualCount!(userId);
        emitWarning!({ roomId: Number(roomId), studentId: userId });
      }, // handle thisssssssssssssssssssssssss
    },
  ];

  // inform-absence
  const actions0 = [
    <Tooltip placement="top" title="Đóng">
      <CloseOutlined
        onClick={() => {
          toggleNotifyTagStatus!(uid);
        }}
      />
    </Tooltip>,
    <Tooltip placement="top" title="Ghim sinh viên">
      <PushpinOutlined
        onClick={() => {
          if (!jitsiApiRef || !jitsiId) return;

          jitsiApiRef.current?.pinParticipant(jitsiId);
        }}
      />
    </Tooltip>,
  ];

  // unusual-action
  const actions1 = [
    ...actions0,
    <Tooltip placement="top" title="Tác vụ">
      <Dropdown menu={{ items }} trigger={["click"]} placement="top">
        <EllipsisOutlined key="ellipsis" />
      </Dropdown>
    </Tooltip>,
  ];

  // raise-hand
  const actions2 = [
    <Tooltip placement="top" title="Đóng">
      <CloseOutlined
        onClick={() => {
          toggleNotifyTagStatus!(uid);
          forceMute!({
            userId,
            roomId: Number(roomId),
          });
          denyCommunicate!({
            userId,
            roomId: Number(roomId),
          });
        }}
      />
    </Tooltip>,
    <Tooltip placement="top" title="Ghim sinh viên">
      <PushpinOutlined
        onClick={() => {
          if (!jitsiApiRef || !jitsiId) return;

          jitsiApiRef.current?.pinParticipant(jitsiId);
        }}
      />
    </Tooltip>,
    <Tooltip placement="top" title="Đồng ý">
      <CheckOutlined
        onClick={() => {
          // toggleNotifyTagStatus!(uid);
          emitAllowCommunicate!({
            userId,
            roomId: Number(roomId),
          });
        }}
      />
    </Tooltip>,
  ];

  // verify
  const actions3 = [
    <Tooltip placement="top" title="Từ chối">
      <CloseOutlined
        onClick={() => {
          denyAccess!({ roomId: Number(roomId), userId });
          toggleNotifyTagStatus!(uid, 2);
        }}
      />
    </Tooltip>,
    <Tooltip placement="top" title="Ghim sinh viên">
      <PushpinOutlined
        onClick={() => {
          if (!jitsiApiRef || !jitsiId) return;

          jitsiApiRef.current?.pinParticipant(jitsiId);
        }}
      />
    </Tooltip>,
    <Tooltip placement="top" title="Đồng ý">
      <CheckOutlined
        onClick={() => {
          allowAccess!({
            userId,
            roomId: Number(roomId),
          });
          toggleNotifyTagStatus!(uid, 2);
        }}
      />
    </Tooltip>,
  ];

  let renderedTitle: string;
  let renderedIcon: JSX.Element;
  let renderedDescription: ReactNode;
  let renderedActions: ReactNode[];

  if (type === "unusual-1") {
    renderedTitle = "Hệ thống phát hiện bất thường";
    renderedIcon = <InfoCircleFilled style={{ color: "red" }} />;
    renderedDescription = (
      <>
        Không tìm thấy
        <Text type="danger"> {userName} </Text>
        lúc {time} (đã cảnh cáo {warningCount} lần)
      </>
    );
    renderedActions = actions1;
  } else if (type === "unusual-2") {
    renderedTitle = "Hệ thống phát hiện bất thường";
    renderedIcon = <InfoCircleFilled style={{ color: "red" }} />;
    renderedDescription = (
      <>
        Khuôn mặt
        <Text type="danger"> {userName} </Text> không trùng khớp lúc {time} (đã
        cảnh cáo {warningCount} lần)
      </>
    );
    renderedActions = actions1;
  } else if (type === "unusual-3") {
    renderedTitle = "Hệ thống phát hiện bất thường";
    renderedIcon = <InfoCircleFilled style={{ color: "red" }} />;
    renderedDescription = (
      <>
        Phát hiện nhiều khuôn mặt trong khung hình của{" "}
        <Text type="danger"> {userName} </Text> lúc {time} (đã cảnh cáo{" "}
        {warningCount} lần)
      </>
    );
    renderedActions = actions1;
  } else if (type === "raise-hand") {
    renderedTitle = "Sinh viên xin phép phát biểu";
    renderedIcon = <AudioOutlined />;
    renderedDescription = (
      <>
        <Text type="danger">{userName} </Text> yêu cầu được phát biểu
      </>
    );
    renderedActions = actions2;
  } else if (type === "verify") {
    renderedTitle = "Sinh viên gặp vấn đề xác thực khuôn mặt";
    renderedIcon = <EyeTwoTone />;
    renderedDescription = (
      <>
        <Text type="danger">{userName} </Text> yêu cầu được xác thực bằng mắt
      </>
    );
    renderedActions = actions3;
  } else {
    renderedTitle = "Sinh viên xin phép ra ngoài";
    renderedIcon = <SecurityScanTwoTone />;
    renderedDescription = (
      <>
        <Text type="danger">{userName} </Text> xin phép ra ngoài
      </>
    );
    renderedActions = actions0;
  }

  const renderUnhandledCard = () => (
    <Card
      size="small"
      style={{ width: "400px", textAlign: "justify" }}
      actions={renderedActions}
      hoverable={true}
    >
      <Meta
        avatar={renderedIcon}
        title={renderedTitle}
        description={renderedDescription}
      />
    </Card>
  );

  const renderHandledCard = () => (
    <Card
      size="small"
      style={{ width: "400px", textAlign: "justify", background: "#dddddd" }}
    >
      <Meta
        avatar={renderedIcon}
        title={renderedTitle}
        description={renderedDescription}
      />
    </Card>
  );

  return isHandled ? renderHandledCard() : renderUnhandledCard();
}
