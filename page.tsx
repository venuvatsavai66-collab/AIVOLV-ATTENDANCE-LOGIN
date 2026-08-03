import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";
import { History, ShieldAlert } from "lucide-react";

export const revalidate = 0;

async function getAuditLogs() {
  try {
    const logs = await prisma.auditLog.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
      },
    });
    return logs;
  } catch (error) {
    console.error("Failed to fetch audit logs:", error);
    return [];
  }
}

export default async function AuditLogsPage() {
  const logs = await getAuditLogs();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <History className="h-6 w-6 text-amber-400" />
          Security Audit Logs
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Historical trail of user actions, login events, and configuration updates (`audit_logs`).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>Audit Events Log ({logs.length})</span>
            <Badge variant="outline">Air-gapped Compliance Log</Badge>
          </CardTitle>
          <CardDescription>Records IP address, action module, and user metadata for auditing.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>User</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length > 0 ? (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-xs text-slate-400 whitespace-nowrap">{formatDateTime(log.createdAt)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono text-xs">{log.action}</Badge>
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-slate-300">{log.module}</TableCell>
                    <TableCell className="text-xs font-mono text-indigo-400">{log.user?.email || "System/Guest"}</TableCell>
                    <TableCell className="text-xs font-mono text-slate-400">{log.ipAddress || "127.0.0.1"}</TableCell>
                    <TableCell className="text-xs text-slate-400 max-w-xs truncate">{log.details || "-"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500 text-sm">
                    No audit logs available. Run seed command (`npm run db:seed`) to create initial entries.
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
