import { motion } from "motion/react";

/**
 * Huxe 風の抽象モーションアート背景。
 * 複数の彩度高めのグラデーション円を blur で重ね、ゆっくり動かす。
 */
export function MotionArt() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: "linear-gradient(180deg, #1f1d2a 0%, #2a2632 100%)",
      }}
    >
      <motion.div
        initial={{ x: "-10%", y: "-20%", scale: 1 }}
        animate={{ x: "20%", y: "10%", scale: 1.3 }}
        transition={{ duration: 22, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: "120%",
          height: "120%",
          left: 0,
          top: 0,
          background: "radial-gradient(circle at 30% 40%, var(--hero-base) 0%, transparent 55%)",
          filter: "blur(40px)",
          mixBlendMode: "screen",
          opacity: 0.95,
        }}
      />
      <motion.div
        initial={{ x: "10%", y: "10%", scale: 1.1 }}
        animate={{ x: "-20%", y: "-15%", scale: 1.5 }}
        transition={{ duration: 28, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: "110%",
          height: "110%",
          right: 0,
          top: 0,
          background: "radial-gradient(circle at 70% 30%, var(--hero-highlight) 0%, transparent 55%)",
          filter: "blur(50px)",
          mixBlendMode: "screen",
          opacity: 0.9,
        }}
      />
      <motion.div
        initial={{ x: "-5%", y: "30%", scale: 1.2 }}
        animate={{ x: "15%", y: "-5%", scale: 0.95 }}
        transition={{ duration: 34, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: "120%",
          height: "120%",
          left: "-10%",
          bottom: "-10%",
          background: "radial-gradient(circle at 50% 60%, var(--hero-shadow) 0%, transparent 60%)",
          filter: "blur(55px)",
          mixBlendMode: "screen",
          opacity: 0.85,
        }}
      />

      {/* 暗いビネット (テキスト可読性のため) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.35) 100%)",
        }}
      />
    </div>
  );
}
