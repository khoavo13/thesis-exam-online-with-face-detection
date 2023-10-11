import { FC, useContext } from "react";
import TeacherRoomContext, {
  UserInfo,
} from "../../../context/TeacherRoomProvider";
import { Badge, Descriptions } from "antd";

export default function StudentList() {
  const { studentList } = useContext(TeacherRoomContext);

  return (
    <div
      style={{
        // textAlign: "center",
        height: "100%",
        overflow: "auto",
        paddingBottom: "10px",
        marginLeft: "20px",
      }}
    >
      {studentList?.map((student) => (
        <StudentCard
          key={student.id}
          id={student.id}
          userNumber={student.userNumber}
          email={student.email}
          isAuthen={student.isAuthen}
          fullName={student.fullName}
          warningCount={student.warningCount}
        />
      ))}{" "}
      {/* {studentList?.map((student) => (
        <StudentCard
          key={student.id}
          id={student.id}
          userNumber={student.userNumber}
          email={student.email}
          isAuthen={student.isAuthen}
          fullName={student.fullName}
        />
      ))} */}
    </div>
  );
}

const StudentCard: FC<UserInfo> = (props) => {
  return (
    <div
      style={{
        backgroundColor: "rgb(240, 242, 245)",
        padding: "10px",
        marginBottom: "10px",
        width: "400px",
      }}
    >
      <Descriptions title={props.fullName} column={1} size="small">
        <Descriptions.Item label="MSSV">{props.userNumber}</Descriptions.Item>
        <Descriptions.Item label="Email">{props.email}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          {props.isAuthen ? (
            <Badge status="success" text="Đã xác thực" />
          ) : (
            <Badge status="error" text="Chưa xác thực" />
          )}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};
