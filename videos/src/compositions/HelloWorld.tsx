import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

export const HelloWorld: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="items-center justify-center bg-[#1a1a2e]">
      <h1
        style={{ opacity }}
        className="text-6xl font-bold text-[#e6b800]"
      >
        African Development Institute
      </h1>
    </AbsoluteFill>
  );
};
