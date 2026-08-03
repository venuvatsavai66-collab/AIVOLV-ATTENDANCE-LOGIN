"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Database, Download, RefreshCw, AlertCircle, CheckCircle2, ShieldCheck, Terminal, HardDrive, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

export default function BackupsClient({ backups }: { backups: any[] }) {
  const router = useRouter();

  const [isExecuting, setIsExecuting] = useState(false);
  const [backupType, setBackupType] = useState("FULL");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Trigger Manual Backup
  const handleTriggerBackup = async () => {
    setError(null);
    setSuccess(null);
    setIsExecuting(true);

    try {
      const res = await fetch("/api/backups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileType: backupType }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Backup failed.");
        setIsExecuting(false);
        return;
      }

      setSuccess(`Manual ${backupType} backup completed successfully! Archive saved to /app/backups/`);
      setIsExecuting(false);
      router.refresh();
    } catch (err) {
      setError("Network error executing backup.");
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Database className="h-6 w-6 text-indigo-400" />
            System Backup & Disaster Recovery
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Manual database dumps, upload archives, automated daily cron scripts, and restore logs.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={backupType}
            onChange={(e) => setBackupType(e.target.value)}
            className="flex h-9 rounded-md border border-slate-800 bg-slate-950 px-3 py-1 text-xs text-slate-100 font-semibold"
          >
            <option value="FULL">Full Backup (DB + Files)</option>
            <option value="DATABASE">Database Only (SQL)</option>
            <option value="UPLOADS">Uploads Only (Files)</option>
          </select>

          <Button
            onClick={handleTriggerBackup}
            disabled={isExecuting}
            className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2 text-xs h-9"
          >
            <Play className={`h-3.5 w-3.5 ${isExecuting ? "animate-spin" : ""}`} />
            <span>{isExecuting ? "Executing..." : "Create Manual Backup"}</span>
          </Button>
        </div>
      </div>

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

      {/* Backup History Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>Backup History Archive ({backups.length})</span>
            <Badge variant="outline">Super Admin Restricted</Badge>
          </CardTitle>
          <CardDescription>Persistent backup archives stored in `/app/backups/` volume.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Archive File Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>File Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {backups.length > 0 ? (
                backups.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-mono text-xs text-indigo-300 font-semibold">{b.fileName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-mono">{b.fileType}</Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-slate-300">
                      {b.fileSize ? `${(b.fileSize / 1024).toFixed(1)} KB` : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={b.status === "SUCCESS" ? "success" : "destructive"} className="text-[10px]">
                        {b.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-slate-400">{formatDate(b.createdAt)}</TableCell>
                    <TableCell className="text-xs text-slate-400 max-w-xs truncate">{b.remarks || "-"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500 text-sm">
                    No backup archives found. Click "Create Manual Backup" to generate one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Ubuntu Automated Backup & Restore Instructions Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-indigo-500/20 bg-slate-900/90">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Terminal className="h-4 w-4 text-indigo-400" />
              Ubuntu Daily Automated Crontab Setup
            </CardTitle>
            <CardDescription className="text-xs">Schedule daily automated backups at 02:00 AM</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="p-3 rounded-lg bg-slate-950 font-mono text-[11px] text-slate-300 border border-slate-800 space-y-1">
              <div className="text-slate-500"># 1. Edit root crontab on Ubuntu host</div>
              <div>sudo crontab -e</div>
              <div className="text-slate-500 pt-2"># 2. Add daily backup schedule at 2:00 AM</div>
              <div className="text-emerald-400">0 2 * * * /bin/bash /app/scripts/daily_backup.sh &gt;&gt; /var/log/lan_backup.log 2&gt;&amp;1</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-500/20 bg-slate-900/90">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              Restricted Restore Instructions
            </CardTitle>
            <CardDescription className="text-xs">Super Admin database restoration guide</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="p-3 rounded-lg bg-slate-950 font-mono text-[11px] text-slate-300 border border-slate-800 space-y-1">
              <div className="text-slate-500"># PostgreSQL container database restore command</div>
              <div className="text-amber-300">cat /app/backups/db_backup_YYYYMMDD.sql | docker exec -i lan_office_postgres psql -U postgres -d lan_office_db</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
