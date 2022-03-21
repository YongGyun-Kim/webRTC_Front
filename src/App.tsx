import React, { useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import LobbyContainer from "@container/LobbyContainer";
import RoomContainer from "@container/RoomContainer";

import { connect } from "@api/socket";
import { RecoilRoot } from "recoil";

function App() {
  useEffect(() => {
    connect();
  }, []);

  return (
    <RecoilRoot>
      <Routes>
        <Route path="/" element={<LobbyContainer />} />
        <Route path="/room" element={<RoomContainer />} />
      </Routes>
    </RecoilRoot>
  );
}

export default App;
