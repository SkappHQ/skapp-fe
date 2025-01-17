import { JSX } from "react";

import { IconProps } from "~community/common/types/IconTypes";

const AttendanceModuleIcon = ({
  width = "45",
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
      viewBox="0 0 45 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      {...svgProps}
    >
      <rect
        x="0.768066"
        y="-0.000854492"
        width="43.4638"
        height="48.0003"
        rx="21.7319"
        fill="white"
        style={{ fill: "white", fillOpacity: 1 }}
      />
      <path
        d="M33.2405 17.6967L35.41 15.5272C34.753 14.7481 34.035 14.0147 33.2558 13.373L31.0863 15.5425C28.7182 13.648 25.739 12.5175 22.5 12.5175C14.9068 12.5175 8.74976 18.6745 8.74976 26.2677C8.74976 33.8609 14.8915 40.018 22.5 40.018C30.1085 40.018 36.2503 33.8609 36.2503 26.2677C36.2503 23.044 35.1197 20.0648 33.2405 17.6967ZM22.5 36.9776C16.5874 36.9776 11.8054 32.1956 11.8054 26.283C11.8054 20.3704 16.5874 15.5883 22.5 15.5883C28.4126 15.5883 33.1947 20.3704 33.1947 26.283C33.1947 32.1956 28.4126 36.9776 22.5 36.9776Z"
        fill="#2A61A0"
        style={{ fill: "#2A61A0", fillOpacity: 1 }}
      />
      <rect
        x="20.8171"
        y="18.5796"
        width="3.1511"
        height="9.16684"
        fill="#EF8D42"
        style={{ fill: "#EF8D42", fillOpacity: 1 }}
      />
      <rect
        x="17.9531"
        y="7.98096"
        width="9.16684"
        height="3.1511"
        fill="#D64550"
        style={{ fill: "#D64550", fillOpacity: 1 }}
      />
    </svg>
  );
};

export default AttendanceModuleIcon;
