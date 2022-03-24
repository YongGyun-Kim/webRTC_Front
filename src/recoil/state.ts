import { atom, selector } from "recoil";

const PEER_CONNECTION_KEY = "peer_connection_key";
const STREAM_TRACK_KEY = "stream_track_key";
const STREAM_KEY = "stream_key";

export const streamState = atom({ key: STREAM_KEY, default: null });
export const peerConnectionState = atom({
  key: PEER_CONNECTION_KEY,
  default: null,
});

export const streamTrackState = selector({
  key: STREAM_TRACK_KEY,
  get: ({ get }) => {
    const stream = get(streamState);

    return stream === null ? [] : stream.getTracks();
  },
});
