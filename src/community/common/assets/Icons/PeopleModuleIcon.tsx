import { JSX } from "react";

import { IconProps } from "~community/common/types/IconTypes";

const PeopleModuleIcon = ({
  width = "48",
  height = "40",
  id,
  svgProps,
  onClick
}: IconProps): JSX.Element => {
  return (
    <svg
      id={id}
      width={width}
      height={height}
      viewBox="0 0 35 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      {...svgProps}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M26.4479 14.076C29.3055 14.076 31.6219 11.7595 31.6219 8.902C31.6219 6.04449 29.3055 3.72803 26.4479 3.72803C23.5904 3.72803 21.274 6.04449 21.274 8.902C21.274 11.7595 23.5904 14.076 26.4479 14.076ZM34.4931 25.9782C34.5635 26.7943 33.8927 27.4597 33.0736 27.4597H25.3609L17.6482 27.4597C16.8291 27.4597 16.1583 26.7943 16.2287 25.9782C16.4702 23.1802 17.3906 20.5575 18.8584 18.545C20.583 16.1807 22.922 14.8524 25.3609 14.8524C27.7998 14.8524 30.1388 16.1807 31.8634 18.545C33.3313 20.5575 34.2517 23.1802 34.4931 25.9782Z"
        fill="#D64550"
        style={{ fill: "#D64550", fillOpacity: 1 }}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.1321 14.076C12.9896 14.076 15.3061 11.7595 15.3061 8.902C15.3061 6.04449 12.9896 3.72803 10.1321 3.72803C7.27461 3.72803 4.95815 6.04449 4.95815 8.902C4.95815 11.7595 7.27461 14.076 10.1321 14.076ZM18.7709 25.9782C18.8414 26.7943 18.1706 27.4597 17.3514 27.4597H9.63875L1.92608 27.4597C1.10692 27.4597 0.436123 26.7943 0.506549 25.9782C0.747998 23.1802 1.66839 20.5575 3.13628 18.545C4.86084 16.1807 7.19985 14.8524 9.63875 14.8524C12.0776 14.8524 14.4167 16.1807 16.1412 18.545C17.6091 20.5575 18.5295 23.1802 18.7709 25.9782Z"
        fill="#EF8D42"
        style={{ fill: "#EF8D42", fillOpacity: 1 }}
      />
      <mask
        id="path-3-outside-1_4088_34016"
        maskUnits="userSpaceOnUse"
        x="6.80664"
        y="-0.349365"
        width="23"
        height="31"
        fill="black"
      >
        <rect fill="white" x="6.80664" y="-0.349365" width="23" height="31" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18.7172 13.5163C21.9938 13.5163 24.65 10.8601 24.65 7.58346C24.65 4.30685 21.9938 1.65063 18.7172 1.65063C15.4406 1.65063 12.7844 4.30685 12.7844 7.58346C12.7844 10.8601 15.4406 13.5163 18.7172 13.5163ZM28.2661 26.8669C28.3345 27.6832 27.6639 28.3486 26.8447 28.3486H18.5388H10.2328C9.41368 28.3486 8.74308 27.6832 8.81144 26.8669C9.05897 23.9112 10.0418 21.1382 11.6168 19.0144C13.4526 16.5388 15.9425 15.148 18.5388 15.148C21.135 15.148 23.6249 16.5388 25.4608 19.0144C27.0357 21.1382 28.0186 23.9112 28.2661 26.8669Z"
        />
      </mask>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.7172 13.5163C21.9938 13.5163 24.65 10.8601 24.65 7.58346C24.65 4.30685 21.9938 1.65063 18.7172 1.65063C15.4406 1.65063 12.7844 4.30685 12.7844 7.58346C12.7844 10.8601 15.4406 13.5163 18.7172 13.5163ZM28.2661 26.8669C28.3345 27.6832 27.6639 28.3486 26.8447 28.3486H18.5388H10.2328C9.41368 28.3486 8.74308 27.6832 8.81144 26.8669C9.05897 23.9112 10.0418 21.1382 11.6168 19.0144C13.4526 16.5388 15.9425 15.148 18.5388 15.148C21.135 15.148 23.6249 16.5388 25.4608 19.0144C27.0357 21.1382 28.0186 23.9112 28.2661 26.8669Z"
        fill="#2A61A0"
        style={{ fill: "#2A61A0", fillOpacity: 1 }}
      />
      <path
        d="M28.2661 26.8669L26.7881 26.9907V26.9907L28.2661 26.8669ZM8.81144 26.8669L7.33341 26.7432L8.81144 26.8669ZM11.6168 19.0144L10.4254 18.1309H10.4254L11.6168 19.0144ZM25.4608 19.0144L24.2694 19.8979L25.4608 19.0144ZM23.1668 7.58346C23.1668 10.0409 21.1746 12.0331 18.7172 12.0331V14.9995C22.8129 14.9995 26.1332 11.6792 26.1332 7.58346H23.1668ZM18.7172 3.13384C21.1746 3.13384 23.1668 5.126 23.1668 7.58346H26.1332C26.1332 3.4877 22.8129 0.167429 18.7172 0.167429V3.13384ZM14.2676 7.58346C14.2676 5.126 16.2597 3.13384 18.7172 3.13384V0.167429C14.6214 0.167429 11.3012 3.4877 11.3012 7.58346H14.2676ZM18.7172 12.0331C16.2597 12.0331 14.2676 10.0409 14.2676 7.58346H11.3012C11.3012 11.6792 14.6214 14.9995 18.7172 14.9995V12.0331ZM26.8447 29.8318C28.4466 29.8318 29.8919 28.5071 29.7442 26.7432L26.7881 26.9907C26.7867 26.9739 26.7891 26.9495 26.7983 26.9247C26.8069 26.9017 26.8181 26.8868 26.8259 26.8788C26.8403 26.8641 26.8495 26.8654 26.8447 26.8654V29.8318ZM18.5388 29.8318H26.8447V26.8654H18.5388V29.8318ZM10.2328 29.8318H18.5388V26.8654H10.2328V29.8318ZM7.33341 26.7432C7.18569 28.5071 8.63095 29.8318 10.2328 29.8318V26.8654C10.2281 26.8654 10.2373 26.8641 10.2516 26.8788C10.2595 26.8868 10.2707 26.9017 10.2793 26.9247C10.2885 26.9495 10.2909 26.9739 10.2895 26.9907L7.33341 26.7432ZM10.4254 18.1309C8.66437 20.5057 7.60071 23.5512 7.33341 26.7432L10.2895 26.9907C10.5172 24.2711 11.4193 21.7707 12.8082 19.8979L10.4254 18.1309ZM18.5388 13.6648C15.3817 13.6648 12.4819 15.3578 10.4254 18.1309L12.8082 19.8979C14.4234 17.7198 16.5034 16.6312 18.5388 16.6312V13.6648ZM26.6521 18.1309C24.5957 15.3578 21.6959 13.6648 18.5388 13.6648V16.6312C20.5742 16.6312 22.6542 17.7198 24.2694 19.8979L26.6521 18.1309ZM29.7442 26.7432C29.4769 23.5512 28.4132 20.5057 26.6521 18.1309L24.2694 19.8979C25.6583 21.7707 26.5603 24.2711 26.7881 26.9907L29.7442 26.7432Z"
        fill="#FAFAFA"
        style={{ fill: "#FAFAFA", fillOpacity: 1 }}
        mask="url(#path-3-outside-1_4088_34016)"
      />
    </svg>
  );
};

export default PeopleModuleIcon;
