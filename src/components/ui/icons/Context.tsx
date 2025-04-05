export const ContextIcon = ({ color = "#fff" }: { color?: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} fill="none">
      <path
        className="deva-transition deva-duration-300 deva-ease-in-out"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.4}
        d="M7.402 15.4a1.6 1.6 0 1 0 3.2 0 1.6 1.6 0 0 0-3.2 0ZM13.8 15.4a1.6 1.6 0 1 0 3.2 0 1.6 1.6 0 0 0-3.2 0ZM1 15.4a1.6 1.6 0 1 0 3.2 0 1.6 1.6 0 0 0-3.2 0ZM7.402 2.6a1.6 1.6 0 1 0 3.2 0 1.6 1.6 0 0 0-3.2 0ZM9 4.2v9.6"
      />
      <path
        className="deva-transition deva-duration-300 deva-ease-in-out"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.4}
        d="M15.398 13.8v-3.2c0-1.6-.8-2.4-2.4-2.4h-8c-1.6 0-2.4.8-2.4 2.4v3.2"
      />
    </svg>
  );
};
