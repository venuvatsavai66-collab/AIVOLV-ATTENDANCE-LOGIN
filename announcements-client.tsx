"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Megaphone, Plus, CheckCircle2, AlertCircle, Eye, Check, X, ShieldCheck, Users, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

export default function AnnouncementsClient({
  announcements,
  departments,
  roles,
  isAdmin,
}: {
  announcements: any[];
  departments: any[];
  roles: any[];
  isAdmin: boolean;
}) {
  const router = useRouter();

  // Create Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [targetType, setTargetType] = useState("ALL");
  const [targetId, setTargetId] = useState("");
  const [priority, setPriority] = useState("NORMAL");
  const [createError, setCreateError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Read Roster Report Modal
  const [reportData, setReportData] = useState<any | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  // Submit Create Announcement
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    if (!title || !content) {
      setCreateError("Title and content are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          targetType,
          targetId: targetId || null,
          priority,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.error || "Failed to broadcast announcement.");
        setIsSubmitting(false);
        return;
      }

      setShowCreateModal(false);
      setTitle("");
      setContent("");
      router.refresh();
    } catch (err) {
      setCreateError("Network error broadcasting announcement.");
      setIsSubmitting(false);
    }
  };

  // Mark as Read
  const handleMarkAsRead = async (announcementId: string) => {
    try {
      const res = await fetch(`/api/announcements/${announcementId}/read`, {
        method: "POST",
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error("Mark as read error:", err);
    }
  };

  // Open Read/Unread Roster Report
  const openReport = async (announcementId: string) => {
    setIsLoadingReport(true);
    try {
      const res = await fetch(`/api/announcements/${announcementId}/report`);
      const data = await res.json();
      if (res.ok && data.data) {
        setReportData(data.data);
      }
    } catch (err) {
      console.error("Fetch announcement report error:", err);
    } finally {
      setIsLoadingReport(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-indigo-400" />
            Company Announcements Hub
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Targeted official broadcasts for all employees, departments, or specific roles.
          </p>
        </div>

        {isAdmin && (
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Broadcast Announcement
          </Button>
        )}
      </div>

      {/* Announcements List Grid */}
      <div className="space-y-4">
        {announcements.length > 0 ? (
          announcements.map((a) => (
            <Card
              key={a.id}
              className={`border-indigo-500/20 transition-all ${
                !a.isRead ? "bg-slate-900 border-l-4 border-l-indigo-500 shadow-lg" : "bg-slate-950/60"
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-bold text-slate-100">{a.title}</CardTitle>
                    {!a.isRead && (
                      <Badge variant="destructive" className="text-[10px] animate-pulse">UNREAD</Badge>
                    )}
                    <Badge variant={a.priority === "URGENT" ? "destructive" : "warning"} className="text-[10px]">
                      {a.priority}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <Badge variant="outline" className="text-[10px] font-mono">
                      Target: {a.targetType}
                    </Badge>

                    {!a.isRead && (
                      <Button
                        size="sm"
                        onClick={() => handleMarkAsRead(a.id)}
                        className="h-7 px-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs"
                      >
                        <Check className="h-3.5 w-3.5 mr-1" /> Mark as Read
                      </Button>
                    )}

                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openReport(a.id)}
                        className="h-7 px-2 text-indigo-300 hover:bg-indigo-950 text-xs"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" /> Read Report
                      </Button>
                    )}
                  </div>
                </div>
                <CardDescription className="text-xs text-slate-400">
                  By {a.author?.employee ? `${a.author.employee.firstName} ${a.author.employee.lastName}` : a.author?.email} • {formatDate(a.createdAt)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{a.content}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-10 text-center text-slate-500 text-sm">
              No company announcements broadcasted.
            </CardContent>
          </Card>
        )}
      </div>

      {/* Broadcast Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-lg border-indigo-500/30 bg-slate-900 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Megaphone className="h-4 w-4 text-indigo-400" />
                  Broadcast Company Announcement
                </CardTitle>
                <CardDescription className="text-xs">Publish official notice to LAN users</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowCreateModal(false)} className="h-7 w-7">
                <X className="h-4 w-4 text-slate-400" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4 text-xs">
                {createError && (
                  <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-600/50 text-rose-200 flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{createError}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Announcement Title *</label>
                  <Input
                    placeholder="e.g. Office Scheduled Power Maintenance Notice"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-medium text-slate-300">Target Type</label>
                    <select
                      value={targetType}
                      onChange={(e) => setTargetType(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-1 text-xs text-slate-100"
                    >
                      <option value="ALL">All Employees</option>
                      <option value="DEPARTMENT">Specific Department</option>
                      <option value="ROLE">Specific Role</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-medium text-slate-300">Priority Level</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-1 text-xs text-slate-100"
                    >
                      <option value="NORMAL">Normal</option>
                      <option value="IMPORTANT">Important</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>
                </div>

                {targetType === "DEPARTMENT" && (
                  <div className="space-y-1">
                    <label className="font-medium text-slate-300">Target Department</label>
                    <select
                      value={targetId}
                      onChange={(e) => setTargetId(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-1 text-xs text-slate-100"
                    >
                      <option value="">Select Department</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {targetType === "ROLE" && (
                  <div className="space-y-1">
                    <label className="font-medium text-slate-300">Target Role</label>
                    <select
                      value={targetId}
                      onChange={(e) => setTargetId(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-1 text-xs text-slate-100"
                    >
                      <option value="">Select Role</option>
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Announcement Content *</label>
                  <textarea
                    rows={4}
                    placeholder="Provide announcement details..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="flex w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500"
                  />
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1 h-9">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white h-9">
                    {isSubmitting ? "Broadcasting..." : "Broadcast Notice"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Admin Read/Unread Roster Modal */}
      {reportData && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-xl border-indigo-500/30 bg-slate-900 shadow-2xl max-h-[85vh] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <CardTitle className="text-base text-indigo-300">Read / Unread Roster Report</CardTitle>
                <CardDescription className="text-xs">{reportData.announcement.title}</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setReportData(null)} className="h-7 w-7">
                <X className="h-4 w-4 text-slate-400" />
              </Button>
            </CardHeader>
            <CardContent className="p-4 overflow-y-auto space-y-3 text-xs flex-1">
              <div className="grid grid-cols-3 gap-2 text-center p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <div>
                  <div className="text-slate-400 text-[10px]">Total Targeted</div>
                  <div className="font-bold text-slate-100">{reportData.totalTargeted} Users</div>
                </div>
                <div>
                  <div className="text-emerald-400 text-[10px]">Read</div>
                  <div className="font-bold text-emerald-400">{reportData.readCount}</div>
                </div>
                <div>
                  <div className="text-rose-400 text-[10px]">Unread</div>
                  <div className="font-bold text-rose-400">{reportData.unreadCount}</div>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User / Employee</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Read Status</TableHead>
                    <TableHead>Read At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.roster.map((r: any) => (
                    <TableRow key={r.userId}>
                      <TableCell className="font-semibold text-slate-100">{r.name}</TableCell>
                      <TableCell className="text-xs text-slate-400 font-mono">{r.email}</TableCell>
                      <TableCell>
                        <Badge variant={r.isRead ? "success" : "destructive"} className="text-[10px]">
                          {r.isRead ? "READ" : "UNREAD"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-slate-400 font-mono">
                        {r.readAt ? formatDate(r.readAt) : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
