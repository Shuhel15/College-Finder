"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FloatingImageProps {
  children: ReactNode;
  className?: string;
}

export default function FloatingImage({
  children,
  className = "",
}: FloatingImageProps) {
  return (
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
