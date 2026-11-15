"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface IntroAnimationProps {
  onComplete: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  // 'playing' = video active
  // 'fading'  = video smoothly cross-fading to reveal showroom underneath
  // 'done'    = overlay completely unmounted
  const [phase, setPhase] = useState<"playing" | "fading" | "done">(() => {
    if (typeof window !== "undefined") {
      try {
        if (sessionStorage.getItem("rmc_intro_seen") === "true") {
          return "done";
        }
      } catch {
        // storage disabled
      }
    }
    return "playing";
  });

  const [isMobile, setIsMobile] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const completedRef = useRef(false);

  // Detect mobile viewport on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // If already seen in this session, trigger onComplete immediately on mount
  useEffect(() => {
    if (phase === "done") {
      completedRef.current = true;
      onComplete();
    }
  }, [phase, onComplete]);

  const triggerFadeOut = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    try {
      sessionStorage.setItem("rmc_intro_seen", "true");
    } catch {
      // storage disabled
    }
    setPhase("fading");
    onComplete();

    setTimeout(() => {
      setPhase("done");
    }, 1000);
  }, [onComplete]);

  // Video playback & event handlers (Mandatory / Non-skippable, Strictly Muted)
  useEffect(() => {
    if (phase === "done") return;

    const video = videoRef.current;
    if (!video) return;

    // Strictly muted: no audio playback
    video.muted = true;
    video.volume = 0;

    const startPlayback = () => {
      const p = video.play();
      if (p !== undefined) {
        p.catch(() => {
          video.muted = true;
          video.play().catch(() => {});
        });
      }
    };

    startPlayback();

    // Fallback safety timer: in case browser prevents playback or file hangs,
    // do not lock the user indefinitely (16s ceiling)
    const fallbackTimer = setTimeout(() => {
      triggerFadeOut();
    }, 16000);

    const handleEnded = () => {
      triggerFadeOut();
    };

    const handleTimeUpdate = () => {
      if (video.duration && video.duration > 0) {
        const pct = (video.currentTime / video.duration) * 100;
        setProgress(Math.min(pct, 100));

        // Smooth transition right as the video concludes
        if (video.currentTime >= Math.max(0.3, video.duration - 0.35)) {
          triggerFadeOut();
        }
      }
    };

    video.addEventListener("ended", handleEnded);
    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      clearTimeout(fallbackTimer);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [phase, isMobile, triggerFadeOut]);

  if (phase === "done") return null;

  const currentVideoSrc = isMobile ? "/intro-mobile.mp4" : "/intro.mp4";

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        backgroundColor: "#000000",
        pointerEvents: phase === "fading" ? "none" : "auto",
        userSelect: "none",
        cursor: "default",
        opacity: phase === "fading" ? 0 : 1,
        transition: "opacity 1s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
      }}
    >
      <video
        key={currentVideoSrc}
        ref={videoRef}
        playsInline
        autoPlay
        muted
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
        <source src={currentVideoSrc} type="video/mp4" />
      </video>

      {/* ── Bottom Mandatory Presentation Status & Progress Bar ── */}
      <div
        style={{
          position: "absolute",
          bottom: "clamp(20px, 4vw, 36px)",
          left: "clamp(16px, 4vw, 36px)",
          right: "clamp(16px, 4vw, 36px)",
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "0.68rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(255, 255, 255, 0.7)",
            fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#ef4444",
                boxShadow: "0 0 10px #ef4444",
                display: "inline-block",
              }}
            />
            <span>Rome Motor Cars • Atelier Introduction</span>
          </div>
          <span style={{ color: "rgba(255, 255, 255, 0.45)", fontSize: "0.62rem" }}>
            Mandatory Presentation
          </span>
        </div>

        {/* Ambient Crimson Progress Line */}
        <div
          style={{
            width: "100%",
            height: "2px",
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            borderRadius: "2px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              backgroundColor: "#ef4444",
              boxShadow: "0 0 12px #ef4444",
              transition: "width 0.15s linear",
            }}
          />
        </div>
      </div>
    </div>
  );
}
