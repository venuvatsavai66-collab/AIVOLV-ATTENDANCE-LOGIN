"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Plus, CheckCircle2, AlertCircle, Clock, Check, X, ShieldCheck, HeartPulse, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

export default function LeavesClient({
  leaveTypes,
  userBalances,
  myRequests,
  allRequests,
  isAdmin,
}: {
  leaveTypes: any[];
  userBalances: any[];
  myRequests: any[];
  allRequests: any[];
  isAdmin: boolean;
}) {
  const router = useRouter();

  // Apply Modal State
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedLeaveTypeId, setSelectedLeaveTypeId] = useState<string>(leaveTypes[0]?.id || "");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [halfDaySession, setHalfDaySession] = useState("FIRST_HALF");
  const [reason, setReason] = useState("");
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalSuccess, setModalSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Admin Action Modal
  const [rejectingRequest, setRejectingRequest] = useState<any | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  // Apply Leave Handler
  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setModalSuccess(null);

    if (!selectedLeaveTypeId || !fromDate || !toDate || !reason) {
      setModalError("Please complete all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/leaves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leaveTypeId: selectedLeaveTypeId,
          fromDate,
          toDate,
          isHalfDay,
          halfDaySession,
          reason,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setModalError(data.error || "Failed to submit leave request.");
        setIsSubmitting(false);
        return;
      }

      setModalSuccess("Leave request submitted successfully!");
      setTimeout(() => {
        setShowApplyModal(false);
        setReason("");
        router.refresh();
      }, 1200);
    } catch (err: any) {
      setModalError("Network error submitting leave request.");
      setIsSubmitting(false);
    }
  };

  // Admin Approve Handler
  const handleApprove = async (requestId: string) => {
    setActionError(null);
    try {
      const res = await fetch(`/api/leaves/${requestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "APPROVE" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || "Failed to approve request");
        return;
      }
      router.refresh();
    } catch (err) {
      setActionError("Error approving request.");
    }
  };

  // Admin Reject Handler
  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    if (!rejectingRequest) return;

    try {
      const res = await fetch(`/api/leaves/${rejectingRequest.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "REJECT",
          rejectionReason: rejectionReasonInput,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setActionError(data.error || "Failed to reject request");
        return;
      }

      setRejectingRequest(null);
      setRejectionReasonInput("");
      router.refresh();
    } catch (err) {
      setActionError("Error rejecting request.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-amber-400" />
            Leave & Time Off Management
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Paid Sick Leave, Paid Casual Leave, annual quotas, and approval workflows.
          </p>
        </div>

        <Button
          onClick={() => setShowApplyModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Apply for Leave
        </Button>
      </div>

      {/* Leave Balances Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {userBalances.length > 0 ? (
          userBalances.map((b) => (
            <Card key={b.id} className="border-amber-500/20 bg-slate-900/80">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold text-slate-100">{b.leaveType.name}</CardTitle>
                  <Badge variant={b.leaveType.isPaid ? "success" : "secondary"} className="text-[10px]">
                    {b.leaveType.isPaid ? "PAID" : "UNPAID"}
                  </Badge>
                </div>
                <CardDescription className="text-xs text-slate-400">Quota: {b.allocatedDays} Days / Year</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-amber-400">{b.remainingDays}</span>
                  <span className="text-xs text-slate-400">Days Remaining</span>
                </div>
                <div className="text-[11px] text-slate-500 flex justify-between border-t border-slate-800 pt-1.5">
                  <span>Used: <strong className="text-slate-300">{b.usedDays}</strong></span>
                  <span>Total: <strong className="text-slate-300">{b.allocatedDays}</strong></span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          leaveTypes.map((lt) => (
            <Card key={lt.id} className="border-slate-800 bg-slate-900/80">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold text-slate-100">{lt.name}</CardTitle>
                  <Badge variant={lt.isPaid ? "success" : "secondary"} className="text-[10px]">
                    {lt.isPaid ? "PAID" : "UNPAID"}
                  </Badge>
                </div>
                <CardDescription className="text-xs text-slate-400">Quota: {lt.annualQuota} Days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-slate-300">{lt.annualQuota} Days</div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Admin Approval Inbox */}
      {isAdmin && allRequests.length > 0 && (
        <Card className="border-indigo-500/30 bg-slate-900/90 shadow-xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-indigo-400" />
                Admin Leave Requests Inbox ({allRequests.filter(r => r.status === "PENDING").length} Pending)
              </span>
              <Badge variant="outline">Manager & HR Clearance</Badge>
            </CardTitle>
            <CardDescription>Approve or reject employee leave submissions</CardDescription>
          </CardHeader>
          <CardContent>
            {actionError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-950/60 border border-rose-600/50 text-rose-200 text-xs flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>
                      <div className="font-semibold text-slate-100">{req.employee.firstName} {req.employee.lastName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{req.employee.department?.name || "-"}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={req.leaveType.isPaid ? "success" : "secondary"} className="text-[10px]">
                        {req.leaveType.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-slate-300">
                      {formatDate(req.fromDate)} → {formatDate(req.toDate)}
                    </TableCell>
                    <TableCell className="text-xs font-bold text-amber-300">{req.totalDays} Day(s)</TableCell>
                    <TableCell className="text-xs text-slate-400 max-w-xs truncate">{req.reason}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          req.status === "APPROVED"
                            ? "success"
                            : req.status === "PENDING"
                            ? "warning"
                            : "destructive"
                        }
                        className="text-[10px]"
                      >
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      {req.status === "PENDING" ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(req.id)}
                            className="h-7 px-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs"
                          >
                            <Check className="h-3.5 w-3.5 mr-1" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setRejectingRequest(req)}
                            className="h-7 px-2 text-xs"
                          >
                            <X className="h-3.5 w-3.5 mr-1" /> Reject
                          </Button>
                        </>
                      ) : (
                        <span className="text-[11px] text-slate-500 font-mono">Processed</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Employee My Requests List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>My Leave Submissions ({myRequests.length})</span>
            <Badge variant="outline">Employee History</Badge>
          </CardTitle>
          <CardDescription>Track status of your submitted time off requests.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Leave Type</TableHead>
                <TableHead>From Date</TableHead>
                <TableHead>To Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Rejection Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myRequests.length > 0 ? (
                myRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>
                      <Badge variant={req.leaveType.isPaid ? "success" : "secondary"} className="text-[10px]">
                        {req.leaveType.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-slate-300">{formatDate(req.fromDate)}</TableCell>
                    <TableCell className="text-xs font-mono text-slate-300">{formatDate(req.toDate)}</TableCell>
                    <TableCell className="text-xs font-bold text-amber-300">
                      {req.totalDays} Day(s) {req.isHalfDay && "(Half Day)"}
                    </TableCell>
                    <TableCell className="text-xs text-slate-400 max-w-xs truncate">{req.reason}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          req.status === "APPROVED"
                            ? "success"
                            : req.status === "PENDING"
                            ? "warning"
                            : "destructive"
                        }
                        className="text-[10px]"
                      >
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[11px] text-rose-300">{req.rejectionReason || "-"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-slate-500 text-xs">
                    No leave requests submitted yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md border-amber-500/30 bg-slate-900 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-amber-400" />
                  Apply for Leave
                </CardTitle>
                <CardDescription className="text-xs">Submit time off request for approval</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowApplyModal(false)} className="h-7 w-7">
                <X className="h-4 w-4 text-slate-400" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleApplyLeave} className="space-y-4 text-xs">
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
                  <label className="font-medium text-slate-300">Leave Type</label>
                  <select
                    value={selectedLeaveTypeId}
                    onChange={(e) => setSelectedLeaveTypeId(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-1 text-xs text-slate-100"
                  >
                    {leaveTypes.map((lt) => (
                      <option key={lt.id} value={lt.id}>
                        {lt.name} ({lt.isPaid ? "PAID" : "UNPAID"} - Quota: {lt.annualQuota}d)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-medium text-slate-300">From Date *</label>
                    <Input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-medium text-slate-300">To Date *</label>
                    <Input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="halfDay"
                    checked={isHalfDay}
                    onChange={(e) => setIsHalfDay(e.target.checked)}
                    className="rounded border-slate-800 bg-slate-950"
                  />
                  <label htmlFor="halfDay" className="text-slate-300 font-medium">Half-day Option</label>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Reason *</label>
                  <textarea
                    rows={3}
                    placeholder="Provide reason for leave..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    className="flex w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-amber-600 hover:bg-amber-500 text-white font-medium h-9"
                >
                  {isSubmitting ? "Submitting..." : "Submit Leave Request"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Admin Rejection Modal */}
      {rejectingRequest && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md border-rose-500/30 bg-slate-900 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base text-rose-400">Reject Leave Request</CardTitle>
                <CardDescription className="text-xs">
                  {rejectingRequest.employee.firstName} {rejectingRequest.employee.lastName} ({rejectingRequest.leaveType.name})
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setRejectingRequest(null)} className="h-7 w-7">
                <X className="h-4 w-4 text-slate-400" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRejectSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Rejection Reason / Comments</label>
                  <textarea
                    rows={3}
                    placeholder="Provide reason for rejecting request..."
                    value={rejectionReasonInput}
                    onChange={(e) => setRejectionReasonInput(e.target.value)}
                    required
                    className="flex w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="button" variant="outline" onClick={() => setRejectingRequest(null)} className="flex-1 h-9">
                    Cancel
                  </Button>
                  <Button type="submit" variant="destructive" className="flex-1 h-9">
                    Confirm Rejection
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
