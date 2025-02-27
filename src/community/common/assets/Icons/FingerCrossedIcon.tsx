import { JSX } from "react";

import { IconProps } from "~community/common/types/IconTypes";

const FingerCrossedIcon = ({
  width = "25",
  height = "25",
  id,
  svgProps,
  onClick
}: IconProps): JSX.Element => {
  return (
    <svg
      id={id}
      width={width}
      height={height}
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      onClick={onClick}
      {...svgProps}
    >
      <path d="M0.5 24.68H24.5V0.68H0.5V24.68Z" fill="url(#pattern11)" />
      <defs>
        <pattern
          id="pattern11"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use xlinkHref="#image0_1031_3725" transform="scale(0.015625)" />
        </pattern>
        <image
          id="image0_1031_3725"
          width="64"
          height="64"
          xlinkHref="data:image/png;base64,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"
        />
      </defs>
    </svg>
  );
};

export default FingerCrossedIcon;
