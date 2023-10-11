import { useContext, useEffect, useRef, useState } from "react";
import Question from "./Question";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
import {
  Affix,
  Button,
  Layout,
  MenuTheme,
  Popconfirm,
  message,
  theme,
  Typography,
  Drawer,
  FloatButton,
  Timeline,
  Tooltip,
  Badge,
  Form,
  Input,
  Col,
  Row,
} from "antd";
import Meeting from "./Meeting";
import { Statistic } from "antd";
import StudentRoomContext from "../../context/StudentRoomProvider";
import {
  CommentOutlined,
  EyeInvisibleOutlined,
  SendOutlined,
} from "@ant-design/icons";
import moment from "moment";
import ExamRoomContext from "../../context/ExamRoomProvider";

const { Countdown } = Statistic;

const { Sider, Content } = Layout;

const { Title } = Typography;

export interface IAnswerOption {
  id: number;
  content: string;
}

export interface IContent {
  id: number;
  type: string;
  description: string;
  answerOptions: IAnswerOption[];
}

interface IQuestion {
  id: number;
  score: number;
  content: IContent;
}

interface IExamInfo {
  name: string;
  type: string;
  startDate: Date;
  time: number;
  examId: number;
}

interface IExamination {
  examId: string;
  userId: string;
  time: number;
  handleExamFinish: () => void;
  setLogItems: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function Examination({
  examId,
  userId,
  time,
  handleExamFinish,
  setLogItems,
}: IExamination) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [pageTheme, setPageTheme] = useState<MenuTheme>("light");

  const [questionList, setQuestionList] = useState<IQuestion[]>([]);
  const quesRef = useRef<Map<number, HTMLDivElement> | null>(null);
  let timeToCountdown = new Date().getTime() + time * 60 * 1000;
  const timeRef = useRef(timeToCountdown);
  const {
    contextHolder,
    isAbsence,
    chatMessages,
    confirmAbsence,
    setChatMessages,
    incomingMessage,
    setIncomingMessage,
  } = useContext(StudentRoomContext);

  const { jitsiApiRef } = useContext(ExamRoomContext);

  const [openMessage, setOpenMessage] = useState<boolean>(false);

  const [form] = Form.useForm();

  const showMessage = () => {
    setIncomingMessage!(false);
    setOpenMessage(true);
  };

  const hideMessage = () => {
    setIncomingMessage!(false);
    setOpenMessage(false);
  };

  const getMap = () => {
    if (!quesRef.current) {
      quesRef.current = new Map<number, HTMLDivElement>();
    }
    return quesRef.current;
  };

  const scrollToIndex = (quesIndex: number) => {
    const map = getMap();

    const node = map.get(quesIndex);
    node?.scrollIntoView();
  };

  const handleSubmit = async (contentSubmit: any) => {
    try {
      // Tạo payload chứa dữ liệu cần gửi đi
      const payload = {
        studentId: userId,
        content: contentSubmit,
      };

      // Gọi API POST với JWT để lưu id sinh viên và đáp án
      const response = await axios.post(
        `/api/exams/${examId}/submission`,
        payload
      );

      // Xử lý kết quả trả về từ API (nếu cần)
      if (response.status === 200) {
        message.success("Nộp bài thành công");
      }
      console.log(response.data);

      handleExamFinish();
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Lỗi khi lưu bài nộp sinh viên: ", error);
    }
  };

