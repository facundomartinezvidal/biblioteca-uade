import type { SVGProps } from "react";

interface DrizzleIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export const DrizzleIcon = ({
  size = 24,
  width,
  height,
  ...props
}: DrizzleIconProps) => {
  return (
    <svg
      role="img"
      width={width ?? size}
      height={height ?? size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid"
      {...props}
    >
      <path
        d="M5.353 11.823a1.036 1.036 0 0 0 -0.395 -1.422 1.063 1.063 0 0 0 -1.437 0.399L0.138 16.702a1.035 1.035 0 0 0 0.395 1.422 1.063 1.063 0 0 0 1.437 -0.398l3.383 -5.903Zm11.216 0a1.036 1.036 0 0 0 -0.394 -1.422 1.064 1.064 0 0 0 -1.438 0.399l-3.382 5.902a1.036 1.036 0 0 0 0.394 1.422c0.506 0.283 1.15 0.104 1.438 -0.398l3.382 -5.903Zm7.293 -4.525a1.036 1.036 0 0 0 -0.395 -1.422 1.062 1.062 0 0 0 -1.437 0.399l-3.383 5.902a1.036 1.036 0 0 0 0.395 1.422 1.063 1.063 0 0 0 1.437 -0.399l3.383 -5.902Zm-11.219 0a1.035 1.035 0 0 0 -0.394 -1.422 1.064 1.064 0 0 0 -1.438 0.398l-3.382 5.903a1.036 1.036 0 0 0 0.394 1.422c0.506 0.282 1.15 0.104 1.438 -0.399l3.382 -5.902Z"
        fill="#C5F74F"
        strokeWidth="1"
      />
    </svg>
  );
};

export default DrizzleIcon;
