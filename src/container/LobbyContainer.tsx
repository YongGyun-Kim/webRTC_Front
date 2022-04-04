import React, { useEffect, useState } from "react";
import Video from "@presenter/Video";
import { useNavigate } from "react-router-dom";
import { emitRegistrationQueue } from "@api/socket";
import { streamState, peerConnectionState } from "@recoil/state";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import usePeer from "@hooks/usePeer";

const LobbyTag = styled.div`
  width: 100%;
  height: 100vh;
  align-items: center;
  justify-content: center;
  display: flex;
`;

function LobbyContainer() {
  const { initCall } = usePeer();
  const [stream, setStream] = useRecoilState<MediaStream>(streamState);
  const navigate = useNavigate();

  useEffect(() => {
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
