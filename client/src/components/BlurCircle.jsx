import React from "react";

function BlurCircle({
  top = "auto",
  left = "auto",
  right = "auto",
  bottom = "auto",
}) {
  return (
    <div
      className="absolute -z-50 h-58 w-58 bg-primary/30 blur-3xl rounded-full aspect-square"
      style={{
        top: top,
        left: left,
        bottom: bottom,
        right: right,
      }}
    ></div>
  );
}

export default BlurCircle;
