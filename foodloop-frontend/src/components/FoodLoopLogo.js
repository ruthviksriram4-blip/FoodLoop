function FoodLoopLogo({ size = 40, showText = true, variant = "light" }) {
  const isDark = variant === "dark";

  return (
    <div
      className="foodloop-logo-wrapper"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "12px",
        textDecoration: "none",
        userSelect: "none",
      }}
    >
      {/* Nature Glassmorphic SVG Logo Badge */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="foodloop-icon-svg"
        style={{
          flexShrink: 0,
          filter: "drop-shadow(0 4px 12px rgba(5, 150, 105, 0.35))",
          transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <defs>
          <linearGradient id={`bgGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#047857" />
            <stop offset="50%" stop-color="#059669" />
            <stop offset="100%" stop-color="#10b981" />
          </linearGradient>

          <linearGradient id={`leafGrad1-${size}`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="100%" stop-color="#d1fae5" />
          </linearGradient>

          <linearGradient id={`leafGrad2-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#6ee7b7" />
            <stop offset="100%" stop-color="#a7f3d0" />
          </linearGradient>
        </defs>

        {/* Squircle Badge Background */}
        <rect
          x="3"
          y="3"
          width="58"
          height="58"
          rx="18"
          fill={`url(#bgGrad-${size})`}
          stroke={isDark ? "rgba(167, 243, 208, 0.5)" : "rgba(255, 255, 255, 0.8)"}
          strokeWidth="2"
        />

        {/* Recycling / Loop Arrow Leaves */}
        {/* Left Leaf / Arrow */}
        <path
          d="M32 20 C23 12, 11 18, 14 29 C16 35, 25 36, 32 28 C26 27, 20 24, 20 20 C20 16, 27 16, 32 20 Z"
          fill={`url(#leafGrad1-${size})`}
        />

        {/* Right Leaf / Arrow */}
        <path
          d="M32 20 C41 12, 53 18, 50 29 C48 35, 39 36, 32 28 C38 27, 44 24, 44 20 C44 16, 37 16, 32 20 Z"
          fill={`url(#leafGrad2-${size})`}
        />

        {/* Food Sharing Bowl (Bottom Base) */}
        <path
          d="M19 37 C19 47, 45 47, 45 37 Z"
          fill="#ffffff"
          opacity="0.95"
        />

        {/* Heart Seed / Sprout Dot */}
        <circle cx="32" cy="20" r="3.2" fill="#ffffff" />
      </svg>

      {/* Brand Typography */}
      {showText && (
        <span
          className="foodloop-brand-text"
          style={{
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontSize: size > 32 ? "26px" : "21px",
            fontWeight: 800,
            letterSpacing: "-0.6px",
            display: "inline-flex",
            alignItems: "center",
            lineHeight: 1,
          }}
        >
          <span style={{ color: isDark ? "#ffffff" : "#064e3b" }}>Food</span>
          <span
            style={{
              background: isDark
                ? "linear-gradient(135deg, #a7f3d0 0%, #34d399 100%)"
                : "linear-gradient(135deg, #059669 0%, #10b981 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Loop
          </span>
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              backgroundColor: isDark ? "#6ee7b7" : "#10b981",
              marginLeft: "4px",
              display: "inline-block",
              boxShadow: "0 0 10px rgba(16, 185, 129, 0.9)",
            }}
          />
        </span>
      )}
    </div>
  );
}

export default FoodLoopLogo;
