import Link from "next/link";
import { Users, Clock, Building2, CalendarDays, CheckSquare, History, Activity, ShieldCheck, ArrowRight, AlertTriangle, Gift, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default function AdminDashboardView({
  employeeCount,
  userCount,
  departmentCount,
  presentCount,
  lateCount,
  pendingLeaves,
  activeTasksCount,
  overdueTasksCount,
  recentAuditLogs,
  upcomingHolidays,
}: {
  employeeCount: number;
  userCount: number;
  departmentCount: number;
  presentCount: number;
  lateCount: number;
  pendingLeaves: any[];
  activeTasksCount: number;
  overdueTasksCount: number;
  recentAuditLogs: any[];
  upcomingHolidays: any[];
}) {
  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-indigo-500/20 bg-slate-900/80">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-slate-400 flex items-center justify-between">
              <span>Today's Attendance</span>
              <Clock className="h-4 w-4 text-emerald-400" />
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-slate-100">{presentCount} Present</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[11px] text-amber-400 flex items-center gap-1 font-mono">
              <AlertTriangle className="h-3 w-3" /> {lateCount} Late Arrivals
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-500/20 bg-slate-900/80">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-slate-400 flex items-center justify-between">
              <span>Pending Approvals</span>
              <CalendarDays className="h-4 w-4 text-amber-400" />
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-amber-300">{pendingLeaves.length} Leaves</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/leaves" className="text-[11px] text-amber-400 hover:underline flex items-center gap-1">
              <span>Review Approvals</span> <ArrowRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        <Card className="border-indigo-500/20 bg-slate-900/80">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-slate-400 flex items-center justify-between">
              <span>Active Tasks</span>
              <CheckSquare className="h-4 w-4 text-indigo-400" />
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-indigo-300">{activeTasksCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[11px] text-rose-400 font-mono">
              {overdueTasksCount} Overdue Tasks
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/20 bg-slate-900/80">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs text-slate-400 flex items-center justify-between">
              <span>Total Roster</span>
              <Users className="h-4 w-4 text-emerald-400" />
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-400">{employeeCount} Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-[11px] text-slate-500 font-mono">
              {departmentCount} Active Depts
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Leaves & Audit Logs */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-amber-400" />
                  Pending Leave Approvals Inbox
                </span>
                <Link href="/leaves" className="text-xs text-amber-400 hover:underline">Manage All</Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingLeaves.length > 0 ? (
                <div className="space-y-2 text-xs">
                  {pendingLeaves.slice(0, 3).map((l) => (
                    <div key={l.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-100">{l.employee.firstName} {l.employee.lastName}</div>
                        <div className="text-[10px] text-slate-400">{l.leaveType.name} ({l.totalDays} day(s))</div>
                      </div>
                      <Badge variant="warning" className="text-[10px]">PENDING</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500 text-xs">No pending leave requests requiring approval.</div>
              )}
            </CardContent>
          </Card>

          {/* Audit Trail Widget */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <History className="h-4 w-4 text-indigo-400" />
                  Live System Audit Trail
                </span>
                <Link href="/audit-logs" className="text-xs text-indigo-400 hover:underline">View Logs</Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs">
                {recentAuditLogs.map((log) => (
                  <div key={log.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-mono text-indigo-300 text-[11px]">{log.action}</div>
                      <div className="text-slate-400 text-[10px] truncate max-w-md">{log.details || "-"}</div>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">{new Date(log.createdAt).toLocaleTimeString("en-US")}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar Widgets */}
        <div className="space-y-6">
          {/* Upcoming Holidays */}
          <Card className="border-emerald-500/20 bg-slate-900/90">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-emerald-400" />
                  Upcoming Holidays
                </span>
                <Link href="/holidays" className="text-xs text-emerald-400 hover:underline">View All</Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {upcomingHolidays.map((h) => (
                <div key={h.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-100">{h.name}</div>
                    <div className="text-[10px] text-slate-400">{h.dayOfWeek || "Holiday"}</div>
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px] border-emerald-500/40 text-emerald-400">
                    {formatDate(h.date)}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
