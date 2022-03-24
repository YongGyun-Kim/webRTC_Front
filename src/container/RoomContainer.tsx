import React, { useEffect } from "react";
import { socket, emitOffer, emitIce, emitAnswer } from "@api/socket";

function RoomContainer() {
  useEffect(() => {
    socket.on("", () => {});
  }, []);

  const joinUser = (data) => {
    // createDataChannelAndOffer()
  };

  const receiveOffer = () => {
    // const peerConnection = peerC.getPeer();
    // onDataChannelMessage(peerConnection);
    // setRemoteDescription(peerConnection, offer);
    // createAndSetanswer(peerConnection).then((answer) => emitAnswer(answer, peerId));
    // setPeerData({ id: peerId, nickName: peerData.nickName });
  };

  return <>Room</>;
}

export default RoomContainer;
