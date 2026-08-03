"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Upload, CheckCircle2, ShieldCheck, Download, AlertCircle, Trash2, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

export default function DocumentsClient({
  documents,
  employees,
  isAdmin,
}: {
  documents: any[];
  employees: any[];
  isAdmin: boolean;
}) {
  const router = useRouter();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [title, setTitle] = useState("");
  const [documentType, setDocumentType] = useState("ID_PROOF");
  const [targetEmployeeId, setTargetEmployeeId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Upload Submission
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);

    if (!title || !selectedFile) {
      setUploadError("Please provide a document title and select a file.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          documentType,
          fileName: selectedFile.name,
          fileUrl: `/uploads/documents/${selectedFile.name}`,
          fileSize: selectedFile.size,
          mimeType: selectedFile.type || "application/pdf",
          employeeId: targetEmployeeId || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || "Failed to upload document.");
        setIsSubmitting(false);
        return;
      }

      setShowUploadModal(false);
      setTitle("");
      setSelectedFile(null);
      router.refresh();
    } catch (err) {
      setUploadError("Network error uploading file.");
      setIsSubmitting(false);
    }
  };

  // Toggle Verification
  const handleToggleVerification = async (doc: any) => {
    try {
      const res = await fetch(`/api/documents/${doc.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified: !doc.isVerified }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error("Toggle document verification error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <FileText className="h-6 w-6 text-indigo-400" />
            Employee Document Management
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Store ID proofs, contracts, tax forms, and certificates securely on local server storage.
          </p>
        </div>

        <Button
          onClick={() => setShowUploadModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2"
        >
          <Upload className="h-4 w-4" /> Upload Document
        </Button>
      </div>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>Uploaded Documents ({documents.length})</span>
            <Badge variant="outline">Local Server Storage</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Title</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.length > 0 ? (
                documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="font-semibold text-slate-100">{doc.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono">By: {doc.uploadedBy}</div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-300">
                      {doc.employee ? `${doc.employee.firstName} ${doc.employee.lastName}` : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-mono">{doc.documentType}</Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-indigo-300 max-w-xs truncate">{doc.fileName}</TableCell>
                    <TableCell className="text-xs font-mono text-slate-400">{formatDate(doc.createdAt)}</TableCell>
                    <TableCell>
                      <Badge variant={doc.isVerified ? "success" : "warning"} className="text-[10px]">
                        {doc.isVerified ? "VERIFIED" : "UNVERIFIED"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <a href={doc.fileUrl} download target="_blank" rel="noreferrer">
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-emerald-400 hover:bg-emerald-950 text-xs">
                          <Download className="h-3.5 w-3.5 mr-1" /> Download
                        </Button>
                      </a>

                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleVerification(doc)}
                          className={`h-7 px-2 text-xs ${doc.isVerified ? "text-amber-400 hover:bg-amber-950" : "text-indigo-400 hover:bg-indigo-950"}`}
                        >
                          <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                          {doc.isVerified ? "Unverify" : "Verify"}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-slate-500 text-sm">
                    No documents uploaded yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md border-indigo-500/30 bg-slate-900 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Upload className="h-4 w-4 text-indigo-400" />
                  Upload Employee Document
                </CardTitle>
                <CardDescription className="text-xs">Save file to local server storage</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowUploadModal(false)} className="h-7 w-7">
                <X className="h-4 w-4 text-slate-400" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpload} className="space-y-4 text-xs">
                {uploadError && (
                  <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-600/50 text-rose-200 flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Document Title *</label>
                  <Input
                    placeholder="e.g. Employee Passport ID Copy"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Document Type</label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-1 text-xs text-slate-100"
                  >
                    <option value="ID_PROOF">ID Proof</option>
                    <option value="CONTRACT">Employment Contract</option>
                    <option value="TAX_FORM">Tax Form</option>
                    <option value="CERTIFICATE">Degree / Certification</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                {isAdmin && (
                  <div className="space-y-1">
                    <label className="font-medium text-slate-300">Target Employee</label>
                    <select
                      value={targetEmployeeId}
                      onChange={(e) => setTargetEmployeeId(e.target.value)}
                      className="flex h-9 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-1 text-xs text-slate-100"
                    >
                      <option value="">Self (Loggged In Employee)</option>
                      {employees.map((e) => (
                        <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.employeeCode})</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Select File (PDF, PNG, JPG) *</label>
                  <Input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                    required
                    className="bg-slate-950 border-slate-800 text-xs"
                  />
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowUploadModal(false)} className="flex-1 h-9">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white h-9">
                    {isSubmitting ? "Uploading..." : "Save to Server"}
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
