import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button, Col, Layout, Row, theme, Card, notification } from "antd";
import Webcam from "react-webcam";
import { NotificationPlacement } from "antd/es/notification/interface";
import { ExclamationCircleFilled, CheckCircleFilled } from "@ant-design/icons";

import { useNavigate, useParams } from "react-router-dom";
import { axiosDJ } from "../../api/axios";

import bklogo from "/hcmut.png";
import useAuth from "../../hooks/useAuth";
import ExamRoomContext from "../../context/ExamRoomProvider";

const { Header, Content } = Layout;

const videoConstraints = {
  width: 500,
  height: 500,
  facingMode: "user",
  //   aspectRatio: 0.6666666667,
};

let getShotInterval: NodeJS.Timeout;

interface IVerifyFace {
  setExceedLimit?: React.Dispatch<React.SetStateAction<boolean>>;
  openRoom?: () => void;
}

export default function VerifyFace({ setExceedLimit, openRoom }: IVerifyFace) {
  const { auth } = useAuth();
  const webcamRef = useRef<Webcam>(null);
  const [api, contextHolder] = notification.useNotification({ maxCount: 1 });
  const { roomId, userId } = useParams();
  const { setIsVerified } = useContext(ExamRoomContext);

  let numOfVerify = 0;
  let isDoneVerify = false;

  const openNotification = (
    placement: NotificationPlacement,
    icon: React.ReactNode,
    message: React.ReactNode,
    description: React.ReactNode,
    style?: React.CSSProperties,
    onClose?: () => void
  ) => {
    api.info({
      icon: icon,
      message: message,
      description: description,
      placement,
      style: style,
      duration: 2,
      onClose: onClose,
    });
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const checkFace = async (image: string) => {
    try {
      const response = await axiosDJ.post("/api/face/recognize/", {
        userId: Number(userId),
        image: image,
      });

      if (isDoneVerify) return;

      if (response.data.verification) {
        openNotification(
          "top",
          <CheckCircleFilled style={{ color: "green" }} />,
          <h4 style={{ color: "green" }}>Xác thực thành công</h4>,
          "Khuôn mặt của bạn trùng khớp với người đăng ký",
          undefined,
          () => {
            if (getShotInterval) clearInterval(getShotInterval);

            isDoneVerify = true;
            setIsVerified!(true);

            // if (auth?.roles === "STUDENT") {
            //   toggleToVerify!(false);
            // } else {
            //   openRoom!();
            // }

            if (auth?.roles === "TEACHER") {
              openRoom!();
            }
          }
        );
      } else {
        numOfVerify++;
        // console.log("Num of verify: ", numOfVerify);
        if (numOfVerify === 5) {
          openNotification(
            "top",
            <ExclamationCircleFilled style={{ color: "red" }} />,
            <h4 style={{ color: "red" }}>Xác thực thất bại</h4>,
            `Bạn đã xác thực thất bại nhiều hơn số lần quy định. Vui lòng liên hệ ${
              auth?.roles === "STUDENT" ? "giám thị" : "admin"
            } để xử lý.`,
            undefined,
            () => {
              if (getShotInterval) clearInterval(getShotInterval);

              isDoneVerify = true;

              if (auth?.roles === "STUDENT") {
                setExceedLimit!(true);
              }
            }
          );
        } else {
          if (!response.data.type) {
            openNotification(
              "top",
              <ExclamationCircleFilled style={{ color: "red" }} />,
              <h4 style={{ color: "red" }}>Xác thực thất bại</h4>,
              "Khuôn mặt của bạn không trùng khớp với người đăng ký"
            );
          } else if (response.data.type === "NO_FACE_DETECTED") {
            openNotification(
              "top",
              <ExclamationCircleFilled style={{ color: "red" }} />,
              <h4 style={{ color: "red" }}>Xác thực thất bại</h4>,
              "Không phát hiện khuôn mặt nào trong hình"
            );
          } else if (response.data.type === "MORE_THAN_ONE_FACE_DETECTED") {
            openNotification(
              "top",
              <ExclamationCircleFilled style={{ color: "red" }} />,
              <h4 style={{ color: "red" }}>Xác thực thất bại</h4>,
              "Phát hiện có nhiều khuôn mặt trong hình"
            );
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const takePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();

    checkFace(imageSrc!);
  }, [webcamRef]);

  useEffect(() => {
    getShotInterval = setInterval(() => {
      takePhoto();
    }, 5000);

    return () => {
      if (getShotInterval) clearInterval(getShotInterval);
    };
  }, []);

  return (
    <Layout style={{ height: "100%" }}>
      {contextHolder}

      <Content style={{ padding: "50px 50px" }}>
        <Row align="middle">
          <Col span={6} offset={4}>
            <div className="camera">
              <Webcam
                audio={false}
                width={500}
                height={500}
                screenshotFormat="image/jpeg"
                imageSmoothing={true}
                mirrored={true}
                videoConstraints={videoConstraints}
                ref={webcamRef}
                style={{ borderRadius: "3%", border: "1px solid black" }}
              />
            </div>
          </Col>
          <Col span={4} offset={6}>
            <Card
              title="Hướng dẫn xác thực khuôn mặt"
              style={{ width: 300 }}
              headStyle={{ textAlign: "center" }}
            >
              <p>
                Đưa khuôn mặt lại gần camera. Giữ khuôn mặt cố định cho đến khi
                màn hình hiện kết quả.
              </p>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
