import React, { useState, useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { streamState, peerConnectionState } from "@recoil/state";
import { emitAnswer, emitIce, emitOffer } from "@api/socket";

function usePeer() {
  const [stream, setStream] = useRecoilState<MediaStream>(streamState);
  const [peerConnection, setPeerConnection] = useRecoilState<RTCPeerConnection>(peerConnectionState);

  const createPeerConnection = () => {
    return new RTCPeerConnection({
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
  };

  const initCall = async () => {
    const media = await getMedia();
    const tempPeerConnection = createPeerConnection();
    const tracks = await media.getTracks();
    tracks.forEach((track) => {
      tempPeerConnection.addTrack(track, media);
    });

    setPeerConnection(tempPeerConnection);
    setStream(media);
  };

  const getMedia = async () => {
    const media = await navigator.mediaDevices.getUserMedia({
      video: { width: 400, height: 400, facingMode: "user" },
      audio: false,
    });
    return media;
  };

  const joinUser = async (data) => {
    handleCandidate(data);
    createDataChannel("chat");
    const offer = await createOffer();
    emitOffer(offer, data.id);
  };

  const handleCandidate = (data) => {
    peerConnection.onicecandidate = (iceData) => {
      emitIce(iceData.candidate, data.id);
    };
  };

  const createDataChannel = (channelName: string) => {
    const dataChannel = peerConnection.createDataChannel(channelName);
    dataChannel.onmessage = (e) => {
      console.log("onMessage ", e);
    };
  };

  const createOffer = async () => {
    const offer = await peerConnection.createOffer();
    peerConnection.setLocalDescription(offer);
    return offer;
  };

  const receiveOffer = async (offer, peerId) => {
    onDataChannelMessage();
    peerConnection.setRemoteDescription(offer);
    const answer = await peerConnection.createAnswer();
    peerConnection.setLocalDescription(answer);
    emitAnswer(answer, peerId);
  };

  const onDataChannelMessage = () => {
    peerConnection.ondatachannel = (event) => {
      const dataChannel = event.channel;
      dataChannel.onmessage = (e) => {
        console.log("onMessage ", e);
      };
    };
  };

  const setRemoteDescription = (data) => {
    peerConnection.setRemoteDescription(data);
  };

  const addIceCandidate = (ice) => {
    peerConnection.addIceCandidate(ice);
  };

  return { initCall, joinUser, receiveOffer, setRemoteDescription, addIceCandidate };
}

export default usePeer;
