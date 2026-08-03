"use client";

import { useState, useEffect } from "react";
import { Clock, CheckCircle2, LogIn, LogOut, ShieldCheck, AlertCircle, Laptop, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";

export default function AttendanceKioskClient({
  employee,
  initialTodayAttendance,
  setting,
  pastAttendances,
}: {
  employee: any;
  initialTodayAttendance: any;
  setting: any;
  pastAttendances: any[];
}) {
  const [time, setTime] = useState<string>("");
  const [dateStr, setDateStr] = useState<string>("");
  const [todayAttendance, setTodayAttendance] = useState<any>(initialTodayAttendance);
  const [history, setHistory] = useState<any[]>(pastAttendances);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Digital clock effect
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setDateStr(now.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle Check In / Check Out
  const handleAttendanceAction = async (action: "CHECK_IN" | "CHECK_OUT") => {
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          deviceId: "LAN-Workstation-01",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Attendance action failed.");
        setIsLoading(false);
        return;
      }

      setTodayAttendance(data.data);
      setSuccess(
        action === "CHECK_IN"
          ? "Successfully checked in for today!"
          : "Successfully checked out for today!"
      );

      // Refresh data
      const refRes = await fetch("/api/attendance");
      const refData = await refRes.json();
      if (refRes.ok && refData.data) {
        setTodayAttendance(refData.data.todayAttendance);
        setHistory(refData.data.pastAttendances);
      }
    } catch (err: any) {
      setError("Network connection issue. Ensure you are connected to the LAN.");
    } finally {
      setIsLoading(false);
    }
  };

  const isCheckedIn = Boolean(todayAttendance && todayAttendance.checkIn);
  const isCheckedOut = Boolean(todayAttendance && todayAttendance.checkOut);

  return (
    <div className="space-y-6">
      {/* Top Banner & Live Clock */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Live Clock Card */}
        <Card className="md:col-span-1 border-emerald-500/20 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono uppercase tracking-wider text-emerald-400 flex items-center justify-between">
              <span>Live LAN Clock</span>
              <Clock className="h-4 w-4" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-3xl font-bold font-mono text-slate-100 tracking-tight">{time || "00:00:00 AM"}</div>
            <div className="text-xs text-slate-400 font-medium">{dateStr || "Loading..."}</div>
            <div className="pt-2 flex items-center space-x-2 text-[11px] text-slate-400">
              <Wifi className="h-3.5 w-3.5 text-emerald-400" />
              <span>Shift Rule: <span className="font-mono text-slate-200">{setting?.officeStartTime || "09:00"} - {setting?.officeEndTime || "17:00"}</span></span>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Action Kiosk Card */}
        <Card className="md:col-span-2 border-indigo-500/20 bg-slate-900/90 shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <span>{employee.firstName} {employee.lastName}</span>
                  <Badge variant="outline" className="font-mono text-xs">{employee.employeeCode}</Badge>
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Daily Check-In & Check-Out Kiosk
                </CardDescription>
              </div>
              <Badge
                variant={
                  isCheckedOut
                    ? "secondary"
                    : isCheckedIn
                    ? "success"
                    : "outline"
                }
                className="text-xs"
              >
                {isCheckedOut ? "Checked Out" : isCheckedIn ? "Checked In (Active)" : "Not Checked In"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-600/50 text-rose-200 text-xs flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-600/50 text-emerald-200 text-xs flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Status Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 text-[10px]">Check-In Time</span>
                <div className="font-mono font-bold text-emerald-400 mt-0.5">
                  {todayAttendance?.checkIn ? formatDateTime(todayAttendance.checkIn) : "-"}
                </div>
              </div>
              <div>
                <span className="text-slate-500 text-[10px]">Check-Out Time</span>
                <div className="font-mono font-bold text-slate-300 mt-0.5">
                  {todayAttendance?.checkOut ? formatDateTime(todayAttendance.checkOut) : "-"}
                </div>
              </div>
              <div>
                <span className="text-slate-500 text-[10px]">Working Time</span>
                <div className="font-mono font-bold text-indigo-300 mt-0.5">
                  {todayAttendance?.totalMinutes ? `${Math.floor(todayAttendance.totalMinutes / 60)}h ${todayAttendance.totalMinutes % 60}m` : "-"}
                </div>
              </div>
              <div>
                <span className="text-slate-500 text-[10px]">Shift Status</span>
                <div className="mt-0.5">
                  {todayAttendance ? (
                    <Badge variant={todayAttendance.status === "PRESENT" ? "success" : "warning"} className="text-[10px]">
                      {todayAttendance.status}
                    </Badge>
                  ) : (
                    <span className="text-slate-600 font-mono">-</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={() => handleAttendanceAction("CHECK_IN")}
                disabled={isLoading || isCheckedIn}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center justify-center gap-2 h-11"
              >
                <LogIn className="h-4 w-4" />
                {isCheckedIn ? "Checked In for Today" : "Check In Now"}
              </Button>

              <Button
                onClick={() => handleAttendanceAction("CHECK_OUT")}
                disabled={isLoading || !isCheckedIn || isCheckedOut}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center justify-center gap-2 h-11"
              >
                <LogOut className="h-4 w-4" />
                {isCheckedOut ? "Checked Out for Today" : "Check Out Now"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History Log */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>Recent Attendance Log</span>
            <Badge variant="outline">Past 10 Days</Badge>
          </CardTitle>
          <CardDescription>Verified local IP & device check-ins recorded in `attendances` table.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Late (Mins)</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.length > 0 ? (
                history.map((att) => (
                  <TableRow key={att.id}>
                    <TableCell className="font-mono text-xs text-slate-200">
                      {new Date(att.checkIn).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </TableCell>
                    <TableCell className="text-xs font-mono text-emerald-400">{formatDateTime(att.checkIn)}</TableCell>
                    <TableCell className="text-xs font-mono text-slate-300">
                      {att.checkOut ? formatDateTime(att.checkOut) : "Active Shift"}
                    </TableCell>
                    <TableCell className="text-xs font-mono text-indigo-300">
                      {att.totalMinutes ? `${Math.floor(att.totalMinutes / 60)}h ${att.totalMinutes % 60}m` : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={att.status === "PRESENT" ? "success" : "warning"} className="text-[10px]">
                        {att.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-amber-400">
                      {att.lateMinutes > 0 ? `${att.lateMinutes}m` : "On Time"}
                    </TableCell>
                    <TableCell className="text-xs font-mono text-slate-400">{att.ipAddress || "127.0.0.1"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-slate-500 text-xs">
                    No past attendance records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
