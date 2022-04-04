import React, { useEffect, useState } from "react";
import { socket, emitOffer, emitIce, emitAnswer } from "@api/socket";
import { streamState, peerConnectionState, dataChannelState } from "@recoil/state";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Video from "@presenter/Video";
import usePeer from "@hooks/usePeer";

const RoomTag = styled.div`
  width: 100%;
  height: 100vh;
  align-items: center;
  justify-content: center;
  display: flex;
`;

function RoomContainer() {
  const { joinUser, receiveOffer, setRemoteDescription, addIceCandidate } = usePeer();
  const [stream, setStream] = useRecoilState<MediaStream>(streamState);
  const [peerConnection, setPeerConnection] = useRecoilState<RTCPeerConnection>(peerConnectionState);
  const [dataChannel, setDataChannel] = useRecoilState<RTCDataChannel>(dataChannelState);
  const navigate = useNavigate();
  const [userStreams, setUserStreams] = useState<MediaStream[]>([]);

  useEffect(() => {
    peerConnection.ontrack = (event) => {
      setUserStreams([event.streams[0]]);
    };

    socket
      .on("matching", (data) => joinUser(data))
      .on("answer", (answer) => setRemoteDescription(answer))
      .on("offer", (offerData) => receiveOffer(offerData.data, offerData.id))
      .on("ice", (ice) => addIceCandidate(ice.data));
  }, []);

  const exitRoom = () => {
    navigate("/");
  };

  return (
    <RoomTag>
      <Video stream={stream} />
      {userStreams.map((stream) => (
        <Video stream={stream} />
      ))}

      {/* <div>chatArea</div> */}
    </RoomTag>
  );
}

export default RoomContainer;
