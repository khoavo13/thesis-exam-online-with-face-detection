import { JaaSMeeting } from "@jitsi/react-sdk";
import { IJitsiMeetExternalApi } from "@jitsi/react-sdk/lib/types";
import { useContext, useEffect, useRef } from "react";
import useNotification from "../../hooks/useNotifcation";
import { InfoCircleFilled } from "@ant-design/icons";
import AppContext from "../../context/AppProvider";
import ExamRoomContext from "../../context/ExamRoomProvider";
import StudentRoomContext from "../../context/StudentRoomProvider";
import moment from "moment";

interface IMeeting {
  setLogItems: React.Dispatch<React.SetStateAction<string[]>>;
}

const generateRoomName = () =>
  `JitsiMeetRoomNo${Math.random() * 100}-${Date.now()}`;

let firstLoad = true;

export default function Meeting({ setLogItems }: IMeeting) {
  const { openNotification } = useNotification();
  const { auth } = useContext(AppContext);
  const { examInfo, jitsiApiRef, isVerified } = useContext(ExamRoomContext);
  const { emitRaiseHand, isMutedRef, addMessage, setIncomingMessage } =
    useContext(StudentRoomContext);

  const handleJaaSIFrameRef = (iframeRef: HTMLDivElement) => {
    // iframeRef.style.border = "10px solid #3d3d3d";
    // iframeRef.style.background = "#3d3d3d";
    iframeRef.style.height = isVerified ? "200px" : "calc(100vh - 112px)";
    // iframeRef.style.marginBottom = "20px";
  };

  const handleChatUpdates = (payload: {
    isOpen: boolean; // Whether the chat panel is open or not
    unreadCount: number; // The unread messages counter
  }) => {
    if (!payload.unreadCount) return;

    setLogItems((items) => [
      ...items,
      `Bạn có ${payload.unreadCount} tin nhắn chưa đọc.`,
    ]);

    // shoot notificatin here
    openNotification!(
      "topRight",
      <InfoCircleFilled />,
      <h4 style={{ color: "green" }}>Chú ý</h4>,
      "Bạn có tin nhắn mới"
    );
    setIncomingMessage!(true);
  };

  const handleIncomingMessage = (payload: {
    from: string; // The id of the user that sent the message
    nick: string; // the nickname of the user that sent the message
    privateMessage: boolean; // whether this is a private or group message
    message: string; // the text of the message
  }) => {
    addMessage!({
      sender: "teacher",
      message: payload.message,
      isPrivate: payload.privateMessage,
      time: moment().format("LTS"),
    });
  };

  const handleAudioMuteStatusChanged = (payload: { muted: boolean }) => {
    console.log("audio status changed: ", payload.muted);
    console.log("State: ", isMutedRef?.current && !payload.muted);

    if (isMutedRef?.current && !payload.muted && !firstLoad) {
      openNotification!(
        "topRight",
        <InfoCircleFilled />,
        <h4 style={{ color: "green" }}>Chú ý</h4>,
        "Bạn cần được giám thị cho phép để phát biểu"
      );
      jitsiApiRef?.current?.executeCommand("muteEveryone", "audio");
    }

    if (firstLoad) firstLoad = false;
  };

  const handleRaiseHand = (payload: {
    id: string; // participantId of the user who raises/lowers the hand
    handRaised: number; // 0 when hand is lowered and the hand raised timestamp when raised.
  }) => {
    if (payload.handRaised === 0) return;

    emitRaiseHand!();
  };

  const handleVideoConferenceJoined = (payload: {
    roomName: string; // the room name of the conference
    id: string; // the id of the local participant
    displayName: string; // the display name of the local participant
    avatarURL: string; // the avatar URL of the local participant
    breakoutRoom: boolean; // whether the current room is a breakout room
  }) => {
    const participantId = payload.id;
    jitsiApiRef?.current?.pinParticipant(participantId);
  };

  const handleApiReady = (apiObj: IJitsiMeetExternalApi) => {
    if (!jitsiApiRef) return;

    jitsiApiRef.current = apiObj;

    jitsiApiRef.current.on("chatUpdated", handleChatUpdates); // listening
    jitsiApiRef.current.on("incomingMessage", handleIncomingMessage);
    jitsiApiRef.current.on(
      "audioMuteStatusChanged",
      handleAudioMuteStatusChanged
    );

    jitsiApiRef.current.on("raiseHandUpdated", handleRaiseHand);

    apiObj.addListener("videoConferenceJoined", handleVideoConferenceJoined);
  };

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
          displayName: `${auth?.fullname} (${auth?.userNumber})`,
          email: `${auth?.email}`,
        }}
        configOverwrite={{
          disableThirdPartyRequests: true,
          startWithAudioMuted: true,
          disableReactions: true,
          hiddenPremeetingButtons: [
            "microphone",
            "camera",
            "select-background",
            "invite",
            "settings",
          ],
          toolbarButtons: [
            // "camera",
            // "chat",
            "closedcaptions",
            "desktop",
            "microphone",
            "videoquality",
            // "hangup",
            "raisehand",
          ],
          toolbarConfig: {
            autoHideWhileChatIsOpen: true,
          },

          // Configs for prejoin page.
          prejoinConfig: {
            // When 'true', it shows an intermediate page before joining, where the user can configure their devices.
            enabled: false,
          },

          // When 'true', the user cannot edit the display name.
          readOnlyName: false,

          disableAddingBackgroundImages: true,

          disableTileView: true,

          // Options related to the remote participant menu.
          remoteVideoMenu: {
            // Whether the remote video context menu to be rendered or not.
            disabled: true,
            // If set to true the 'Kick out' button will be disabled.
            disableKick: true,
            // If set to true the 'Grant moderator' button will be disabled.
            disableGrantModerator: true,
            // If set to true the 'Send private message' button will be disabled.
            disablePrivateChat: true,
          },

          disable1On1Mode: true,
          // Hides the display name from the participant thumbnail
          hideDisplayName: true,
          // Hides the dominant speaker name badge that hovers above the toolbox
          hideDominantSpeakerBadge: true,

          // Disables profile and the edit of all fields from the profile settings (display name and email)
          disableProfile: true,

          hideParticipantsStats: true,

          disableSelfView: false,

          // Application logo url
          defaultLogoUrl: "",
        }}
        interfaceConfigOverwrite={{
          VIDEO_LAYOUT_FIT: "both",
          MOBILE_APP_PROMO: false,
          TILE_VIEW_MAX_COLUMNS: 4,
        }}
      />
    </>
  );
}
