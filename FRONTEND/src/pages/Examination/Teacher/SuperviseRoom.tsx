import { Col, Row } from "antd";
import React, { ReactNode, useContext } from "react";
import TeacherRoomContext from "../../../context/TeacherRoomProvider";

interface SuperviseRoomProps {
  leftNode: ReactNode;
  rightNode: ReactNode;
}

export default function SuperviseRoom({
  leftNode,
  rightNode,
}: SuperviseRoomProps) {
  const { contextHolder, contextProposeHolder } =
    useContext(TeacherRoomContext);

  return (
    <>
      {contextHolder}
      {contextProposeHolder}
      <Row>
        <Col span={15}>{leftNode}</Col>
        <Col span={9}>{rightNode}</Col>
      </Row>
    </>
  );
}
