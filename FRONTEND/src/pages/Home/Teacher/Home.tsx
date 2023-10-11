import React, { useEffect, useState } from "react";
import AppLayout, { IPathItem } from "../../../components/AppLayout";
import Table, { ColumnsType, TablePaginationConfig } from "antd/es/table";
import {
  Button,
  Divider,
  Dropdown,
  Form,
  Select,
  Space,
  Switch,
  Tag,
  Typography,
  message,
} from "antd";
import { FilterValue } from "antd/es/table/interface";

import useAuth from "../../../hooks/useAuth";
import useLoad from "../../../hooks/useLoad";
import axios from "../../../api/axios";
import Cookies from "js-cookie";

const { Text, Link } = Typography;

export type RoomStatus = "closed" | "open" | "not_open" | "done";

export interface RoomListType {
  key: string;
  name: string;
  group: string;
  startDate: string;
  type: string;
  semester: string;
  academicYear: string;
  status: RoomStatus;
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

const paths: IPathItem[] = [
  {
    title: "Trang chủ",
    path: "",
  },
  {
    title: "Danh sách phòng thi",
    path: "",
  },
];

export default function Home() {
  const { auth } = useAuth();
  const [rooms, setRooms] = useState<RoomListType[]>([]);
  const [editable, setEditable] = useState<boolean>(false);
  const { showLoading, hideLoading } = useLoad();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // const userId = localStorage.getItem("userId");

  const getRooms = async () => {
    try {
      showLoading!();
      const response = await axios.get(`/api/rooms/teacher/${auth?.id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });
      hideLoading!();

      if (response.status === 200) {
        const requestData = response.data;
        // @ts-ignore
        const data = requestData.map((room) => {
          return {
            key: room.id.toString(),
            name: room.exam.subject.name + " " + room.exam.subject.code,
            group: room.groupName,
            startDate: new Intl.DateTimeFormat("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }).format(new Date(room.exam.startDate)),
            type: room.exam.examType,
            semester: room.exam.semester.name,
            academicYear: room.exam.semester.schoolYear,
            status: room.status.toLowerCase(),
          };
        });
        setRooms(data);
      } else {
        message.error(`Lỗi ${response.status}`);
      }
    } catch (error) {
      hideLoading!();
      message.error("Lỗi khi lấy thông tin phòng thi!");
      console.error(error);
    }
  };

  const changeRoomStatus = async (id: string, status: number) => {
    try {
      showLoading!();
      const response = await axios.put(
        `/api/rooms/${id}`,
        {
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
        }
      );
      hideLoading!();

      if (response.status === 200) {
        message.success("Thay đổi thành công");
      } else {
        message.error("Lỗi!");
      }
    } catch (error) {
      hideLoading!();
      message.error("Lỗi chỉnh sửa trạng thái phòng thi!");
      console.error(error);
    }
  };

  const columns: ColumnsType<RoomListType> = [
    {
      title: "Môn thi",
      dataIndex: "name",
      key: "name",
      width: "30%",
      render: (text, row) => {
        const verifyLink =
          row.status === "open"
            ? `/supervise-room/${row.key}/${auth?.id}`
            : "notfound";
        return (
          <Link
            href={verifyLink}
            target="_blank"
            disabled={verifyLink === "notfound" ? true : false}
          >
            {text}
          </Link>
        );
      },
    },
    {
      title: "Nhóm",
      dataIndex: "group",
      key: "group",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "Loại bài thi",
      dataIndex: "type",
      key: "type",
      render: (text) => {
        return text === "MIDTERM" ? "Giữa kỳ" : "Cuối kỳ";
      },
    },
    {
      title: "Học kỳ",
      dataIndex: "semester",
      key: "semester",
      sorter: (a, b) => Number(a) - Number(b),
      sortDirections: ["descend"],
    },
    {
      title: "Năm học",
      dataIndex: "academicYear",
      key: "academicYear",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text) => {
        if (text === "open") return <Tag color="success">Mở</Tag>;
        else if (text === "not_open")
          return <Tag color="default">Chưa đến giờ</Tag>;
        else if (text === "closed") return <Tag color="error">Đóng</Tag>;
        else if (text === "done") return <Tag color="processing">Đã thi</Tag>;
      },
    },
  ];

  const handleEditableChange = (enable: boolean) => {
    setEditable(enable);
  };

  useEffect(() => {
    if (auth) getRooms();
  }, [auth]);

  return (
    <AppLayout pathItems={paths}>
      <Divider orientation="left" orientationMargin={0}>
        <h3>Danh sách phòng thi</h3>
      </Divider>
      {/* <Form layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item label="Chỉnh sửa">
          <Switch checked={editable} onChange={handleEditableChange} />
        </Form.Item>
      </Form> */}
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={rooms}
        pagination={{ pageSize: 5 }}
      />
    </AppLayout>
  );
}
