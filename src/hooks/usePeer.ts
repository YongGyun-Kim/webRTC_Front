import React, { useState, useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { streamState, peerConnectionState } from "@recoil/state";

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

  return { initCall: initCall };
}

export default usePeer;
