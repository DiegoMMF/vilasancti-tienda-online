import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleTouchIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#faebd7",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "22px",
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 600,
            color: "#bdb76b",
            fontFamily: "Cormorant, serif",
          }}
        >
          V
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
