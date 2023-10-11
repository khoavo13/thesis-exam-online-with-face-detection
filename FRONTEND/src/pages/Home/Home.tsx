import React, { useContext, useEffect, useState } from "react";
import AppLayout, { IPathItem } from "../../components/AppLayout";
import Table, { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { Button, Divider, Tag, Typography, message } from "antd";
import { FilterValue } from "antd/es/table/interface";
import axios from "../../api/axios";

import useAuth from "../../hooks/useAuth";
import useLoad from "../../hooks/useLoad";
import { useNavigate } from "react-router-dom";
import AppContext from "../../context/AppProvider";
import Cookies from "js-cookie";

const { Text, Link } = Typography;

export type RoomStatus = "closed" | "open" | "done" | "notOpen";

export interface RoomListType {
  key: string;
  name: string;
  group: string;
  startDate: string;
  type: string;
  semester: string;
  academicYear: string;
  status: RoomStatus;
  allowAccess: boolean;
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

let data: RoomListType[] = [];

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
  const [courses, setCourses] = useState<RoomListType[]>([]);
  const { showLoading, hideLoading } = useLoad();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const userId = auth?.id;

  const columns: ColumnsType<RoomListType> = [
    {
      title: "Môn thi",
      dataIndex: "name",
      key: "name",
      width: "30%",
      render: (text, row) => {
        const verifyLink =
          row.status === "open"
            ? `/exam-room/${row.key}/${auth?.id}`
            : "notfound";

        // const verifyLink = `/exam-room/${row.key}/${auth?.id}`;

        return (
          <Link
            href={verifyLink}
            // target="_blank"
            disabled={
              verifyLink === "notfound" || !row.allowAccess ? true : false
            }
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
      render: (text, row) => {
        if (!row.allowAccess) return <Tag color="error">Cấm thi</Tag>;

        if (text === "open") return <Tag color="success">Mở</Tag>;
        else if (text === "not_open")
          return <Tag color="default">Chưa đến giờ</Tag>;
        else if (text === "closed") return <Tag color="error">Đóng</Tag>;
        else if (text === "done") return <Tag color="processing">Đã thi</Tag>;
      },
    },
  ];

  const getRooms = async () => {
    try {
      // showLoading!();
      setIsLoading(true);

      const response = await axios.get(`/api/rooms/student/${auth?.id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });
      // hideLoading!();
      setIsLoading(false);

      // console.log(response.data);
      const requestData = response.data;

      // @ts-ignore
      data = requestData.map((room) => {
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
          allowAccess: room.allowAccess,
        };
      });
      // console.log(data);
      setCourses(data);
    } catch (error) {
      // hideLoading!();
      setIsLoading(false);
      message.error("Lỗi khi lấy thông tin phòng thi!");
      console.error(error);
    }
  };

  useEffect(() => {
    if (auth) getRooms();
  }, [auth]);

  return (
    <AppLayout pathItems={paths}>
      <Divider orientation="left" orientationMargin={0}>
        <h3>Danh sách phòng thi</h3>
      </Divider>
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={courses}
        pagination={{ pageSize: 5 }}
      />
    </AppLayout>
  );
}
