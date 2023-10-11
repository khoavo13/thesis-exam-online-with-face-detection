import { JaaSMeeting } from "@jitsi/react-sdk";
import { IJitsiMeetExternalApi } from "@jitsi/react-sdk/lib/types";
import useNotification from "../../../hooks/useNotifcation";
import { InfoCircleFilled } from "@ant-design/icons";
import { useCallback, useContext, useEffect, useState } from "react";
import AppContext from "../../../context/AppProvider";
import ExamRoomContext from "../../../context/ExamRoomProvider";
import TeacherRoomContext from "../../../context/TeacherRoomProvider";

interface IMeeting {
  apiRef: React.MutableRefObject<IJitsiMeetExternalApi | undefined>;
  // setLogItems: React.Dispatch<React.SetStateAction<string[]>>;
}

type UnusualActionPayload = {
  participantId: string;
  name: string;
  unusualType: string;
};

interface ITemp {
  jitsiId: string;
  displayName: string;
}

const generateRoomName = () =>
  `JitsiMeetRoomNo${Math.random() * 100}-${Date.now()}`;

const handleJaaSIFrameRef = (iframeRef: HTMLDivElement) => {
  iframeRef.style.height = "100%";
  // iframeRef.style.marginBottom = "20px";
};

let localParticipantId: string;

export default function Meeting() {
  const { openNotification } = useNotification();
  const { auth } = useContext(AppContext);
  const { examInfo, jitsiApiRef } = useContext(ExamRoomContext);
  const { setUsers, users } = useContext(TeacherRoomContext);
  const [tempInfo, setTempInfo] = useState<ITemp>(); // temporary info about new arrive user, changed when new user come in

  const handleRaiseHand = (payload: {
    id: string; // participantId of the user who raises/lowers the hand
    handRaised: number; // 0 when hand is lowered and the hand raised timestamp when raised.
  }) => {
    if (payload.handRaised === 0 || localParticipantId === payload.id) return;

    openNotification!(
      "topRight",
      <InfoCircleFilled />,
      <h4 style={{ color: "green" }}>Chú ý</h4>,
      `Có sinh viên muốn phát biểu!`
    );
  };

  const handleParticipantJoined = (payload: {
    id: string;
    displayName: string;
  }) => {
    setTempInfo({
      jitsiId: payload.id,
      displayName: payload.displayName,
    });
  };

  const handleParticipantLeft = (payload: { id: string }) => {
    // this is silly code too!
    // removeUser!(payload.id);
    // removeUnAuthenUser!(payload.id);
  };

  const handleVideoConferenceJoined = (payload: {
    roomName: string; // the room name of the conference
    id: string; // the id of the local participant
    displayName: string; // the display name of the local participant
    avatarURL: string; // the avatar URL of the local participant
    breakoutRoom: boolean; // whether the current room is a breakout room
  }) => {
    localParticipantId = payload.id;
  };

  const handleIncomingMessage = (payload: {
    from: string; // The id of the user that sent the message
    nick: string; // the nickname of the user that sent the message
    privateMessage: boolean; // whether this is a private or group message
    message: string; // the text of the message
  }) => {
    console.log(payload);
  };

  const handleApiReady = (apiObj: IJitsiMeetExternalApi) => {
    if (!jitsiApiRef) return;

    jitsiApiRef.current = apiObj;

    jitsiApiRef.current.on("raiseHandUpdated", handleRaiseHand);
    jitsiApiRef.current.on("participantJoined", handleParticipantJoined);
    jitsiApiRef.current.on("participantLeft", handleParticipantLeft);
    jitsiApiRef.current.on(
      "videoConferenceJoined",
      handleVideoConferenceJoined
    );

    // jitsiApiRef.current.setAudioOutputDevice(deviceLabel, deviceId);
    jitsiApiRef.current.isAudioMuted().then((muted) => {
      console.log("Mute status: ", muted);
    });

    jitsiApiRef.current.on("incomingMessage", handleIncomingMessage);
  };

  useEffect(() => {
    if (!tempInfo) return;

    // I know this is bad for performance, I will fix this someday :v

    const newUsers = users?.map((user) => {
      if (user.name !== tempInfo.displayName) return user;

      return {
        ...user,
        jitsiId: tempInfo.jitsiId,
      };
    });

    // const newUnAuthenUsers = unAuthenUsers?.map((user) => {
    //   if (user.name !== tempInfo.displayName) return user;

    //   return {
    //     ...user,
    //     jitsiId: tempInfo.jitsiId,
    //   };
    // });

    setUsers!(newUsers!);
    // setUnAuthenUsers!(newUnAuthenUsers!);
  }, [tempInfo]);

  return (
    <>
      <JaaSMeeting
        appId="EXAM-ONLINE"
        roomName={`${examInfo?.name} ${
          examInfo?.type == "MIDTERM" ? "Giữa kỳ" : "Cuối kỳ"
        }`}
        getIFrameRef={handleJaaSIFrameRef}
        onApiReady={handleApiReady}
        userInfo={{
          displayName: `${auth?.fullname} (giam thi)`,
          email: `${auth?.email}`,
        }}
        configOverwrite={{
          defaultLogoUrl: "",
          disableThirdPartyRequests: true,
          startWithVideoMuted: true,
          backgroundAlpha: 0.5,
          startWithAudioMuted: true,
          disableReactions: true,
          hiddenPremeetingButtons: [
            "microphone",
            "camera",
            "select-background",
            "invite",
            "settings",
          ],
          toolbarConfig: {
            autoHideWhileChatIsOpen: true,
          },
          // Configs for prejoin page.
          prejoinConfig: {
            // When 'true', it shows an intermediate page before joining, where the user can configure their devices.
            enabled: false,
          },
        }}
        interfaceConfigOverwrite={{
          VIDEO_LAYOUT_FIT: "both",
          MOBILE_APP_PROMO: false,
          TILE_VIEW_MAX_COLUMNS: 4,
        }}
        // spinner = { SpinnerView }
        // onApiReady = { (externalApi) => { ... } }
      />
    </>
  );
}
