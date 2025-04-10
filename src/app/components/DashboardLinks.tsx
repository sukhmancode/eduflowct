"use client";
import { cn } from "@/lib/utils";
import {
  FilePlus,
  User,
  FileBarChart,
  Users,
  GraduationCap,
  LucideProps,
  LayoutDashboardIcon,
  Bot,
  MessageCircle,
  FileIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavProps {
  id: number;
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}

// Student Links
export const studentLinks: NavProps[] = [
  {
    id: 4,
    name: "Home",
    href: "/dashboard/student",
    icon: LayoutDashboardIcon,
  },
  {
    id: 0,
    name: "View Submissions",
    href: "/dashboard/student/submissions",
    icon: FilePlus, // 📝 Submission Icon
  },
  {
    id: 1,
    name: "View Profile",
    href: "/dashboard/student/profile",
    icon: User, // 👤 Profile Icon
  },
  {
    id: 2,
    name: "Reports",
    href: "/dashboard/student/reports",
    icon: FileBarChart, // 📊 Reports Icon
  },
  {
    id: 3,
    name: "ChatBot",
    href: "/dashboard/student/chatbot",
    icon: Bot, // 📊 Reports Icon
  },
  {
    id: 4,
    name: "View MST",
    href: "/dashboard/student/viewmst",
    icon: FileIcon, // 📊 Reports Icon
  },
  {
    id: 5,
    name: "Calculate SGPA",
    href: "/dashboard/student/sgpa",
    icon: FileIcon, // 📊 Reports Icon
  },
];

// Teacher Links
export const teacherLinks: NavProps[] = [
  {
    id: 4,
    name: "Home",
    href: "/dashboard/teacher",
    icon: LayoutDashboardIcon,
  },
  {
    id: 0,
    name: "Upload Assignment",
    href: "/dashboard/teacher/assignments",
    icon: FilePlus, // 📝 Assignment Upload Icon
  },

  {
    id: 1,
    name: "View Students",
    href: "/dashboard/teacher/students",
    icon: Users, // 👥 Students Icon
  },
  {
    id: 2,
    name: "View Profile",
    href: "/dashboard/teacher/profile",
    icon: GraduationCap,
  },
  {
    id: 3,
    name: "ChatBot",
    href: "/dashboard/teacher/chatbot",
    icon: Bot, // 📊 Reports Icon
  },
  {
    id: 4,
    name: "SendEmail",
    href: "/dashboard/teacher/sendemail",
    icon: MessageCircle, // 📊 Reports Icon
  },
  {
    id: 5,
    name: "Generate certificate",
    href: "/dashboard/teacher/addcertificate",
    icon: MessageCircle, // 📊 Reports Icon
  },
];

interface DashboardLinksProps {
  role: "student" | "teacher";
}

export const DashboardLinks = ({ role }: DashboardLinksProps) => {
  const pathname = usePathname();
  const links = role === "student" ? studentLinks : teacherLinks;

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">
        {role === "student" ? "Student Dashboard" : "Teacher Dashboard"}
      </h2>
      {links.map((link) => (
        <Link
          key={link.id}
          href={link.href}
          className={`${cn(
            "text-muted-foreground hover:text-black"
          )} flex items-center gap-3 p-2 rounded-lg transition-all  `}
        >
          <link.icon className="size-4" />
          <p className="text-xl">{link.name}</p>
        </Link>
      ))}
    </div>
  );
};