  // Gửi yêu cầu GET đến API để lấy danh sách câu hỏi
  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/exams/${examId}`);
      if (response.status === 200) {
        setQuestionList(response.data.questions);
      }
    } catch (error) {
      console.error("Loi khi lay cau hoi tu API", error);
    }
  };

  const sendMessage = (data: any) => {
    setChatMessages!((prev) => {
      return [
        ...prev,
        {
          sender: "me",
          message: data.message,
          isPrivate: true,
          time: moment().format("LTS"),
        },
      ];
    });
    const targetUsers = jitsiApiRef?.current
      ?.getParticipantsInfo()
      // @ts-ignore
      .filter((user) => user.displayName.includes("giam thi"));

    targetUsers?.forEach((targetUser) => {
      jitsiApiRef?.current?.executeCommand(
        "sendChatMessage",
        data.message,
        // @ts-ignore
        targetUser.participantId,
        true
      );
    });

    form.resetFields();
  };

  const renderMessage = () => {
    return (
      <Drawer
        title="Tin nhắn"
        placement="right"
        onClose={hideMessage}
        open={openMessage}
        width={400}
      >
        <div
          style={{
            height: 550,
            marginBottom: 20,
          }}
        >
          {chatMessages?.length == 0 ? (
            <p>Bạn chưa có tin nhắn nào</p>
          ) : (
            <Timeline
              mode="right"
              items={chatMessages?.map((message) => {
                const sender = message.sender == "me" ? "Tôi " : "Giám Thị ";
                return {
                  label: sender + message.time,
                  children: message.message,
                  color: message.isPrivate ? "red" : "blue",
                };
              })}
            />
          )}
        </div>

        <Form onFinish={sendMessage} form={form}>
          <Form.Item name="message">
            <Row gutter={[16, 16]}>
              <Col span={20}>
                <Input />
              </Col>
              <Col span={4}>
                <Button shape="circle" type="primary" onSubmit={sendMessage}>
                  <SendOutlined />
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Drawer>
    );
  };

  const renderFloatButton = () => {
    return (
      <>
        <FloatButton
          style={{ right: 70 + 70 + 80 }}
          icon={<EyeInvisibleOutlined onClick={confirmAbsence} />}
        />
        <FloatButton
          style={{ right: 70 + 30 }}
          icon={<CommentOutlined onClick={showMessage} />}
          badge={{ dot: incomingMessage }}
        />
      </>
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Layout
      style={{
        padding: "24px 24px",
        background: colorBgContainer,
      }}
    >
      {/* {renderFloatButton()}
      {renderMessage()}
      {contextHolder} */}
      <Layout style={{ padding: "24px 24px" }}>
        {renderFloatButton()}
        {renderMessage()}
        {contextHolder}
        <Content>
          {!isAbsence ? (
            questionList.map((question, index) => (
              <Question
                key={question.id}
                index={index}
                map={getMap()}
                idQuestion={question.id}
                type={question.content.type}
                description={question.content.description}
                answerOptions={question.content.answerOptions}
                numberQuestion={questionList.length}
                handleSubmit={handleSubmit}
              />
            ))
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Title type="warning" level={3}>
                Bài kiểm tra tạm thời bị khóa cho đến khi bạn quay trở lại
              </Title>
            </div>
          )}
        </Content>
      </Layout>

      <Sider
        // collapsible
        // reverseArrow
        width={300}
        style={{
          // background: colorBgContainer,
          overflow: "auto",
          position: "sticky",
          height: "calc(100vh - 160px)",

          top: 0,
          left: 0,
        }}
        theme={pageTheme}
      >
        <div
          style={{
            textAlign: "center",
          }}
        >
          <Countdown
            title="Thời gian còn lại"
            value={timeRef.current}
            onFinish={() => {
              handleExamFinish();
            }}
            onChange={() => {
              timeRef.current = timeRef.current - 1;
            }}
            valueStyle={{
              display: "inline-flex",
              justifyContent: "center",
              border: "1px solid black",
              padding: "1px 5px",
            }}
          />
        </div>
        <ExamNavigation
          numOfQues={questionList.length}
          scrollToIndex={scrollToIndex}
          setLogItems={setLogItems}
          time={timeToCountdown}
          handleExamFinish={handleExamFinish}
        />
      </Sider>
    </Layout>
  );
}

interface IExamNavigation {
  numOfQues: number;
  scrollToIndex: (quesId: number) => void;
  setLogItems: React.Dispatch<React.SetStateAction<string[]>>;
  time: number;
  handleExamFinish: () => void;
}

function ExamNavigation({
  numOfQues,
  scrollToIndex,
  setLogItems,
  time,
  handleExamFinish,
}: IExamNavigation) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout
      style={{
        margin: "0px 20px",
        paddingTop: "10px",
        textAlign: "center",
        background: colorBgContainer,
      }}
    >
      <Content>
        {/* <div
          style={{
            textAlign: "center",
          }}
        >
          <Countdown
            title="Thời gian còn lại"
            value={time}
            onFinish={handleExamFinish}
            onChange={() => {}}
            valueStyle={{
              display: "inline-flex",
              justifyContent: "center",
              border: "1px solid black",
              padding: "1px 5px",
            }}
          />
        </div> */}
        <br />
        <Meeting setLogItems={setLogItems} />
        <br />

        <h3
          style={{
            marginTop: "20px",
          }}
        >
          Điều hướng bài kiểm tra
        </h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {Array.from({ length: numOfQues }, (_, index) => (
            <Button
              key={index}
              style={{
                borderRadius: "3px",
                borderColor: "#f7faff",
                border: "1px solid",
                fontWeight: "600",
                margin: "4px",
                width: "40px",
                height: "32px",
                fontSize: "11px",
                cursor: "pointer",
              }}
              onClick={() => scrollToIndex(index)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </Content>
    </Layout>
  );
}
