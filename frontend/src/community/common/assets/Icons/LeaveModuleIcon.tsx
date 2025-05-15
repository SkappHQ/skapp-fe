import { JSX } from "react";

import { IconProps } from "~community/common/types/IconTypes";

const LeaveModuleIcon = ({
  width = "36",
  height = "34",
  id,
  svgProps,
  onClick
}: IconProps): JSX.Element => {
  return (
    <svg
      id={id}
      width={width}
      height={height}
      viewBox="0 0 36 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      {...svgProps}
    >
      <path
        d="M15.9084 29.124L24.9795 5.09595"
        stroke="#D64550"
        style={{ stroke: "#D64550", strokeOpacity: 1 }}
        strokeWidth="1.02268"
      />
      <path
        d="M31.525 19.2718L21.0975 15.3791L25.0635 4.87378C32.1237 7.50948 33.4242 12.2188 31.525 19.2718Z"
        fill="#2A61A0"
        style={{ fill: "#2A61A0", fillOpacity: 1 }}
      />
      <path
        d="M21.0975 15.3791L25.0635 4.87378C28.1285 6.87116 28.2472 13.4578 26.7283 17.4811L21.0975 15.3791Z"
        fill="#EF8D42"
        style={{ fill: "#EF8D42", fillOpacity: 1 }}
      />
      <path
        d="M10.6701 11.4863L21.0975 15.3791L25.0635 4.87378C18.0032 2.23807 13.9076 4.93291 10.6701 11.4863Z"
        fill="#2A61A0"
        style={{ fill: "#2A61A0", fillOpacity: 1 }}
      />
      <path
        d="M21.0975 15.3791L25.0635 4.87378C21.4338 4.37193 16.9856 9.25368 15.4667 13.277L21.0975 15.3791Z"
        fill="#D64550"
        style={{ fill: "#D64550", fillOpacity: 1 }}
      />
      <path
        d="M34.8805 32.3335H0.00878906C5.79285 28.2565 10.329 25.6579 17.6692 25.721C24.8449 25.7827 33.3711 28.2683 34.8805 32.3335Z"
        fill="#EF8D42"
        style={{ fill: "#EF8D42", fillOpacity: 1 }}
      />
    </svg>
  );
};

export default LeaveModuleIcon;
