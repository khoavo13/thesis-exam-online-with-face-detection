import Icon from "@ant-design/icons";
import HandImg from "../../assets/hand.png";

export default function RaiseHand() {
  return (
    <Icon
      component={() => (
        <img style={{ width: "1em", height: "1em" }} src={HandImg} />
      )}
    />
  );
}
