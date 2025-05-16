import { IconProps } from "~community/common/types/IconTypes";

const ProjectManagementModuleIcon = ({
  width = "48",
  height = "40",
  id,
  svgProps,
  onClick
}: IconProps) => {
  return (
    <svg
      id={id}
      width={width}
      height={height}
      viewBox="0 0 33 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      {...svgProps}
    >
      <path
        d="M16.4213 3.58008H18.8885C19.5428 3.58008 19.7734 3.58897 20.6331 4.33839C21.4927 5.08781 21.0815 7.41793 21.0815 7.41793M21.0815 24.2923C21.0815 24.9789 21.0957 25.6375 20.6331 26.123C20.1704 26.6085 19.5428 26.8813 18.8885 26.8813H4.08535C3.43101 26.8813 2.80347 26.6085 2.34079 26.123C1.8781 25.6375 1.61816 24.9789 1.61816 24.2923V6.1691C1.61816 5.48245 1.8781 4.82392 2.34079 4.33839C2.80347 3.85285 3.43101 3.58008 4.08535 3.58008H6.55254"
        stroke="#2A61A0"
        style={{ stroke: "#2A61A0" }}
        strokeWidth="1.91893"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.1718 1.11328H7.85246C7.17873 1.11328 6.63257 1.65944 6.63257 2.33317V4.77295C6.63257 5.44667 7.17873 5.99284 7.85246 5.99284H15.1718C15.8455 5.99284 16.3917 5.44667 16.3917 4.77295V2.33317C16.3917 1.65944 15.8455 1.11328 15.1718 1.11328Z"
        stroke="#2A61A0"
        style={{ stroke: "#2A61A0" }}
        strokeWidth="1.91893"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <mask id="path-3-inside-1_4869_16177" fill="white">
        <rect
          x="4.9043"
          y="10.1562"
          width="5.07144"
          height="5.07144"
          rx="0.845241"
        />
      </mask>
      <rect
        x="4.9043"
        y="10.1562"
        width="5.07144"
        height="5.07144"
        rx="0.845241"
        stroke="#EF8D42"
        style={{ stroke: "#EF8D42" }}
        strokeWidth="2.1131"
        mask="url(#path-3-inside-1_4869_16177)"
      />
      <mask id="path-4-inside-2_4869_16177" fill="white">
        <rect
          x="4.9043"
          y="17.4258"
          width="5.34558"
          height="5.34558"
          rx="0.890929"
        />
      </mask>
      <rect
        x="4.9043"
        y="17.4258"
        width="5.34558"
        height="5.34558"
        rx="0.890929"
        stroke="#EF8D42"
        style={{ stroke: "#EF8D42" }}
        strokeWidth="2.22732"
        mask="url(#path-4-inside-2_4869_16177)"
      />
      <path
        d="M12.3625 11.5527H19.352"
        stroke="#EF8D42"
        style={{ stroke: "#EF8D42" }}
        strokeWidth="1.3979"
        strokeLinecap="round"
      />
      <path
        d="M12.2756 18.3477H19.6429"
        stroke="#EF8D42"
        style={{ stroke: "#EF8D42" }}
        strokeWidth="1.47346"
        strokeLinecap="round"
      />
      <path
        d="M12.3625 13.8867H16.3233"
        stroke="#EF8D42"
        style={{ stroke: "#EF8D42" }}
        strokeWidth="1.3979"
        strokeLinecap="round"
      />
      <path
        d="M12.2756 20.8066H16.4504"
        stroke="#EF8D42"
        style={{ stroke: "#EF8D42" }}
        strokeWidth="1.47346"
        strokeLinecap="round"
      />
      <circle
        cx="23.2292"
        cy="15.8437"
        r="7.37589"
        fill="#D64550"
        stroke="white"
        style={{ fill: "#D64550", stroke: "white" }}
        strokeWidth="2.18545"
      />
      <path
        d="M26.2891 14.1328L22.4811 17.9408L20.7502 16.2099"
        stroke="white"
        style={{ stroke: "white" }}
        strokeWidth="1.38472"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ProjectManagementModuleIcon;
