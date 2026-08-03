import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  Network, 
  History, 
  Settings, 
  Activity,
  Wifi,
  Clock,
  KeyRound,
  LogOut,
  CalendarDays,
  Palmtree,
  CheckSquare,
  FileBarChart,
  Megaphone,
  FileText,
  Database
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "AIVOLV LAN Office System",
  description: "AIVOLV offline local network office & employee management portal",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();
  const isSuperAdmin = currentUser?.role?.code === "SUPER_ADMIN";

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col antialiased">
        <div className="flex flex-1 min-h-screen">
          {/* LAN Office Navigation Sidebar */}
          <aside className="w-64 border-r border-slate-800/80 bg-slate-950/80 p-4 flex flex-col justify-between hidden md:flex backdrop-blur-md">
            <div className="space-y-6">
              {/* Brand Header with Official AIVOLV White Background Badge */}
              <div className="flex items-center space-x-3 px-2">
                <div className="h-10 w-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-md overflow-hidden">
                  <img src="/logo.jpg" alt="AIVOLV Logo" className="h-8 w-auto object-contain" />
                </div>
                <div>
                  <h1 className="font-black text-slate-100 text-base leading-tight tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-300">
                    AIVOLV
                  </h1>
                  <p className="text-[10px] text-slate-400 font-mono">LAN Hub v1.0</p>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1 text-sm font-medium">
                <Link
                  href="/"
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-pink-400 transition-colors"
                >
                  <Activity className="h-4 w-4 text-pink-400" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  href="/users"
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-indigo-400 transition-colors"
                >
                  <Users className="h-4 w-4" />
                  <span>Users & Employees</span>
                </Link>

                <Link
                  href="/attendance"
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-indigo-400 transition-colors"
                >
                  <Clock className="h-4 w-4 text-emerald-400" />
                  <span>Attendance Kiosk</span>
                </Link>

                <Link
                  href="/leaves"
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-indigo-400 transition-colors"
                >
                  <CalendarDays className="h-4 w-4 text-amber-400" />
                  <span>Leave Management</span>
                </Link>

                <Link
                  href="/tasks"
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-indigo-400 transition-colors"
                >
                  <CheckSquare className="h-4 w-4 text-indigo-400" />
                  <span>Task Tracking</span>
                </Link>

                <Link
                  href="/announcements"
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-indigo-400 transition-colors"
                >
                  <Megaphone className="h-4 w-4 text-amber-400" />
                  <span>Announcements</span>
                </Link>

                <Link
                  href="/documents"
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-indigo-400 transition-colors"
                >
                  <FileText className="h-4 w-4 text-indigo-400" />
                  <span>Employee Documents</span>
                </Link>

                <Link
                  href="/reports"
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-indigo-400 transition-colors"
                >
                  <FileBarChart className="h-4 w-4 text-cyan-400" />
                  <span>Reports Center</span>
                </Link>

                <Link
                  href="/holidays"
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-indigo-400 transition-colors"
                >
                  <Palmtree className="h-4 w-4 text-emerald-400" />
                  <span>Holiday Calendar</span>
                </Link>

                <Link
                  href="/departments"
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-indigo-400 transition-colors"
                >
                  <Building2 className="h-4 w-4" />
                  <span>Departments & Roles</span>
                </Link>

                {isSuperAdmin && (
                  <Link
                    href="/settings/backups"
                    className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-indigo-400 transition-colors"
                  >
                    <Database className="h-4 w-4 text-indigo-400" />
                    <span>System Backups</span>
                  </Link>
                )}

                <Link
                  href="/network"
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-indigo-400 transition-colors"
                >
                  <Network className="h-4 w-4" />
                  <span>Authorized Devices & IPs</span>
                </Link>

                <Link
                  href="/audit-logs"
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-indigo-400 transition-colors"
                >
                  <History className="h-4 w-4" />
                  <span>Audit Logs</span>
                </Link>

                <Link
                  href="/settings"
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-indigo-400 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <span>System Settings</span>
                </Link>
              </nav>
            </div>

            {/* LAN Network Status Badge */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/30 p-3 flex items-center space-x-3">
              <div className="relative">
                <Wifi className="h-5 w-5 text-emerald-400" />
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <div className="text-xs">
                <div className="font-semibold text-emerald-300">LAN Status: Active</div>
                <div className="text-emerald-500/80 font-mono text-[10px]">192.168.1.0/24</div>
              </div>
            </div>
          </aside>

          {/* Main Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <header className="h-16 border-b border-slate-800/80 bg-slate-950/40 px-6 flex items-center justify-between backdrop-blur-md">
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <ShieldCheck className="h-4 w-4 text-purple-400" />
                <span>AIVOLV LAN Secured Connection • Local Database Active</span>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/change-password"
                  className="text-xs text-slate-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  <span>Password</span>
                </Link>

                <div className="text-right text-xs">
                  <div className="font-medium text-slate-200">
                    {currentUser?.employee ? `${currentUser.employee.firstName} ${currentUser.employee.lastName}` : (currentUser?.email || "Guest")}
                  </div>
                  <div className="text-purple-400 text-[11px] font-mono">{currentUser?.role?.name || "LAN Session"}</div>
                </div>

                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-pink-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                  {currentUser?.role?.code === "SUPER_ADMIN" ? "SA" : "US"}
                </div>

                <form action="/api/auth/logout" method="POST">
                  <button
                    type="submit"
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 p-6 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
