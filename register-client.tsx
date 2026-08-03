"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Filter, Edit, CheckCircle2, AlertCircle, Search, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";

export default function RegisterClient({
  departments,
  employees,
  isAdmin,
}: {
  departments: any[];
  employees: any[];
  isAdmin: boolean;
}) {
  const router = useRouter();

  // Filter States
  const [viewMode, setViewMode] = useState<"DAILY" | "MONTHLY">("DAILY");
  const [dateFilter, setDateFilter] = useState<string>(new Date().toISOString().split("T")[0]);
  const [monthFilter, setMonthFilter] = useState<string>(new Date().toISOString().slice(0, 7));
  const [deptFilter, setDeptFilter] = useState<string>("ALL");
  const [empFilter, setEmpFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Correction Modal State
  const [editingRecord, setEditingRecord] = useState<any | null>(null);
  const [editCheckIn, setEditCheckIn] = useState<string>("");
  const [editCheckOut, setEditCheckOut] = useState<string>("");
  const [editStatus, setEditStatus] = useState<string>("PRESENT");
  const [mandatoryReason, setMandatoryReason] = useState<string>("");
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalSuccess, setModalSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch register records
  const fetchRegister = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (viewMode === "DAILY" && dateFilter) params.append("date", dateFilter);
      if (viewMode === "MONTHLY" && monthFilter) params.append("month", monthFilter);
      if (deptFilter !== "ALL") params.append("departmentId", deptFilter);
      if (empFilter !== "ALL") params.append("employeeId", empFilter);
      if (statusFilter !== "ALL") params.append("status", statusFilter);

      const res = await fetch(`/api/attendance/register?${params.toString()}`);
      const data = await res.json();
      if (res.ok && data.data) {
        setRecords(data.data);
      }
    } catch (err) {
      console.error("Fetch register error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRegister();
  }, [viewMode, dateFilter, monthFilter, deptFilter, empFilter, statusFilter]);

  // Open Edit Modal
  const openEditModal = (rec: any) => {
    setEditingRecord(rec);
    setEditCheckIn(rec.checkIn ? new Date(rec.checkIn).toISOString().slice(0, 16) : "");
    setEditCheckOut(rec.checkOut ? new Date(rec.checkOut).toISOString().slice(0, 16) : "");
    setEditStatus(rec.status);
    setMandatoryReason("");
    setModalError(null);
    setModalSuccess(null);
  };

  // Submit Manual Correction
  const handleSaveCorrection = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setModalSuccess(null);

    if (!mandatoryReason || mandatoryReason.trim().length === 0) {
      setModalError("A mandatory reason is required for manual attendance correction.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/attendance/manual-correction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attendanceId: editingRecord.id,
          checkIn: editCheckIn || null,
          checkOut: editCheckOut || null,
          status: editStatus,
          reason: mandatoryReason,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setModalError(data.error || "Manual correction failed.");
        setIsSubmitting(false);
        return;
      }

      setModalSuccess("Attendance corrected & audit log recorded!");
      setTimeout(() => {
        setEditingRecord(null);
        fetchRegister();
      }, 1200);
    } catch (err: any) {
      setModalError("Network error executing correction.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-400" />
                Attendance Register & Corrections
              </CardTitle>
              <CardDescription>Daily & Monthly register views with manual correction audit tracking.</CardDescription>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setViewMode("DAILY")}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  viewMode === "DAILY" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Daily Register
              </button>
              <button
                onClick={() => setViewMode("MONTHLY")}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  viewMode === "MONTHLY" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Monthly Overview
              </button>
            </div>
          </div>
        </CardHeader>

        {/* Filter Bar */}
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2 text-xs">
            {/* Date / Month Picker */}
            {viewMode === "DAILY" ? (
              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Select Date</label>
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-slate-100"
                />
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Select Month</label>
                <Input
                  type="month"
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-slate-100"
                />
              </div>
            )}

            {/* Department Filter */}
            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Department</label>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="flex h-9 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-1 text-xs text-slate-100"
              >
                <option value="ALL">All Departments</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Employee Filter */}
            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Employee</label>
              <select
                value={empFilter}
                onChange={(e) => setEmpFilter(e.target.value)}
                className="flex h-9 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-1 text-xs text-slate-100"
              >
                <option value="ALL">All Employees</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.employeeCode})</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex h-9 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-1 text-xs text-slate-100"
              >
                <option value="ALL">All Statuses</option>
                <option value="PRESENT">PRESENT</option>
                <option value="LATE">LATE</option>
                <option value="HALF_DAY">HALF_DAY</option>
                <option value="ABSENT">ABSENT</option>
              </select>
            </div>

            {/* Refresh Button */}
            <div className="flex items-end">
              <Button
                onClick={fetchRegister}
                disabled={isLoading}
                variant="outline"
                className="w-full h-9 flex items-center justify-center gap-1 text-xs"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Register Data Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>Register Entries ({records.length})</span>
            <Badge variant="outline">{viewMode === "DAILY" ? dateFilter : monthFilter}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Late</TableHead>
                <TableHead>Remarks</TableHead>
                {isAdmin && <TableHead className="text-right">Action</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length > 0 ? (
                records.map((rec) => (
                  <TableRow key={rec.id}>
                    <TableCell>
                      <div className="font-semibold text-slate-100">{rec.employee.firstName} {rec.employee.lastName}</div>
                      <div className="text-[10px] font-mono text-indigo-400">{rec.employee.employeeCode}</div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-300">{rec.employee.department?.name || "-"}</TableCell>
                    <TableCell className="text-xs font-mono text-emerald-400">{formatDateTime(rec.checkIn)}</TableCell>
                    <TableCell className="text-xs font-mono text-slate-300">{rec.checkOut ? formatDateTime(rec.checkOut) : "Active"}</TableCell>
                    <TableCell className="text-xs font-mono text-indigo-300">
                      {rec.totalMinutes ? `${Math.floor(rec.totalMinutes / 60)}h ${rec.totalMinutes % 60}m` : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={rec.status === "PRESENT" ? "success" : "warning"} className="text-[10px]">
                        {rec.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-amber-400">
                      {rec.lateMinutes > 0 ? `${rec.lateMinutes}m` : "On Time"}
                    </TableCell>
                    <TableCell className="text-[11px] text-slate-400 max-w-xs truncate">{rec.remarks || "-"}</TableCell>
                    {isAdmin && (
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(rec)}
                          className="h-7 px-2 text-indigo-300 hover:bg-indigo-950"
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-slate-500 text-sm">
                    No attendance records found matching filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Interactive Manual Correction Modal */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md border-indigo-500/30 bg-slate-900 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Edit className="h-4 w-4 text-indigo-400" />
                  Manual Attendance Correction
                </CardTitle>
                <CardDescription className="text-xs">
                  {editingRecord.employee.firstName} {editingRecord.employee.lastName} ({editingRecord.employee.employeeCode})
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setEditingRecord(null)} className="h-7 w-7">
                <X className="h-4 w-4 text-slate-400" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveCorrection} className="space-y-4 text-xs">
                {modalError && (
                  <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-600/50 text-rose-200 flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{modalError}</span>
                  </div>
                )}

                {modalSuccess && (
                  <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-600/50 text-emerald-200 flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                    <span>{modalSuccess}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Check-In Date & Time</label>
                  <Input
                    type="datetime-local"
                    value={editCheckIn}
                    onChange={(e) => setEditCheckIn(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Check-Out Date & Time</label>
                  <Input
                    type="datetime-local"
                    value={editCheckOut}
                    onChange={(e) => setEditCheckOut(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Status Override</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-1 text-xs text-slate-100"
                  >
                    <option value="PRESENT">PRESENT</option>
                    <option value="LATE">LATE</option>
                    <option value="HALF_DAY">HALF_DAY</option>
                    <option value="ABSENT">ABSENT</option>
                  </select>
                </div>

                {/* MANDATORY REASON FIELD */}
                <div className="space-y-1">
                  <label className="font-bold text-amber-300">Mandatory Correction Reason *</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Employee card scanner malfunction / Offsite assignment approval"
                    value={mandatoryReason}
                    onChange={(e) => setMandatoryReason(e.target.value)}
                    required
                    className="flex w-full rounded-md border border-amber-500/40 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingRecord(null)}
                    className="flex-1 h-9"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white h-9"
                  >
                    {isSubmitting ? "Saving & Logging..." : "Save & Audit Log"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
