const HoldOrderSvg = () => {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50"
        height="50"
        viewBox="0 0 50 50"
        fill="none"
      >
        {/* Bottom Left Tray */}
        <path
          d="M10.0147 44.7812C8.4355 43.7333 7.65633 41.8708 6.098 38.1437L4.16675 33.3291H25.0001L24.9792 45.8333H17.6667L10.0147 44.7812Z"
          fill="#333333"
          fillOpacity="0.5"
        />

        {/* Bottom Right Tray */}
        <path
          d="M39.9459 44.7833C38.3667 45.8333 36.3417 45.8333 32.2917 45.8333H24.9792L25.0001 33.3291L45.8334 33.3437L43.8626 38.1478L39.9459 44.7833Z"
          fill="#333333"
          fillOpacity="0.5"
        />

        {/* Machine Body */}
        <path
          d="M32.348 16.7145H39.098C41.7605 16.7583 45.8334 15.3562 45.8334 10.2978C45.8334 5.04784 40.8084 4.16659 39.0959 4.16659H16.5542C11.3292 4.16659 4.16675 5.227 4.16675 14.2291V33.3291M4.16675 33.3291H25.0001M45.8334 23.9187V33.3291H25.0001M24.923 33.3312V45.8312"
          stroke="#333333"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* HOLD SYMBOL (Pause ||) */}
        <rect
          x="21"
          y="18"
          width="2.8"
          height="9"
          rx="1"
          fill="#333333"
        />
        <rect
          x="26"
          y="18"
          width="2.8"
          height="9"
          rx="1"
          fill="#333333"
        />

        {/* Base Line */}
        <path
          d="M25 33V45"
          stroke="#333333"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default HoldOrderSvg;
