import React, { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";

import {
  Button,
  Layout,
  Menu,
  Breadcrumb,
  theme,
  MenuTheme,
  Switch,
  Row,
  Col,
  Affix,
} from "antd";

import Link from "antd/es/typography/Link";

import { QuestionOutlined, AudioFilled } from "@ant-design/icons";
import CountdownTimer from "./CountdownTimer";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Meeting from "../pages/Examination/Meeting";

const { Header, Content, Sider, Footer } = Layout;

export interface IExamLayout {
  children: React.ReactNode;

  time: number;
  numOfQues: number;
  scrollToIndex: (quesIndex: number) => void;
  setLogItems: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function ExamLayout({
  numOfQues,
  scrollToIndex,
  setLogItems,
  time,
  children,
}: IExamLayout) {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [pageTheme, setPageTheme] = useState<MenuTheme>("light");
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const timeToCountdown = new Date().getTime() + time * 60 * 1000;

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const changeTheme = (value: boolean) => {
    setPageTheme(value ? "light" : "dark");
  };

  const logout = async () => {
    setAuth!(undefined);
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Layout>
      <Header
        style={{
          padding: 0,
          background: colorBgContainer,
        }}
      >
        <div
          style={{
            marginRight: "24px",
            position: "relative",
            float: "right",
          }}
        >
          <Switch
            checked={pageTheme === "light"}
            onChange={changeTheme}
            checkedChildren="Sáng"
            unCheckedChildren="Tối"
            style={{ marginRight: 50 }}
          />
          <span>
            <Button onClick={logout} type="link">
              Đăng xuất
            </Button>
          </span>
        </div>
      </Header>
      <Layout>
        <Layout style={{ padding: "0 24px 24px" }}>
          {/* <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
            <Breadcrumb.Item>
              {type} môn {name}
            </Breadcrumb.Item>
          </Breadcrumb> */}
          <Content
            style={{
              padding: 24,
              margin: 0,
              //   minHeight: 280,
              background: colorBgContainer,
            }}
          >
            <Affix offsetTop={50}>
              <div
                style={{
                  textAlign: "right",
                }}
              >
                {/* <CountdownTimer targetDate={timeToCountdown} /> */}
              </div>
            </Affix>
            {children}
          </Content>
        </Layout>
        <Sider
          collapsible
          reverseArrow
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          width={300}
          style={{
            background: colorBgContainer,
            overflow: "auto",
            position: "sticky",
            height: "calc(100vh - 64px)",
            top: 0,
            left: 0,
          }}
          theme={pageTheme}
        >
          {/* <Meeting /> */}
          {collapsed ? "" : <CameraButtons />}
          {collapsed ? (
            ""
          ) : (
            <ExamNavigation
              numOfQues={numOfQues}
              scrollToIndex={scrollToIndex}
            />
          )}
        </Sider>
      </Layout>
    </Layout>
  );
}

const videoConstraints = {
  width: 200,
  height: 150,
  facingMode: "user",
  //   aspectRatio: 0.6666666667,
};

interface ICamera {
  collapsed: boolean;
}

function Camera({ collapsed }: ICamera) {
  const webcamRef = useRef<Webcam>(null);

  const takePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
  }, [webcamRef]);

  return (
    <div style={{ textAlign: "center", marginTop: "54px" }}>
      <Webcam
        muted={false}
        // audio={false}
        width={200}
        height={150}
        screenshotFormat="image/jpeg"
        imageSmoothing={true}
        mirrored={true}
        videoConstraints={videoConstraints}
        ref={webcamRef}
        style={
          collapsed
            ? {
                position: "absolute",
                right: "100%",
              }
            : {
                border: "1px solid black",
              }
        }
      />
    </div>
  );
}

function CameraButtons() {
  const enableMic = () => {};
  const raiseHand = () => {};

  return (
    <div style={{ margin: "10px 0px" }}>
      <Row gutter={[16, 30]}>
        <Col span={6} />
        <Col span={6} style={{ textAlign: "center" }}>
          <Button
            danger
            type="primary"
            onClick={enableMic}
            shape="circle"
            size="large"
            icon={<AudioFilled />}
          />
        </Col>
        <Col span={6} style={{ textAlign: "center" }}>
          <Button
            type="primary"
            onClick={raiseHand}
            shape="circle"
            size="large"
            icon={<QuestionOutlined />}
          />
        </Col>
        <Col span={6} />
      </Row>
    </div>
  );
}

interface IExamNavigation {
  numOfQues: number;
  scrollToIndex: (quesId: number) => void;
}

function ExamNavigation({ numOfQues, scrollToIndex }: IExamNavigation) {
  return (
    <div
      style={{ margin: "20px 20px", paddingTop: "10px", textAlign: "center" }}
    >
      <h3>Điều hướng bài kiểm tra</h3>
      <div style={{ marginLeft: "auto" }}>
        {Array.from({ length: numOfQues }, (_, index) => (
          <>
            {index % 5 == 0 ? <br /> : ""}
            <a>
              <span
                style={{
                  display: "inline-flex",
                  borderRadius: "3px",
                  borderColor: "#f7faff",
                  border: "1px solid",
                  fontWeight: "600",
                  marginRight: "4px",
                  marginBottom: "8px",
                  width: "40px",
                  height: "32px",
                  fontSize: "11px",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => scrollToIndex(index)}
              >
                {index + 1}
              </span>
            </a>
          </>
        ))}
      </div>
    </div>
  );
}
