import { io, Socket } from "socket.io-client";

const location = window.location;

export let socket: Socket;

export function connect() {
  socket = io(location.protocol + "//" + location.hostname + ":8000");
}

export function emitRegistrationQueue() {
  socket.emit("queue_registration");
}

export function emitOffer(offer, peerData) {
  socket.emit("offer", offer, peerData);
}

export function emitIce(candidate, peerData) {
  socket.emit("ice", candidate, peerData);
}

export function emitAnswer(answer, peerData) {
  socket.emit("answer", answer, peerData);
}
