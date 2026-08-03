import Link from "next/link";
import { Clock, CalendarDays, CheckSquare, Palmtree, ArrowRight, CheckCircle2, AlertCircle, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default function EmployeeDashboardView({
  employee,
  todayAttendance,
  userBalances,
  myTasks,
  upcomingHolidays,
}: {
  employee: any;
  todayAttendance: any;
  userBalances: any[];
  myTasks: any[];
  upcomingHolidays: any[];
}) {
  const isCheckedIn = Boolean(todayAttendance && todayAttendance.checkIn);
  const isCheckedOut = Boolean(todayAttendance && todayAttendance.checkOut);

  return (
    <div className="space-y-6">
      {/* Top Kiosk Card */}
      <Card className="border-emerald-500/20 bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-950 shadow-xl">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <span>Welcome, {employee.firstName} {employee.lastName}</span>
                <Badge variant="outline" className="font-mono text-xs">{employee.employeeCode}</Badge>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Daily LAN Attendance & Time Off Portal
              </CardDescription>
            </div>
            <Link href="/attendance">
              <Button className="bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 text-xs">
                <Clock className="h-4 w-4" /> Open Attendance Kiosk
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 text-[10px]">Today's Status</span>
              <div className="mt-0.5">
                <Badge variant={isCheckedOut ? "secondary" : isCheckedIn ? "success" : "outline"} className="text-[10px]">
                  {isCheckedOut ? "Checked Out" : isCheckedIn ? "Checked In" : "Not Checked In"}
                </Badge>
              </div>
            </div>
            <div>
              <span className="text-slate-500 text-[10px]">Check-In Time</span>
              <div className="font-mono font-bold text-emerald-400 mt-0.5">
                {todayAttendance?.checkIn ? new Date(todayAttendance.checkIn).toLocaleTimeString("en-US") : "-"}
              </div>
            </div>
            <div>
              <span className="text-slate-500 text-[10px]">Working Duration</span>
              <div className="font-mono font-bold text-indigo-300 mt-0.5">
                {todayAttendance?.totalMinutes ? `${Math.floor(todayAttendance.totalMinutes / 60)}h ${todayAttendance.totalMinutes % 60}m` : "-"}
              </div>
            </div>
            <div>
              <span className="text-slate-500 text-[10px]">Workstation IP</span>
              <div className="font-mono text-slate-400 mt-0.5">{todayAttendance?.ipAddress || "LAN 192.168.1.x"}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leave Balances Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {userBalances.map((b) => (
          <Card key={b.id} className="border-amber-500/20 bg-slate-900/80">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-bold text-slate-100">{b.leaveType.name}</CardTitle>
                <Badge variant={b.leaveType.isPaid ? "success" : "secondary"} className="text-[9px]">
                  {b.leaveType.isPaid ? "PAID" : "UNPAID"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-amber-400">{b.remainingDays}</span>
                <span className="text-[11px] text-slate-400">Days Left</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Employee Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Active Tasks */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-indigo-400" />
                My Assigned Tasks ({myTasks.length})
              </span>
              <Link href="/tasks" className="text-xs text-indigo-400 hover:underline">View All Tasks</Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {myTasks.length > 0 ? (
              <div className="space-y-2 text-xs">
                {myTasks.map((t) => (
                  <div key={t.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-100">{t.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Due: {t.dueDate ? formatDate(t.dueDate) : "No Due Date"}</div>
                    </div>
                    <Badge variant="outline" className="text-[10px]">{t.status}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 text-xs">No active tasks assigned to you.</div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Holidays */}
        <Card className="border-emerald-500/20 bg-slate-900/90">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Palmtree className="h-4 w-4 text-emerald-400" />
                Upcoming Office Holidays
              </span>
              <Link href="/holidays" className="text-xs text-emerald-400 hover:underline">Full Calendar</Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            {upcomingHolidays.map((h) => (
              <div key={h.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-100">{h.name}</div>
                  <div className="text-[10px] text-slate-400">{h.dayOfWeek || "Official Holiday"}</div>
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
  );
}
