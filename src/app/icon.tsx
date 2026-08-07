import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Browser icon generated from the same smile identity as the PWA icon. */
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#FFD54F",
        borderRadius: 16,
        display: "flex",
        height: "100%",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          alignItems: "center",
          background: "#FFFDF8",
          borderRadius: "50%",
          display: "flex",
          height: 42,
          justifyContent: "center",
          position: "relative",
          width: 42,
        }}
      >
        <div
          style={{
            background: "#333333",
            borderRadius: "50%",
            height: 5,
            left: 10,
            position: "absolute",
            top: 12,
            width: 5,
          }}
        />
        <div
          style={{
            background: "#333333",
            borderRadius: "50%",
            height: 5,
            position: "absolute",
            right: 10,
            top: 12,
            width: 5,
          }}
        />
        <div
          style={{
            borderBottom: "5px solid #333333",
            borderRadius: "0 0 30px 30px",
            bottom: 9,
            height: 12,
            position: "absolute",
            width: 23,
          }}
        />
      </div>
    </div>,
    size,
  );
}
