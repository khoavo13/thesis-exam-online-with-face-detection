import useCountdown from "../hooks/useCountdown";

interface ICountdownTimer {
  targetDate: number;
  onTimeout: () => void;
}

export default function CountdownTimer({
  targetDate,
  onTimeout,
}: ICountdownTimer) {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);

  if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) onTimeout();

  return <TimeDisplay hours={hours} minutes={minutes} seconds={seconds} />;
}

interface ITimeDisplay {
  hours: number;
  minutes: number;
  seconds: number;
}

function TimeDisplay({ hours, minutes, seconds }: ITimeDisplay) {
  return (
    <span
      style={{
        display: "inline-flex",
        justifyContent: "center",
        border: "1px solid black",
        color: "red",
        padding: "1px 3px",
        width: "90px",
      }}
    >
      <span>{hours > 0 ? hours : "00"}</span>
      <span style={{ marginRight: "2px", marginLeft: "2px" }}> : </span>
      <span>{minutes > 0 ? minutes : "00"}</span>
      <span style={{ marginRight: "2px", marginLeft: "2px" }}> : </span>
      <span>{seconds > 0 ? seconds : "00"}</span>
    </span>
  );
}
