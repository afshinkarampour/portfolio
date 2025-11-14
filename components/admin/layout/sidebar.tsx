"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Code,
  Briefcase,
  FolderKanban,
  LogOut,
  Menu,
  X,
  NotebookPen,
  FileText,
  LayoutDashboard,
} from "lucide-react";
import { signOut } from "next-auth/react"; //for logout

const menuItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Skills", href: "/admin/skills", icon: Code },
  { name: "Experience", href: "/admin/experience", icon: Briefcase },
  { name: "Projects", href: "/admin/projects", icon: FolderKanban },
  { name: "Publications", href: "/admin/publications", icon: NotebookPen },
  { name: "Blogs", href: "/admin/blog", icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <aside
        className={`fixed lg:static top-0 left-0 h-screen w-64 bg-white dark:bg-gray-800 shadow-md flex flex-col z-50 transform
            transition-transform duration-300 ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0`}
      >
        {/* Header */}
        <div className="p-4 text-xl font-bold border-b dark:border-gray-700 flex items-center justify-between">
          <p className="md:pl-0">Admin Panel</p>
          <button className="lg:hidden" onClick={() => setIsOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                  pathname === item.href
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        {/* Divider + Logout */}
        <div className="border-t dark:border-gray-700 p-4">
          <button
            onClick={() => signOut({ callbackUrl: "/admin-login" })}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg transition hover:bg-red-100 dark:hover:bg-red-900 text-red-600"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
      {/* Mobile toggle button */}
      <button
        className={`lg:hidden fixed top-4 left-4 z-50 bg-blue-500 text-white p-2 rounded-lg shadow-md ${
          isOpen ? "hidden" : "fixed"
        }`}
        onClick={() => setIsOpen(true)}
      >
        <Menu className="w-6 h-6" />
      </button>
    </div>
  );
}
