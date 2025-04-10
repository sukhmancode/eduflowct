"use client";
import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { BookOpen, Menu, PersonStandingIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashboardLinks } from "@/app/components/DashboardLinks";
import { useRouter } from "next/navigation";
export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // ✅ Determine role based on URL
  const role: "student" | "teacher" = pathname.includes("/teacher")
    ? "teacher"
    : "student";

  return (
    <div className="min-h-screen  w-full grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <div className="hidden md:block border-r bg-muted/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/dashboard" className="flex gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 self-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 mt-2">
                EduFlow
              </span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 lg:px-4">
              <DashboardLinks role={role} /> {/* ✅ Pass detected role */}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col">
        <header className="flex  h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          {/* Mobile Sidebar Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                className="md:hidden shrink-0"
                size="icon"
                variant="outline"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 mt-10">
                <DashboardLinks role={role} />
              </nav>
            </SheetContent>
          </Sheet>

          <div className="ml-auto flex items-center gap-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="rounded-full">
                  <PersonStandingIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
 
                <DropdownMenuItem
                  onClick={() => {
                    "use client";
                    sessionStorage.removeItem("teacherId");
                    sessionStorage.removeItem("studentId");
                    sessionStorage.removeItem("collegeId")
                    window.location.href="/"
                  }}
                >
                  Logout {/* Add logout functionality here */}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex flex-col flex-1 gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
