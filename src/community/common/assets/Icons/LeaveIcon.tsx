import { JSX } from "react";

import { IconProps } from "~community/common/types/IconTypes";

const LeaveIcon = ({
  fill = "black",
  width = "24",
  height = "25",
  id,
  svgProps,
  onClick
}: IconProps): JSX.Element => {
  return (
    <svg
      id={id}
      z={1}
      width={width}
      height={height}
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      {...svgProps}
    >
      <g clipPath="url(#clip0_16_1501)">
        <path
          d="M20.5 13.6508C20.5 15.0044 20.1768 16.2826 19.6118 17.4155L18.8619 16.6656C19.2692 15.7432 19.5 14.7229 19.5 13.6508C19.5 9.50461 16.1461 6.15076 12 6.15076C10.9279 6.15076 9.90752 6.38154 8.98519 6.78884L8.23526 6.03891C9.36814 5.47393 10.6463 5.15076 12 5.15076C14.0012 5.15076 15.8421 5.84874 17.3077 7.02119L17.6571 7.30076L17.9736 6.98431L19.0644 5.89348C19.3074 6.1149 19.5412 6.35096 19.7657 6.59792L18.6764 7.6872L18.3603 8.0034L18.6393 8.35279C19.8018 9.80822 20.5 11.6492 20.5 13.6508ZM4.91781 8.9454L5.14149 8.60514L4.85355 8.3172L2.45711 5.92076L3.16 5.21786L20.1829 22.2408L19.48 22.9436L17.3336 20.7972L17.0442 20.5078L16.7033 20.7343C15.3529 21.6314 13.7387 22.1508 12 22.1508C7.2965 22.1508 3.5 18.345 3.5 13.6508C3.5 11.9138 4.02835 10.2985 4.91781 8.9454ZM6.31355 9.7772L5.85805 9.3217L5.52979 9.87597C4.8753 10.9811 4.5 12.2688 4.5 13.6508C4.5 17.7969 7.85386 21.1508 12 21.1508C13.3822 21.1508 14.6679 20.7754 15.7799 20.1338L16.3445 19.8081L15.8836 19.3472L6.31355 9.7772ZM12.5 10.3036L11.5 9.30365V9.15076H12.5V10.3036ZM9.5 2.15076H14.5V3.15076H9.5V2.15076Z"
          fill={fill}
          stroke={fill}
        />
      </g>
      <defs>
        <clipPath id="clip0_16_1501">
          <rect
            width="24"
            height="24"
            fill="white"
            transform="translate(0 0.650757)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default LeaveIcon;