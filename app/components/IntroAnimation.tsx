"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface IntroAnimationProps {
  onComplete: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  // 'playing' = video active
  // 'fading'  = video smoothly cross-fading to reveal showroom underneath
  // 'done'    = overlay completely unmounted
  const [phase, setPhase] = useState<"playing" | "fading" | "done">("playing");
  const videoRef = useRef<HTMLVideoElement>(null);
  const completedRef = useRef(false);

  const triggerFadeOut = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setPhase("fading");
    onComplete();

    setTimeout(() => {
      setPhase("done");
    }, 1000);
  }, [onComplete]);

  useEffect(() => {
    const video = videoRef.current;

    // Hard fallback: never stay stuck on the video for more than 5.5s
    const fallbackTimer = setTimeout(() => {
      triggerFadeOut();
    }, 5500);

    if (video) {
      video.volume = 0.25;
      video.muted = false;

      const startPlayback = () => {
        const p = video.play();
        if (p !== undefined) {
          p.catch(() => {
            // Autoplay blocked: mute and start
            video.muted = true;
            video.play().catch(() => { });
          });
        }
      };

      startPlayback();

      const handleEnded = () => triggerFadeOut();
      const handleTimeUpdate = () => {
        // Fade out slightly before the red ending frame
        if (video.duration && video.currentTime >= Math.max(0.5, video.duration - 0.6)) {
          triggerFadeOut();
        }
      };

      video.addEventListener("ended", handleEnded);
      video.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        clearTimeout(fallbackTimer);
        video.removeEventListener("ended", handleEnded);
        video.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }

    return () => clearTimeout(fallbackTimer);
  }, [triggerFadeOut]);

  // Click anywhere or press any key to enter showroom instantly
  useEffect(() => {
    const handleKey = () => triggerFadeOut();
    window.addEventListener("keydown", handleKey, { once: true });
    return () => window.removeEventListener("keydown", handleKey);
  }, [triggerFadeOut]);

  if (phase === "done") return null;

  return (
    <div
      onClick={triggerFadeOut}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        backgroundColor: "#000000",
        pointerEvents: phase === "fading" ? "none" : "auto",
        userSelect: "none",
        cursor: "pointer",
        opacity: phase === "fading" ? 0 : 1,
        transition: "opacity 1s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
      }}
    >
      <video
        ref={videoRef}
        playsInline
        autoPlay
        controls={false}
        disablePictureInPicture
        tabIndex={-1}
        preload="auto"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center center",
          display: "block",
          pointerEvents: "none",
        }}
      >
        <source src="/intro.mp4" type="video/mp4" />
      </video>

      {/* Skip / Enter Showroom Button */}
      <div
        style={{
          position: "absolute",
          bottom: "32px",
          right: "32px",
          zIndex: 10,
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            triggerFadeOut();
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 22px",
            backgroundColor: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            borderRadius: "30px",
            color: "#ffffff",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "all 0.25s ease",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#dc2626";
            e.currentTarget.style.borderColor = "#ef4444";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(220, 38, 38, 0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.65)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.25)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.5)";
          }}
        >
          <span>Enter Showroom</span>
          <span style={{ fontSize: "0.9rem" }}>›</span>
        </button>
      </div>

      {/* Subtle Hint */}
      <div
        style={{
          position: "absolute",
          bottom: "38px",
          left: "32px",
          color: "rgba(255, 255, 255, 0.4)",
          fontSize: "0.7rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          pointerEvents: "none",
        }}
      >
        Click anywhere to skip
      </div>
    </div>
  );
}
