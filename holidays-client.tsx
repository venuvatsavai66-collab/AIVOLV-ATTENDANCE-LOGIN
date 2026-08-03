"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Palmtree, Plus, Edit, CheckCircle2, AlertCircle, Calendar, Power, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

export default function HolidaysClient({
  holidays,
  isAdmin,
}: {
  holidays: any[];
  isAdmin: boolean;
}) {
  const router = useRouter();

  // Add/Edit Modal States
  const [showModal, setShowModal] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<any | null>(null);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [isMandatory, setIsMandatory] = useState(true);
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalSuccess, setModalSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Open Modal for Create
  const openCreateModal = () => {
    setEditingHoliday(null);
    setName("");
    setDate("");
    setDescription("");
    setIsMandatory(true);
    setModalError(null);
    setModalSuccess(null);
    setShowModal(true);
  };

  // Open Modal for Edit
  const openEditModal = (hol: any) => {
    setEditingHoliday(hol);
    setName(hol.name);
    setDate(new Date(hol.date).toISOString().split("T")[0]);
    setDescription(hol.description || "");
    setIsMandatory(hol.isMandatory);
    setModalError(null);
    setModalSuccess(null);
    setShowModal(true);
  };

  // Handle Create / Edit Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setModalSuccess(null);

    if (!name || !date) {
      setModalError("Holiday name and date are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const url = editingHoliday ? `/api/holidays/${editingHoliday.id}` : "/api/holidays";
      const method = editingHoliday ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          date,
          description,
          isMandatory,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setModalError(data.error || "Failed to save holiday.");
        setIsSubmitting(false);
        return;
      }

      setModalSuccess(editingHoliday ? "Holiday updated!" : "Holiday created!");
      setTimeout(() => {
        setShowModal(false);
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setModalError("Network error saving holiday.");
      setIsSubmitting(false);
    }
  };

  // Toggle Active Status
  const handleToggleStatus = async (hol: any) => {
    try {
      const res = await fetch(`/api/holidays/${hol.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !hol.isActive }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error("Toggle holiday status error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Palmtree className="h-6 w-6 text-emerald-400" />
            Office Holiday Calendar
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Official company holidays and mandatory non-working days.
          </p>
        </div>

        {isAdmin && (
          <Button
            onClick={openCreateModal}
            className="bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add Office Holiday
          </Button>
        )}
      </div>

      {/* Holidays Grid / List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>Official Holidays ({holidays.length})</span>
            <Badge variant="outline">Year {new Date().getFullYear()}</Badge>
          </CardTitle>
          <CardDescription>Scheduled office closures and public holidays.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Holiday Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Day of Week</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                {isAdmin && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {holidays.length > 0 ? (
                holidays.map((hol) => (
                  <TableRow key={hol.id} className={!hol.isActive ? "opacity-50 bg-slate-950/40" : ""}>
                    <TableCell className="font-semibold text-slate-100">{hol.name}</TableCell>
                    <TableCell className="text-xs font-mono text-emerald-400">{formatDate(hol.date)}</TableCell>
                    <TableCell className="text-xs text-slate-300">{hol.dayOfWeek || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={hol.isMandatory ? "success" : "secondary"} className="text-[10px]">
                        {hol.isMandatory ? "Mandatory" : "Optional"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-slate-400 max-w-xs truncate">{hol.description || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={hol.isActive ? "success" : "destructive"} className="text-[10px]">
                        {hol.isActive ? "ACTIVE" : "INACTIVE"}
                      </Badge>
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(hol)}
                          className="h-7 px-2 text-indigo-300 hover:bg-indigo-950"
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(hol)}
                          className={`h-7 px-2 ${hol.isActive ? "text-rose-400 hover:bg-rose-950" : "text-emerald-400 hover:bg-emerald-950"}`}
                        >
                          <Power className="h-3.5 w-3.5 mr-1" />
                          {hol.isActive ? "Deactivate" : "Activate"}
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-slate-500 text-sm">
                    No office holidays scheduled yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md border-emerald-500/30 bg-slate-900 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Palmtree className="h-4 w-4 text-emerald-400" />
                  {editingHoliday ? "Edit Office Holiday" : "Add Office Holiday"}
                </CardTitle>
                <CardDescription className="text-xs">Schedule official office holiday</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowModal(false)} className="h-7 w-7">
                <X className="h-4 w-4 text-slate-400" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
                  <label className="font-medium text-slate-300">Holiday Name *</label>
                  <Input
                    placeholder="e.g. Independence Day"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Date *</label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="mandatory"
                    checked={isMandatory}
                    onChange={(e) => setIsMandatory(e.target.checked)}
                    className="rounded border-slate-800 bg-slate-950"
                  />
                  <label htmlFor="mandatory" className="text-slate-300 font-medium">Mandatory Office Closure</label>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brief holiday details..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="flex w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500"
                  />
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1 h-9">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white h-9">
                    {isSubmitting ? "Saving..." : "Save Holiday"}
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
