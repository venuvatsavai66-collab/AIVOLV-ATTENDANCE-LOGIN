"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckSquare, Plus, Edit, Clock, AlertCircle, CheckCircle2, MessageSquare, FileText, Send, User, Calendar, X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

export default function TasksClient({
  initialTasks,
  employees,
  departments,
  canManageTasks,
}: {
  initialTasks: any[];
  employees: any[];
  departments: any[];
  canManageTasks: boolean;
}) {
  const router = useRouter();

  const [tasks, setTasks] = useState<any[]>(initialTasks);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [createError, setCreateError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Detail / Interactive Modal State
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [commentText, setCommentText] = useState("");
  const [logHours, setLogHours] = useState("");
  const [logDesc, setLogDesc] = useState("");
  const [detailError, setDetailError] = useState<string | null>(null);

  // Filter Tasks
  const filteredTasks = tasks.filter((t) => {
    if (statusFilter !== "ALL" && t.status !== statusFilter) return false;
    if (priorityFilter !== "ALL" && t.priority !== priorityFilter) return false;
    return true;
  });

  // Create Task Submission
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    if (!title) {
      setCreateError("Task title is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          assigneeId: assigneeId || null,
          departmentId: departmentId || null,
          dueDate: dueDate || null,
          priority,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.error || "Failed to create task.");
        setIsSubmitting(false);
        return;
      }

      setShowCreateModal(false);
      setTitle("");
      setDescription("");
      router.refresh();
    } catch (err) {
      setCreateError("Network error creating task.");
      setIsSubmitting(false);
    }
  };

  // Update Status
  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error("Update task status error:", err);
    }
  };

  // Add Comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText || !selectedTask) return;

    try {
      const res = await fetch(`/api/tasks/${selectedTask.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ADD_COMMENT", comment: commentText }),
      });

      const data = await res.json();
      if (res.ok) {
        setCommentText("");
        router.refresh();
      }
    } catch (err) {
      console.error("Add comment error:", err);
    }
  };

  // Add Work Log
  const handleAddWorkLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logHours || !selectedTask) return;

    try {
      const res = await fetch(`/api/tasks/${selectedTask.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ADD_WORK_LOG",
          hoursSpent: logHours,
          description: logDesc,
        }),
      });

      if (res.ok) {
        setLogHours("");
        setLogDesc("");
        router.refresh();
      }
    } catch (err) {
      console.error("Add work log error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-indigo-400" />
            Task Tracking & Assignments
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Assign tasks, track status (To Do, In Progress, Review, Completed, On Hold), log hours, and monitor overdue deadlines.
          </p>
        </div>

        {canManageTasks && (
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Assign New Task
          </Button>
        )}
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Task Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex h-9 rounded-md border border-slate-800 bg-slate-950 px-3 py-1 text-xs text-slate-100"
              >
                <option value="ALL">All Statuses</option>
                <option value="TO_DO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="REVIEW">Review</option>
                <option value="COMPLETED">Completed</option>
                <option value="ON_HOLD">On Hold</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="flex h-9 rounded-md border border-slate-800 bg-slate-950 px-3 py-1 text-xs text-slate-100"
              >
                <option value="ALL">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>Task Assignments ({filteredTasks.length})</span>
            <Badge variant="outline">Live Task Tracker</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task Title</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((t) => (
                  <TableRow key={t.id} className={t.isOverdue ? "bg-rose-950/20" : ""}>
                    <TableCell>
                      <div className="font-semibold text-slate-100">{t.title}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">{t.description || "No description"}</div>
                    </TableCell>
                    <TableCell>
                      {t.assignee ? (
                        <div className="text-xs font-medium text-slate-200">{t.assignee.firstName} {t.assignee.lastName}</div>
                      ) : (
                        <span className="text-xs text-slate-500 font-mono">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-slate-300">{t.department?.name || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          t.priority === "URGENT" || t.priority === "HIGH"
                            ? "destructive"
                            : t.priority === "MEDIUM"
                            ? "warning"
                            : "secondary"
                        }
                        className="text-[10px]"
                      >
                        {t.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-slate-300">
                      {t.dueDate ? formatDate(t.dueDate) : "-"}
                      {t.isOverdue && (
                        <Badge variant="destructive" className="ml-1.5 text-[9px]">OVERDUE</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <select
                        value={t.status}
                        onChange={(e) => handleUpdateStatus(t.id, e.target.value)}
                        className="flex h-7 rounded border border-slate-800 bg-slate-950 px-2 py-0 text-[11px] text-slate-100 font-semibold"
                      >
                        <option value="TO_DO">TO DO</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="REVIEW">REVIEW</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="ON_HOLD">ON HOLD</option>
                      </select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTask(t)}
                        className="h-7 px-2 text-indigo-300 hover:bg-indigo-950 text-xs"
                      >
                        Details & Logs
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-slate-500 text-sm">
                    No tasks found matching criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-lg border-indigo-500/30 bg-slate-900 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-indigo-400" />
                  Assign New Task
                </CardTitle>
                <CardDescription className="text-xs">Create task assignment for employee or department</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowCreateModal(false)} className="h-7 w-7">
                <X className="h-4 w-4 text-slate-400" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
                {createError && (
                  <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-600/50 text-rose-200 flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{createError}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Task Title *</label>
                  <Input
                    placeholder="e.g. Update LAN firewall rules documentation"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-medium text-slate-300">Assignee</label>
                    <select
                      value={assigneeId}
                      onChange={(e) => setAssigneeId(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-1 text-xs text-slate-100"
                    >
                      <option value="">Unassigned</option>
                      {employees.map((e) => (
                        <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.employeeCode})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-medium text-slate-300">Department</label>
                    <select
                      value={departmentId}
                      onChange={(e) => setDepartmentId(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-1 text-xs text-slate-100"
                    >
                      <option value="">All Departments</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="font-medium text-slate-300">Due Date</label>
                    <Input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-medium text-slate-300">Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-1 text-xs text-slate-100"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Task details and deliverables..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="flex w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500"
                  />
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1 h-9">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white h-9">
                    {isSubmitting ? "Assigning..." : "Assign Task"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Task Details, Comments & Work Log Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-2xl border-indigo-500/30 bg-slate-900 shadow-2xl max-h-[90vh] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <span>{selectedTask.title}</span>
                  <Badge variant="outline" className="text-[10px]">{selectedTask.status}</Badge>
                </CardTitle>
                <CardDescription className="text-xs">
                  Assigned to: {selectedTask.assignee ? `${selectedTask.assignee.firstName} ${selectedTask.assignee.lastName}` : "Unassigned"}
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedTask(null)} className="h-7 w-7">
                <X className="h-4 w-4 text-slate-400" />
              </Button>
            </CardHeader>

            <CardContent className="p-4 overflow-y-auto space-y-4 text-xs flex-1">
              {/* Task Details */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div className="font-semibold text-slate-300">Description</div>
                <div className="text-slate-400 leading-relaxed">{selectedTask.description || "No description provided."}</div>
              </div>

              {/* Work Log Form */}
              <div className="p-3 rounded-lg bg-slate-950/80 border border-indigo-500/20 space-y-2">
                <div className="font-bold text-indigo-300 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Submit Work Log (Hours Spent)
                </div>
                <form onSubmit={handleAddWorkLog} className="flex gap-2">
                  <Input
                    type="number"
                    step="0.5"
                    placeholder="Hours (e.g. 2.5)"
                    value={logHours}
                    onChange={(e) => setLogHours(e.target.value)}
                    required
                    className="w-32 bg-slate-900 border-slate-800 text-xs"
                  />
                  <Input
                    placeholder="Work description / summary..."
                    value={logDesc}
                    onChange={(e) => setLogDesc(e.target.value)}
                    className="flex-1 bg-slate-900 border-slate-800 text-xs"
                  />
                  <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-9">
                    Log Hours
                  </Button>
                </form>

                {/* Work Log History */}
                {selectedTask.workLogs && selectedTask.workLogs.length > 0 && (
                  <div className="pt-2 space-y-1">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Logged Hours History:</div>
                    {selectedTask.workLogs.map((wl: any) => (
                      <div key={wl.id} className="text-[11px] text-slate-300 flex justify-between border-t border-slate-900 pt-1">
                        <span>{wl.employee.firstName} {wl.employee.lastName}: <strong>{wl.hoursSpent} hrs</strong> ({wl.description || "Work log"})</span>
                        <span className="text-slate-500 font-mono text-[10px]">{formatDate(wl.logDate)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Comments Thread */}
              <div className="space-y-2">
                <div className="font-bold text-slate-200 flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5 text-indigo-400" /> Comments Thread ({selectedTask.comments?.length || 0})
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedTask.comments && selectedTask.comments.length > 0 ? (
                    selectedTask.comments.map((c: any) => (
                      <div key={c.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-indigo-300">{c.user?.employee ? `${c.user.employee.firstName} ${c.user.employee.lastName}` : c.user.email}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{formatDate(c.createdAt)}</span>
                        </div>
                        <p className="text-slate-300 text-xs">{c.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-500 text-xs text-center py-2">No comments posted yet.</div>
                  )}
                </div>

                <form onSubmit={handleAddComment} className="flex gap-2 pt-1">
                  <Input
                    placeholder="Post a comment on this task..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    required
                    className="flex-1 bg-slate-950 border-slate-800 text-xs"
                  />
                  <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-9">
                    <Send className="h-3.5 w-3.5 mr-1" /> Post
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
