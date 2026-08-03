"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Layers, Plus, Power, Edit, Check, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function DepartmentManagerClient({
  isAdmin,
  initialDepartments,
  initialDesignations,
  roles,
  employees,
}: {
  isAdmin: boolean;
  initialDepartments: any[];
  initialDesignations: any[];
  roles: any[];
  employees: any[];
}) {
  const router = useRouter();

  // Department State
  const [showAddDept, setShowAddDept] = useState(false);
  const [deptName, setDeptName] = useState("");
  const [deptCode, setDeptCode] = useState("");
  const [deptDesc, setDeptDesc] = useState("");
  const [deptManagerId, setDeptManagerId] = useState("");
  const [deptError, setDeptError] = useState<string | null>(null);

  // Designation State
  const [showAddDesig, setShowAddDesig] = useState(false);
  const [desigTitle, setDesigTitle] = useState("");
  const [desigCode, setDesigCode] = useState("");
  const [desigDeptId, setDesigDeptId] = useState("");
  const [desigError, setDesigError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  // Create Department Handler
  const handleCreateDept = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeptError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: deptName,
          code: deptCode,
          description: deptDesc,
          managerId: deptManagerId || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setDeptError(data.error || "Failed to create department");
        setIsLoading(false);
        return;
      }

      setDeptName("");
      setDeptCode("");
      setDeptDesc("");
      setShowAddDept(false);
      router.refresh();
    } catch (err: any) {
      setDeptError("Network error creating department.");
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle Department Active State
  const handleToggleDeptActive = async (deptId: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/departments/${deptId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  // Create Designation Handler
  const handleCreateDesig = async (e: React.FormEvent) => {
    e.preventDefault();
    setDesigError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/designations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: desigTitle,
          code: desigCode,
          departmentId: desigDeptId || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setDesigError(data.error || "Failed to create designation");
        setIsLoading(false);
        return;
      }

      setDesigTitle("");
      setDesigCode("");
      setShowAddDesig(false);
      router.refresh();
    } catch (err: any) {
      setDesigError("Network error creating designation.");
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle Designation Active State
  const handleToggleDesigActive = async (desigId: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/designations/${desigId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Departments Panel */}
        <Card className="space-y-4">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4 text-violet-400" />
                Departments ({initialDepartments.length})
              </CardTitle>
              <CardDescription>Organizational units and department managers</CardDescription>
            </div>
            {isAdmin && (
              <Button
                size="sm"
                onClick={() => setShowAddDept(!showAddDept)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-8"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Dept
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Department Inline Form */}
            {showAddDept && (
              <form onSubmit={handleCreateDept} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <h4 className="font-bold text-slate-200">New Department Details</h4>
                {deptError && <div className="text-rose-400 font-semibold">{deptError}</div>}
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Name (e.g. Finance)"
                    value={deptName}
                    onChange={(e) => setDeptName(e.target.value)}
                    required
                  />
                  <Input
                    placeholder="Code (e.g. DEPT_FIN)"
                    value={deptCode}
                    onChange={(e) => setDeptCode(e.target.value)}
                    required
                  />
                </div>
                <Input
                  placeholder="Description (Optional)"
                  value={deptDesc}
                  onChange={(e) => setDeptDesc(e.target.value)}
                />
                <Button type="submit" disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-8">
                  Create Department
                </Button>
              </form>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Status</TableHead>
                  {isAdmin && <TableHead className="text-right">Action</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialDepartments.length > 0 ? (
                  initialDepartments.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell>
                        <div className="font-medium text-slate-100">{d.name}</div>
                        <div className="text-[11px] text-slate-400">
                          {d.manager ? `Mgr: ${d.manager.firstName} ${d.manager.lastName}` : "No Manager"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-[10px]">{d.code}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={d.isActive ? "success" : "destructive"} className="text-[10px]">
                          {d.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleDeptActive(d.id, d.isActive)}
                            className={`h-7 px-2 ${d.isActive ? "text-rose-400 hover:bg-rose-950" : "text-emerald-400 hover:bg-emerald-950"}`}
                            title={d.isActive ? "Deactivate Department" : "Activate Department"}
                          >
                            <Power className="h-3.5 w-3.5 mr-1" />
                            {d.isActive ? "Deactivate" : "Activate"}
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-slate-500 text-xs">
                      No departments configured.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Designations Panel */}
        <Card className="space-y-4">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="h-4 w-4 text-sky-400" />
                Designations ({initialDesignations.length})
              </CardTitle>
              <CardDescription>Job titles and departmental assignments</CardDescription>
            </div>
            {isAdmin && (
              <Button
                size="sm"
                onClick={() => setShowAddDesig(!showAddDesig)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-8"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Title
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Designation Inline Form */}
            {showAddDesig && (
              <form onSubmit={handleCreateDesig} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <h4 className="font-bold text-slate-200">New Designation Title</h4>
                {desigError && <div className="text-rose-400 font-semibold">{desigError}</div>}
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Title (e.g. Senior Dev)"
                    value={desigTitle}
                    onChange={(e) => setDesigTitle(e.target.value)}
                    required
                  />
                  <Input
                    placeholder="Code (e.g. DESIG_SDEV)"
                    value={desigCode}
                    onChange={(e) => setDesigCode(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-8">
                  Create Designation
                </Button>
              </form>
            )}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Designation Title</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Status</TableHead>
                  {isAdmin && <TableHead className="text-right">Action</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialDesignations.length > 0 ? (
                  initialDesignations.map((des) => (
                    <TableRow key={des.id}>
                      <TableCell>
                        <div className="font-medium text-slate-100">{des.title}</div>
                        <div className="text-[11px] text-slate-400">{des.department?.name || "Global"}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-[10px]">{des.code}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={des.isActive ? "success" : "destructive"} className="text-[10px]">
                          {des.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleDesigActive(des.id, des.isActive)}
                            className={`h-7 px-2 ${des.isActive ? "text-rose-400 hover:bg-rose-950" : "text-emerald-400 hover:bg-emerald-950"}`}
                            title={des.isActive ? "Deactivate Title" : "Activate Title"}
                          >
                            <Power className="h-3.5 w-3.5 mr-1" />
                            {des.isActive ? "Deactivate" : "Activate"}
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-slate-500 text-xs">
                      No designations registered.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
