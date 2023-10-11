import { Card, Space } from "antd";
import NotifyTag, { NotifyType } from "../../../components/NotifyTag";
import { useContext, useEffect, useRef, useState } from "react";
import TeacherRoomContext from "../../../context/TeacherRoomProvider";

export default function VerifyException() {
  const { verifyExceptionItems, users } = useContext(TeacherRoomContext);

  return (
    <div
      style={{
        // marginLeft: "20px",
        backgroundColor: "rgb(240, 242, 245)",
        height: "100%",
        padding: "10px 0px",
      }}
    >
      <div
        style={{
          textAlign: "center",
          height: "100%",
          overflow: "auto",
          paddingBottom: "10px",
        }}
      >
        <Space direction="vertical" size={16}>
          {verifyExceptionItems?.map((ele) => {
            let userName: string;
            let jitsiId: string;

            userName =
              users?.find((user) => user.userId == ele.userId)?.name ?? "???";
            jitsiId =
              users?.find((user) => user.userId == ele.userId)?.jitsiId ??
              "???";

            return (
              <NotifyTag
                key={ele.uid}
                uid={ele.uid}
                type={ele.type}
                userName={userName}
                jitsiId={jitsiId}
                userId={ele.userId}
                time={ele.time}
                isHandled={ele.isHandled}
                warningCount={ele.warningCount}
              />
            );
          })}
        </Space>
      </div>
    </div>
  );
}
