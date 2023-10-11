import { useCallback, useEffect, useRef, useState } from "react";
import AppLayout, { IPathItem } from "../../components/AppLayout";
import { Button, Col, Divider, Row, Card, Typography, message } from "antd";
import Webcam from "react-webcam";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios, { axiosDJ } from "../../api/axios";

const { Title, Text } = Typography;

const paths: IPathItem[] = [
  {
    title: "Trang chủ",
    path: "",
  },
  {
    title: "Đăng ký khuôn mặt",
    path: "",
  },
];

type IStudent = {
  id: number;
  studentId: string;
  name: string;
  createdDate: string;
  email: string;
};

export default function RegisterFace() {
  const [student, setStudent] = useState<IStudent>();

  // Capture face
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null); // Kiểu dữ liệu của capturedImage là string hoặc null
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/users/${userId}`);

      if (response.status === 200) {
        setStudent({
          id: response.data.id,
          studentId: response.data.userNumber,
          name: response.data.fullName,
          createdDate: new Intl.DateTimeFormat("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }).format(new Date(response.data.createdDate)),
          email: response.data.email,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const videoConstraints = {
    facingMode: "user",
    width: Math.floor(window.innerWidth * 0.3),
    height: Math.floor(window.innerWidth * 0.3),
  };

  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    setCapturedImage(imageSrc || null); // Set giá trị capturedImage là imageSrc hoặc null nếu imageSrc là undefined
  }, [webcamRef]);

  const handleReset = () => {
    setCapturedImage(null);
  };

  const handleUpload = () => {
    const image = new Image();
    image.src =
      capturedImage ||
      "https://cdn.wpbeginner.com/wp-content/uploads/2016/03/uploadfailed.jpg";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext("2d");
      context?.drawImage(image, 0, 0);
      const base64Image = canvas.toDataURL("image/jpeg");

      const data = {
        userId,
        image: base64Image,
      };

      axiosDJ
        .post("/api/face/register/", data)
        .then((response) => {
          // Xử lý phản hồi thành công từ API (nếu cần)
          toast.success("Upload successful");
          setCapturedImage(null);
        })
        .catch((error) => {
          // Xử lý lỗi từ API (nếu cần)
          console.error(error);
        });
    };
  };

  return (
    <AppLayout pathItems={paths}>
      <Divider orientation="left" orientationMargin={0}>
        <h2>Đăng kí khuôn mặt</h2>
      </Divider>

      <Row gutter={[48, 32]} justify="start">
        <Col span={12}>
          <Card
            title={<h3>Thông tin người dùng</h3>}
            hoverable={true}
            headStyle={{ backgroundColor: "#33CCFF" }}
            style={{ width: "600px" }}
            className="custom-card"
          >
            <Title level={4}>{student?.name}</Title>
            <br></br>
            <Text strong style={{ fontSize: "18px" }}>
              Mã số người dùng:{" "}
            </Text>
            <Text style={{ fontSize: "18px" }}>{student?.studentId}</Text>
            <br /> <br />
            <Text strong style={{ fontSize: "18px" }}>
              Ngày tạo tài khoản:{" "}
            </Text>
            <Text style={{ fontSize: "18px" }}>{student?.createdDate}</Text>
            <br /> <br />
            <Text strong style={{ fontSize: "18px" }}>
              Email:{" "}
            </Text>
            <Text style={{ fontSize: "18px" }}>{student?.email}</Text>
          </Card>
        </Col>
        <Col span={12}>
          <div>
            {capturedImage ? (
              <img src={capturedImage} alt="Captured" />
            ) : (
              <Webcam
                mirrored
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
              />
            )}
          </div>
          <br></br>
          {capturedImage ? (
            <div>
              <Button onClick={handleReset}>Reset</Button>

              <Button type="primary" onClick={handleUpload}>
                Upload
              </Button>
            </div>
          ) : (
            <Button type="primary" onClick={handleCapture}>
              Capture
            </Button>
          )}
          <ToastContainer />
        </Col>
      </Row>
    </AppLayout>
  );
}
