interface EssayAnswerProps {
    answer: string;
}

export default function EssayAnswer({answer}: EssayAnswerProps){
  return (
    <div>
      <p>{answer}</p>
    </div>
  );
}