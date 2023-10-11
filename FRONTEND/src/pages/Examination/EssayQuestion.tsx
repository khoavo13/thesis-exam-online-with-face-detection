import { Input } from "antd";

interface EssayQuestionaProps {
  onChange: (answer: string) => void;
}

const {TextArea} = Input;

export default function EssayQuestion ({ onChange}: EssayQuestionaProps){
  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const answer = e.target.value;
    onChange(answer);
  };

  return (
    <div>
      <TextArea rows={4} onChange={handleAnswerChange} />
    </div>
  );
};