function FoodLoopLogo({ size = 36, showText = true, variant = "light" }) {
  // variant: "light" (for white/sage glass background) or "dark" (for deep emerald sidebars)
  const isDark = variant === "dark";

  return (
    <div
      className="foodloop-logo-wrapper"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "10px",
        textDecoration: "none",
        userSelect: "none",
      }}
    >
      {/* Nature Glassmorphic SVG Logo Mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          flexShrink: 0,
          filter: "drop-shadow(0 4px 10px rgba(5, 150, 105, 0.25))",
          transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
        className="foodloop-icon-svg"
      >
        <defs>
          <linearGradient id={`flEmGrad-${size}`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#047857" />
            <stop offset="50%" stop-color="#10b981" />
            <stop offset="100%" stop-color="#34d399" />
          </linearGradient>

          <linearGradient id={`flSageGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#6ee7b7" />
            <stop offset="100%" stop-color="#a7f3d0" />
          </linearGradient>

          <linearGradient id={`flBowlGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#059669" />
            <stop offset="100%" stop-color="#10b981" />
          </linearGradient>

          <filter id={`flGlow-${size}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#10b981" flood-opacity="0.3" />
          </filter>
        </defs>

        {/* Outer Circular Halo Ring */}
        <circle
          cx="24"
          cy="24"
          r="22"
          fill={isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(209, 250, 229, 0.7)"}
          stroke={isDark ? "rgba(167, 243, 208, 0.3)" : "rgba(16, 185, 129, 0.35)"}
          strokeWidth="1.5"
        />

        {/* Redistribution Loop Bow (Organic Curve Arc) */}
        <path
          d="M13 23 C13 15, 21 11, 28 13 C35 15, 36 22, 30 27 C24 32, 17 28, 16 34 C15 39, 23 41, 31 39 C34 38, 36 36, 37 34"
          stroke={`url(#flEmGrad-${size})`}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#flGlow-${size})`}
        />

        {/* Embracing Sage Leaf */}
        <path
          d="M24 12 C28 14, 31 18, 29 23 C26 21, 23 18, 24 12 Z"
          fill={`url(#flSageGrad-${size})`}
        />

        {/* Caring Food Bowl Silhouette (Bottom Foundation) */}
        <path
          d="M17 29 C17 37, 31 37, 31 29 Z"
          fill={`url(#flBowlGrad-${size})`}
          opacity="0.9"
        />

        {/* Nourishing Heart Sprout Core */}
        <circle cx="24" cy="20" r="2.6" fill={isDark ? "#a7f3d0" : "#ffffff"} />
      </svg>

      {/* Brand Typography */}
      {showText && (
        <span
          className="foodloop-brand-text"
          style={{
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontSize: size > 32 ? "24px" : "20px",
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
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: isDark ? "#6ee7b7" : "#10b981",
              marginLeft: "3px",
              display: "inline-block",
              boxShadow: "0 0 8px rgba(16, 185, 129, 0.8)",
            }}
          />
        </span>
      )}
    </div>
  );
}

export default FoodLoopLogo;
