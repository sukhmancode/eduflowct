"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useAnimation } from "framer-motion";

interface Props {
  secondaryHeading?: string;
  number?: number;
  secondary?: string;
  href?: string;
}

export default function Card({
  secondaryHeading,
  number = 0,
  secondary,
  href,
}: Props) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = typeof number === "number" ? number : 0;
    if (start === end) return;

    let duration = 1000;
    let stepTime = Math.abs(Math.floor(duration / end));

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [number]);

  return (
    <div className="relative group overflow-hidden p-6 rounded-xl bg-[#1e293b] text-white shadow-md hover:shadow-xl transition-all duration-300 w-full max-w-[400px]">
      {/* Shimmer on hover */}
      <div className="absolute inset-0">
        <div className="absolute w-1/3 h-full bg-white/10 blur-md transform translate-x-full group-hover:animate-shimmer pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <p className="text-sm text-gray-300 mb-2">{secondaryHeading}</p>
        <p className="text-2xl font-bold">
          {count} <span>{secondary}</span>
        </p>

        {href && (
          <Link href={href}>
            <button className="mt-4 px-4 py-2 bg-white text-gray-800 rounded-md font-semibold transition hover:shadow-lg">
              View Details
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
