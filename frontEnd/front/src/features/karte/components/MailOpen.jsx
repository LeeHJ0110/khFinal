export default function MailOpen({ size = 24, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 봉투 몸체 */}
      <path
        d="M4 8V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V8"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* 열린 덮개 */}
      <path
        d="M4 8L12 3L20 8"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 안쪽 접힘 */}
      <path
        d="M4 8L12 14L20 8"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 좌우 접힘 */}
      <path
        d="M4 18L10 12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M20 18L14 12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
