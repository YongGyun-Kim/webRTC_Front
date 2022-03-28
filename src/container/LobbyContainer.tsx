import React, { useEffect, useState } from "react";
import Video from "@presenter/Video";
import { useNavigate } from "react-router-dom";
import { emitRegistrationQueue } from "@api/socket";
import { streamState, peerConnectionState } from "@recoil/state";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

const LobbyTag = styled.div`
  width: 100%;
  height: 100vh;
  align-items: center;
  justify-content: center;
  display: flex;
`;

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

      const tracks = await media.getTracks();
      tracks.forEach((track) => {
        tempPeerConnection.addTrack(track, media);
      });
      setPeerConnection(tempPeerConnection);
      // await addTrack(media);
      setStream(media);
    };

    initCall();
  }, []);

  const join = () => {
    navigate("/room");
    emitRegistrationQueue();
  };

  return (
    <LobbyTag>
      <div>
        <Video stream={stream} />

        <Stack direction="row" spacing={2} justifyContent="center">
          {/* <Button variant="contained">Mute</Button>
          <Button variant="contained">Camera</Button> */}
          <Button variant="contained" onClick={join}>
            Join
          </Button>
        </Stack>
      </div>
    </LobbyTag>
  );
}

export default LobbyContainer;
