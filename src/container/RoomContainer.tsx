import React, { useEffect, useState } from "react";
import { socket, emitOffer, emitIce, emitAnswer } from "@api/socket";
import { streamState, peerConnectionState, dataChannelState } from "@recoil/state";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Video from "@presenter/Video";

const RoomTag = styled.div`
  width: 100%;
  height: 100vh;
  align-items: center;
  justify-content: center;
  display: flex;
`;

function RoomContainer() {
  const [stream, setStream] = useRecoilState<MediaStream>(streamState);
  const [userStream, setUserStream] = useState<MediaStream>(null);
  const [peerConnection, setPeerConnection] = useRecoilState<RTCPeerConnection>(peerConnectionState);
  const [dataChannel, setDataChannel] = useRecoilState<RTCDataChannel>(dataChannelState);
  const navigate = useNavigate();

  useEffect(() => {
    peerConnection.ontrack = (event) => {
      console.log("evnet", event.streams[0]);
      setUserStream(event.streams[0]);
    };

    socket
      .on("matching", (data) => joinUser(data))
      .on("answer", (answer) => setRemoteDescription(answer))
      .on("offer", (offerData) => receiveOffer(offerData))
      .on("ice", (ice) => addIceCandidate(ice));
  }, []);

  const joinUser = async (data) => {
    //createDataChannelAndOffer
    peerConnection.onicecandidate = (iceData) => {
      emitIce(iceData.candidate, data.id);
    };
    const chatDataChannel = createDataChannel("chat");
    chatDataChannel.onmessage = (e) => {
      handleReceiveMessage(e);
    };
    //createOffer
    const offer = await peerConnection.createOffer();
    peerConnection.setLocalDescription(offer);
    setDataChannel(chatDataChannel);
    emitOffer(offer, data.id);
  };

  const createDataChannel = (channelName: string) => {
    return peerConnection.createDataChannel(channelName);
  };

  const receiveOffer = async (offerData) => {
    const offer = offerData.data;
    const peerId = offerData.id;
    onDataChannelMessage();
    peerConnection.setRemoteDescription(offer);
    const answer = await peerConnection.createAnswer();
    peerConnection.setLocalDescription(answer);

    emitAnswer(answer, peerId);
  };

  const setRemoteDescription = (data) => {
    peerConnection.setRemoteDescription(data);
  };

  const addIceCandidate = (ice) => {
    peerConnection.addIceCandidate(ice.data);
  };

  const onDataChannelMessage = () => {
    peerConnection.ondatachannel = (event) => {
      const dataChannel = event.channel;
      dataChannel.onmessage = (e) => {
        handleReceiveMessage(e);
      };
    };
  };

  const handleReceiveMessage = (event) => {
    console.log("on Message ", event);
  };

  const exitRoom = () => {
    navigate("/");
  };

  return (
    <RoomTag>
      <Video stream={stream} />
      <Video stream={userStream} />
      {/* <div>chatArea</div> */}
    </RoomTag>
  );
}

export default RoomContainer;
