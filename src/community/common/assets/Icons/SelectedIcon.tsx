import { JSX } from "react";

import { IconProps } from "~community/common/types/IconTypes";

const SelectedIcon = ({
  fill = "#9333ea",
  width = "14",
  height = "15",
  id,
  svgProps,
  onClick
}: IconProps): JSX.Element => {
  return (
    <svg
      id={id}
      width={width}
      height={height}
      viewBox="0 0 14 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      {...svgProps}
    >
      <path
        d="M7.00016 0.833252C3.32016 0.833252 0.333496 3.81992 0.333496 7.49992C0.333496 11.1799 3.32016 14.1666 7.00016 14.1666C10.6802 14.1666 13.6668 11.1799 13.6668 7.49992C13.6668 3.81992 10.6802 0.833252 7.00016 0.833252ZM5.1935 10.3599L2.80016 7.96659C2.73844 7.90486 2.68948 7.83159 2.65608 7.75095C2.62267 7.6703 2.60548 7.58387 2.60548 7.49659C2.60548 7.4093 2.62267 7.32287 2.65608 7.24222C2.68948 7.16158 2.73844 7.08831 2.80016 7.02659C2.86188 6.96486 2.93516 6.9159 3.0158 6.8825C3.09644 6.8491 3.18288 6.8319 3.27016 6.8319C3.35745 6.8319 3.44388 6.8491 3.52453 6.8825C3.60517 6.9159 3.67844 6.96486 3.74016 7.02659L5.66683 8.94659L10.2535 4.35992C10.3781 4.23527 10.5472 4.16524 10.7235 4.16524C10.8998 4.16524 11.0688 4.23527 11.1935 4.35992C11.3181 4.48457 11.3882 4.65363 11.3882 4.82992C11.3882 5.0062 11.3181 5.17527 11.1935 5.29992L6.1335 10.3599C6.07182 10.4217 5.99856 10.4708 5.91791 10.5042C5.83726 10.5377 5.75081 10.5549 5.6635 10.5549C5.57618 10.5549 5.48973 10.5377 5.40908 10.5042C5.32843 10.4708 5.25517 10.4217 5.1935 10.3599Z"
        fill={fill}
      />
    </svg>
  );
};

export default SelectedIcon;