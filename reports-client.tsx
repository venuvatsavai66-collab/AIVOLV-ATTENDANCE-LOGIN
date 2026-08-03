"use client";

import { useState, useEffect } from "react";
import { FileBarChart, Download, Printer, Filter, RefreshCw, Calendar, Users, Clock, AlertTriangle, CheckSquare, History, Palmtree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const REPORT_TYPES = [
  { id: "DAILY_ATTENDANCE", label: "Daily Attendance Report", icon: Clock },
  { id: "MONTHLY_ATTENDANCE", label: "Monthly Attendance Summary", icon: Calendar },
  { id: "LEAVE_REPORT", label: "Leave Requests & Balances", icon: Palmtree },
  { id: "LATE_ARRIVALS", label: "Late Arrivals & Overtime", icon: AlertTriangle },
  { id: "EMPLOYEE_DIRECTORY", label: "Employee Roster Report", icon: Users },
  { id: "TASK_COMPLETION", label: "Task Completion Report", icon: CheckSquare },
  { id: "AUDIT_LOGS", label: "System Audit Logs Trail", icon: History },
];

export default function ReportsClient({ departments }: { departments: any[] }) {
  const [reportType, setReportType] = useState("DAILY_ATTENDANCE");
  const [dateFilter, setDateFilter] = useState<string>(new Date().toISOString().split("T")[0]);
  const [monthFilter, setMonthFilter] = useState<string>(new Date().toISOString().slice(0, 7));
  const [deptFilter, setDeptFilter] = useState<string>("ALL");

  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Report Data
  const fetchReport = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("type", reportType);
      if (dateFilter) params.append("date", dateFilter);
      if (monthFilter) params.append("month", monthFilter);
      if (deptFilter !== "ALL") params.append("departmentId", deptFilter);

      const res = await fetch(`/api/reports?${params.toString()}`);
      const result = await res.json();
      if (res.ok && result.data) {
        setData(result.data);
      }
    } catch (err) {
      console.error("Fetch report error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reportType, dateFilter, monthFilter, deptFilter]);

  // CSV Exporter Utility
  const handleExportCSV = () => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((field) => {
            const val = row[field] === null || row[field] === undefined ? "" : String(row[field]);
            return `"${val.replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${reportType.toLowerCase()}_report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Report Handler
  const handlePrint = () => {
    window.print();
  };

  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="print:hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <FileBarChart className="h-6 w-6 text-cyan-400" />
            Executive Reports Center
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Generate, filter, print, and export attendance, leave, task, and audit log reports.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={handleExportCSV}
            disabled={data.length === 0}
            className="bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 text-xs h-9"
          >
            <Download className="h-4 w-4" /> Export CSV
          </Button>

          <Button
            onClick={handlePrint}
            disabled={data.length === 0}
            variant="outline"
            className="flex items-center gap-2 text-xs h-9"
          >
            <Printer className="h-4 w-4" /> Print Report
          </Button>
        </div>
      </div>

      {/* Report Selector Cards Bar */}
      <div className="print:hidden grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-xs">
        {REPORT_TYPES.map((rt) => {
          const Icon = rt.icon;
          const isSelected = reportType === rt.id;
          return (
            <button
              key={rt.id}
              onClick={() => setReportType(rt.id)}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                isSelected
                  ? "bg-indigo-600/20 border-indigo-500 text-white shadow-lg"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <Icon className={`h-4 w-4 mb-2 ${isSelected ? "text-indigo-400" : "text-slate-500"}`} />
              <span className="font-semibold text-[11px] leading-tight">{rt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter Bar */}
      <Card className="print:hidden">
        <CardContent className="py-3">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            {reportType === "DAILY_ATTENDANCE" && (
              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Select Date</label>
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-slate-100"
                />
              </div>
            )}

            {reportType === "MONTHLY_ATTENDANCE" && (
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

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Department Filter</label>
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

            <div className="flex items-end">
              <Button
                onClick={fetchReport}
                disabled={isLoading}
                variant="outline"
                className="w-full h-9 flex items-center justify-center gap-1 text-xs"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
                <span>Update Report</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Printable Report Display Container */}
      <Card className="print:border-none print:shadow-none print:bg-white print:text-black">
        <CardHeader className="border-b border-slate-800 print:border-black/20 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-slate-100 print:text-black flex items-center gap-2">
                <span>LAN Office Management • {REPORT_TYPES.find((r) => r.id === reportType)?.label}</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 print:text-black/60">
                Official Report • Generated on {new Date().toLocaleString("en-US")}
              </CardDescription>
            </div>
            <Badge variant="outline" className="print:border-black font-mono text-xs">
              {data.length} Records
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <Table className="print:text-black">
            <TableHeader>
              <TableRow className="print:border-black">
                {columns.map((col) => (
                  <TableHead key={col} className="print:text-black font-bold text-xs uppercase">
                    {col}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((row, idx) => (
                  <TableRow key={idx} className="print:border-black/20">
                    {columns.map((col) => (
                      <TableCell key={col} className="text-xs print:text-black">
                        {String(row[col] ?? "-")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={Math.max(1, columns.length)} className="text-center py-8 text-slate-500 text-sm">
                    No report records found for selected criteria.
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
