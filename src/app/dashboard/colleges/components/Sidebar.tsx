"use client";
import React from "react";
import Link from "next/link";
import { SideBarData } from "../data/SideBar";
import { GraduationCap } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-[280px] min-h-screen border-r border-border p-4">
      <div className="flex items-center gap-2 mb-6">
        <GraduationCap className="h-5 w-5 text-primary" />
        <span className="text-xl font-bold">EduFlow</span>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
          College Dashboard
        </h2>

        {SideBarData.map((data, index) => (
          <Link
            key={index}
            href={data.href}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
          >
            {data.value}
          </Link>
        ))}
      </div>
    </aside>
  );
}
