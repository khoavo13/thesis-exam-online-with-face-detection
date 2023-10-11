import { useContext } from "react";
import ExamRoomContext from "../../../context/ExamRoomProvider";
import { Descriptions } from "antd";

export default function RoomInfo() {
  const { examInfo } = useContext(ExamRoomContext);

  return (
    <div
      style={{
        backgroundColor: "rgb(240, 242, 245)",
        padding: "10px",
      }}
    >
      <Descriptions title="Thông tin phòng thi" column={1} size="small">
        <Descriptions.Item label="Môn thi">{examInfo?.name}</Descriptions.Item>
        <Descriptions.Item label="Loại bài thi">
          {examInfo?.type === "MIDTERM" ? "Giữa kỳ" : "Cuối kỳ"}
        </Descriptions.Item>
        <Descriptions.Item label="Bắt đầu">
          {examInfo?.startDate}
        </Descriptions.Item>
        <Descriptions.Item label="Thời gian làm bài">
          {examInfo?.time} phút
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
}
