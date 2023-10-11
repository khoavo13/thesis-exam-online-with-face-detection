import { Button, Checkbox, Modal, Radio, message } from "antd";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { useState } from "react";
import EssayQuestion from "./EssayQuestion";
import EssayAnswer from "./EssayAnswer";
import { IAnswerOption } from "./Examination";

interface IQuestion {
  idQuestion: number;
  index: number;
  type: string;
  description: string;
  answerOptions: IAnswerOption[];
  numberQuestion: number;
  map: any;
  handleSubmit: (contentSubmit: any) => Promise<void>;
}

interface IContentSubmit {
  question: {
    id: number;
  };
  content: string;
}

const contentSubmit: IContentSubmit[] = [];

export default function Question({
  index,
  idQuestion,
  description,
  type,
  answerOptions,
  numberQuestion,
  map,
  handleSubmit,
}: IQuestion) {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<CheckboxValueType[]>(
    []
  );
  const [answer, setAnswer] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false); // Trạng thái hiển thị pop-up

  const handleAnswerChange = (newAnswer: string) => {
    setAnswer(newAnswer);
  };

  const handleRadioChange = (option: string, idQuestion: number) => {
    const selectedContent = contentSubmit.find(
      (c) => c.question.id === idQuestion
    );

    if (selectedContent) {
      selectedContent.content = option;
    } else {
      contentSubmit.push({
        question: {
          id: idQuestion,
        },
        content: option,
      });
    }
  };

  const handleCheckboxChange = (e: CheckboxValueType[]) => {
    setSelectedOptions(e);
  };

  const handleConfirmation = () => {
    setShowConfirmation(true); // Hiển thị pop-up xác nhận
  };

  const handleCancel = () => {
    setShowConfirmation(false); // Ẩn pop-up xác nhận
  };

  const handleConfirmSubmit = () => {
    setShowConfirmation(false); // Ẩn pop-up xác nhận
    handleSubmit(contentSubmit); // Gọi hàm xử lý khi người dùng xác nhận nộp bài
  };

  return (
    <>
      <div
        style={{ textAlign: "left", margin: "0 auto 1.8em auto" }}
        ref={(node) => {
          if (node) {
            map.set(index, node);
          } else {
            map.delete(index);
          }
        }}
      >
        <div
          className="ques-info"
          style={{
            float: "left",
            width: "7em",
            padding: "0.5em",
            marginBottom: "1.8em",
            backgroundColor: "#f8f9fa",
            border: "1px solid #cad0d7",
            borderRadius: "2px",
          }}
        >
          Câu hỏi {index + 1}
        </div>
        <div className="ques-content" style={{ margin: "0 0 0 8.5em" }}>
          <div
            style={{
              backgroundColor: "#e7f3f5",
              borderColor: "b8dce2",
              padding: "12px 20px",
            }}
          >
            <div style={{ marginBottom: "1.5em" }}>
              <span>{description}</span>
            </div>

            <div key={idQuestion}>
              {type === "MULTI_CHOICE_ONE_SELECT" ? (
                <>
                  <div style={{ marginBottom: "0.5em" }}>Chọn một:</div>

                  <Radio.Group
                    onChange={(e) =>
                      handleRadioChange(e.target.value, idQuestion)
                    }
                  >
                    {answerOptions.map((answer) => (
                      <div key={answer.id}>
                        <Radio value={answer.content}>{answer.content}</Radio>
                        <br></br>
                      </div>
                    ))}
                  </Radio.Group>
                </>
              ) : type === "MULTI_CHOICE_ANSWERS" ? (
                <>
                  <div style={{ marginBottom: "0.5em" }}>
                    Chọn nhiều đáp án:
                  </div>

                  <Checkbox.Group onChange={handleCheckboxChange}>
                    {answerOptions.map((answer) => (
                      <Checkbox key={answer.id} value={answer.content}>
                        {answer.content}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                </>
              ) : (
                <>
                  <EssayQuestion onChange={handleAnswerChange} />
                  <EssayAnswer answer={answer} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "right" }}>
        {index === numberQuestion - 1 ? (
          <>
            <Button type="primary" onClick={handleConfirmation}>
              Submit
            </Button>
            <Modal
              title="Xác nhận nộp bài"
              open={showConfirmation}
              onOk={handleConfirmSubmit}
              onCancel={handleCancel}
            >
              <p>Bạn có chắc chắn muốn nộp bài không?</p>
            </Modal>
          </>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
