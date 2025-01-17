import { JSX } from "react";

import { IconProps } from "~community/common/types/IconTypes";

const LeaveModuleIcon = ({
  width = "53",
  height = "48",
  id,
  svgProps,
  onClick
}: IconProps): JSX.Element => {
  return (
    <svg
      id={id}
      width={width}
      height={height}
      viewBox="0 0 53 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      {...svgProps}
    >
      <rect
        x="0.7771"
        y="-0.000854492"
        width="51.4459"
        height="47.9996"
        rx="23.9998"
        fill="white"
        style={{ fill: "white", fillOpacity: 1 }}
      />
      <path
        d="M24.6584 36.124L33.7295 12.0959"
        stroke="#D64550"
        style={{ stroke: "#D64550", strokeOpacity: 1 }}
        strokeWidth="1.02268"
      />
      <path
        d="M40.2752 26.2718L29.8478 22.3791L33.8137 11.8738C40.874 14.5095 42.1744 19.2188 40.2752 26.2718Z"
        fill="#2A61A0"
        style={{ fill: "#2A61A0", fillOpacity: 1 }}
      />
      <path
        d="M29.8478 22.3791L33.8137 11.8738C36.8788 13.8712 36.9975 20.4578 35.4786 24.4811L29.8478 22.3791Z"
        fill="#EF8D42"
        style={{ fill: "#EF8D42", fillOpacity: 1 }}
      />
      <path
        d="M19.4203 18.4863L29.8478 22.3791L33.8137 11.8738C26.7535 9.23807 22.6578 11.9329 19.4203 18.4863Z"
        fill="#2A61A0"
        style={{ fill: "#2A61A0", fillOpacity: 1 }}
      />
      <path
        d="M29.8478 22.3791L33.8137 11.8738C30.1841 11.3719 25.7358 16.2537 24.217 20.277L29.8478 22.3791Z"
        fill="#D64550"
        style={{ fill: "#D64550", fillOpacity: 1 }}
      />
      <path
        d="M43.6308 39.3335H8.75903C14.5431 35.2565 19.0792 32.6579 26.4194 32.721C33.5951 32.7827 42.1213 35.2683 43.6308 39.3335Z"
        fill="#EF8D42"
        style={{ fill: "#EF8D42", fillOpacity: 1 }}
      />
    </svg>
  );
};

export default LeaveModuleIcon;
