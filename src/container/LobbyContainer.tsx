import React, { useEffect, useState } from "react";
import Video from "@presenter/Video";
import { useNavigate } from "react-router-dom";
import { emitRegistrationQueue } from "@api/socket";
import { streamState, peerConnectionState } from "@recoil/state";
import { useRecoilState, useSetRecoilState } from "recoil";

function LobbyContainer() {
  const [stream, setStream] = useRecoilState<MediaStream>(streamState);
  const [peerConnection, setPeerConnection] = useRecoilState<RTCPeerConnection>(peerConnectionState);
  const navigate = useNavigate();

  useEffect(() => {
    const getMedia = async () => {
      const media = await navigator.mediaDevices.getUserMedia({
        video: { width: 400, height: 400, facingMode: "user" },
        audio: false,
      });
      return media;
    };

    const addTrack = async (media: MediaStream) => {
      const tracks = await media.getTracks();
      tracks.forEach((track) => {
        peerConnection.addTrack(track, media);
      });
    };

    const initCall = async () => {
      const media = await getMedia();
      const tempPeerConnection = new RTCPeerConnection({
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
      tempPeerConnection.ontrack = (event) => {
        event.streams[0];
      };
      await addTrack(media);
      setStream(media);
      setPeerConnection(tempPeerConnection);
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
      <Video stream={stream} />
      <button>Mute</button>
      <button>Camera</button>
      <button onClick={join}>Join</button>
    </>
  );
}

export default LobbyContainer;
