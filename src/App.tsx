import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { RecoilRoot } from "recoil";
import LobbyContainer from "@container/LobbyContainer";
import RoomContainer from "@container/RoomContainer";

import { connect } from "@api/socket";

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
