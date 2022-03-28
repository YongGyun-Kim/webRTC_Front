import { atom, selector } from "recoil";

const PEER_CONNECTION_KEY = "peer_connection_key";
const STREAM_TRACK_KEY = "stream_track_key";
const STREAM_KEY = "stream_key";
const DATA_CHANNEL_KEY = "data_channel_key";
const USER_STREAM_KEY = "user_stream_key";

export const streamState = atom({ key: STREAM_KEY, default: null });
export const userStreamState = atom({ key: USER_STREAM_KEY, default: null });
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

export const dataChannelState = atom({
  key: DATA_CHANNEL_KEY,
  default: null,
});
