import type { SVGProps } from "react";

interface XIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export const XIcon = ({ size = 24, width, height, ...props }: XIconProps) => {
  return (
    <svg
      width={width ?? size}
      height={height ?? size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid"
      fill="currentColor"
      {...props}
    >
      <path d="M18.244 2H21L13.5 10.594L22 22h-6.156l-5.094-6.594L5.406 22H2.656l8.031-9.188L2 2h6.187l4.75 6.281L18.244 2zm-1.094 18h1.656L7.75 4H6.094L17.15 20z" />
    </svg>
  );
};

export default XIcon;
