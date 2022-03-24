import React, { useEffect, useState } from "react";
import Video from "@presenter/Video";
import { useNavigate } from "react-router-dom";
import { emitRegistrationQueue } from "@api/socket";

function LobbyContainer() {
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection>();
  const [sstream, setStream] = useState<MediaStream>();
  const navigate = useNavigate();

  useEffect(() => {
    const getMedia = async () => {
      const media = await navigator.mediaDevices.getUserMedia({
        video: { width: 400, height: 400, facingMode: "user" },
        audio: false,
      });
      return media;
    };

    const addTrack = async (peer: RTCPeerConnection, media: MediaStream) => {
      const tracks = await media.getTracks();
      tracks.forEach((track) => {
        peer.addTrack(track, media);
      });
    };

    const initCall = async () => {
      const media = await getMedia();
      const tempPeer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:stun1.l.google.com:19302",
              "stun:stun2.l.google.com:19302",
              "stun:stun3.l.google.com:19302",
              "stun:stun4.l.google.com:19302",
            ],
          },
        ],
      });
      tempPeer.ontrack = (event) => {
        event.streams[0];
      };
      await addTrack(tempPeer, media);
      setStream(media);
    };

    initCall();
  }, []);

  const join = () => {
    navigate("/room");
    emitRegistrationQueue();
  };

  return (
    <>
      Lobby
      <Video stream={sstream} />
      <button>Mute</button>
      <button>Camera</button>
      <button onClick={join}>Join</button>
    </>
  );
}

export default LobbyContainer;
