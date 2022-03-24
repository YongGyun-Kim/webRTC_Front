import React, { useEffect, useRef } from "react";
import styled from "styled-components";

const VideoTag = styled.video.attrs((props) => ({
  autoPlay: true,
  playsInline: true,
}))`
  width: 400px;
  height: 400px;
  transform: rotateY(180deg);
`;

function Video(props: { stream: MediaStream }) {
  const stream = props.stream;
  const reference = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    reference.current.srcObject = stream;
  }, [stream]);

  return <VideoTag ref={reference} />;
}
export default Video;
