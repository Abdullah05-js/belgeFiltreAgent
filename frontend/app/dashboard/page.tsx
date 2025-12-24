"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SelectFilesButton from "@/components/SelectFilesButton";
import { File, Job, JobStatus } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const mockJobs: Job[] = [
  {
    id: "job-1",
    name: "Thesis PDFs – Batch 1",
    status: "completed",
    createdAt: "2025-12-20T10:15:00Z",
    processedFiles: 8,
    failedFiles: [],
    totalFiles: 8,
    outputFile: "results-batch-1.zip",
  },
  {
    id: "job-2",
    name: "Invoice Extraction",
    status: "running",
    createdAt: "2025-12-22T14:30:00Z",
    processedFiles: 3,
    failedFiles: [],
    totalFiles: 10,
  },
  {
    id: "job-3",
    name: "Student Reports",
    status: "failed",
    createdAt: "2025-12-21T09:00:00Z",
    processedFiles: 2,
    failedFiles: [],
    totalFiles: 7,
  },
  {
    id: "job-4",
    name: "Legal Documents",
    status: "pending",
    createdAt: "2025-12-23T08:45:00Z",
    processedFiles: 0,
    failedFiles: [],
    totalFiles: 4,
  },
];

const mockFiles: File[] = [
  {
    id: "file-1",
    name: "thesis_ahmet_yilmaz.pdf",
    size: 524288,
    uploadedAt: "2025-12-22T12:00:00Z",
  },
  {
    id: "file-2",
    name: "invoice_december.pdf",
    size: 212992,
    uploadedAt: "2025-12-22T12:05:00Z",
  },
  {
    id: "file-3",
    name: "student_report_2024.pdf",
    size: 734003,
    uploadedAt: "2025-12-21T16:40:00Z",
  },
  {
    id: "file-4",
    name: "legal_contract.pdf",
    size: 1048576,
    uploadedAt: "2025-12-20T09:30:00Z",
  },
  {
    id: "file-5",
    name: "jury_report.pdf",
    size: 348160,
    uploadedAt: "2025-12-23T07:10:00Z",
  },
];

export default function DashboardPage() {
  const [selectedFiles, setSelectedFiles] = React.useState<string[]>([]);
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);
  const [isJobDialogOpen, setIsJobDialogOpen] = React.useState(false);
  const [isCreateJobDialogOpen, setIsCreateJobDialogOpen] =
    React.useState(false);
  const [newJobName, setNewJobName] = React.useState("");

  const {
    data: files = [],
    isFetching,
    refetch: refetchFile,
  } = useQuery<File[]>({
    queryKey: ["files"],
    queryFn: async (): Promise<File[]> => {
      try {
        const data = await axios.get<File[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/document/getDocuments`
        );
        return data.data;
      } catch (error) {
        throw new Error((error as Error).message) || "error";
      }
    },
    refetchOnWindowFocus: true,
  });

  const {
    data: jobs = [],
    isFetching: isFetchingJobs,
    refetch: refetchJobs,
  } = useQuery<Job[]>({
    queryKey: ["jobs"],
    queryFn: async (): Promise<Job[]> => {
      try {
        const data = await axios.get<Job[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/document/getJobs`
        );
        return data.data;
      } catch (error) {
        throw new Error((error as Error).message) || "error";
      }
    },
    refetchOnWindowFocus: true,
  });

  const { mutate: handleCreateJob } = useMutation({
    mutationFn: async () => {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/document/createJob`,
          {
            links: selectedFiles,
            name: newJobName,
          }
        );
      } catch (error) {
        throw new Error((error as Error).message) || "error";
      }
    },
    onError(error, variables, onMutateResult, context) {
      toast.error("Hata: " + error.message);
    },
    onSuccess(data, variables, onMutateResult, context) {
      setIsCreateJobDialogOpen(false);
      setSelectedFiles([]);
      setNewJobName("");
      toast.success("Görev Eklendi.");
    },
  });

  const { mutate: handleDeleteJob } = useMutation({
    mutationFn: async (jobId: string) => {
      try {
        if (!jobId.trim()) throw new Error("Yanlış ID");

        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/document/deleteJob?jobID=${jobId}`
        );
      } catch (error) {
        throw new Error((error as Error).message) || "error";
      }
    },
    onError(error, variables, onMutateResult, context) {
      toast.error("Hata: " + error.message);
    },
    onSuccess(data, variables, onMutateResult, context) {
      setIsCreateJobDialogOpen(false);
      setSelectedFiles([]);
      setNewJobName("");
      toast.success("Görev Silindi.");
    },
  });

  const { mutate: handleDeleteFile } = useMutation({
    mutationFn: async (fileId: string) => {
      try {
        if (!fileId.trim()) throw new Error("Yanlış ID");

        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/document/deleteFile?fileID=${fileId}`
        );
      } catch (error) {
        throw new Error((error as Error).message) || "error";
      }
    },
    onError(error, variables, onMutateResult, context) {
      toast.error("Hata: " + error.message);
    },
    onSuccess(data, variables, onMutateResult, context) {
      setIsCreateJobDialogOpen(false);
      setSelectedFiles([]);
      setNewJobName("");
      toast.success("Dosya Silindi.");
    },
  });

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files.map((f) => f.id));
    }
  };

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setIsJobDialogOpen(true);
  };

  const getStatusBadge = (status: JobStatus) => {
    const variants: Record<JobStatus, "default" | "secondary" | "destructive"> =
      {
        completed: "default",
        running: "secondary",
        failed: "destructive",
        pending: "secondary",
      };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getJobProgress = (job: Job) => {
    if (job.totalFiles === 0) return 0;
    return (
      ((job.processedFiles + job.failedFiles.length) / job.totalFiles) * 100
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Kontrol Paneli</h1>
        <div className="flex gap-2">
          <div>
            <SelectFilesButton />
          </div>
        </div>
      </div>

      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="jobs">Karar</TabsTrigger>
          <TabsTrigger value="files">Dosyalar</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Önceki Kararlar</CardTitle>
              <CardDescription>
                Karar görevlerinizi görüntüleyin ve yönetin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Isim</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Oluşturulma Tarihi</TableHead>
                    <TableHead>İlerleyiş</TableHead>
                    <TableHead>Eylemler</TableHead>
                    <TableHead>
                      <Button onClick={() => refetchJobs()}>Yenile</Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isFetching ? (
                    <TableRow>
                      {/* Job name */}
                      <TableCell>
                        <Skeleton className="h-4 w-40" />
                      </TableCell>

                      {/* Status badge */}
                      <TableCell>
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </TableCell>

                      {/* Created date */}
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>

                      {/* Progress */}
                      <TableCell>
                        <div className="space-y-2">
                          <Skeleton className="h-2 w-full rounded" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </TableCell>

                      {/* Delete button */}
                      <TableCell>
                        <Skeleton className="h-8 w-20 rounded-md" />
                      </TableCell>
                    </TableRow>
                  ) : jobs.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-muted-foreground"
                      >
                        İş ilanı bulunamadı.{" "}
                      </TableCell>
                    </TableRow>
                  ) : (
                    jobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell
                          className="font-medium cursor-pointer hover:underline"
                          onClick={() => handleJobClick(job)}
                        >
                          {job.name}
                        </TableCell>
                        <TableCell>{getStatusBadge(job.status)}</TableCell>
                        <TableCell>
                          {new Date(job.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Progress value={getJobProgress(job)} />
                            <p className="text-xs text-muted-foreground">
                              {job.processedFiles + job.failedFiles.length} /{" "}
                              {job.totalFiles} Dosyalar
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                Sil
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Emin misin?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Bu işlem geri alınamaz. Bu, işi kalıcı olarak
                                  silecektir."{job.name}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteJob(job.id)}
                                >
                                  Sil
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Files</CardTitle>
                  <CardDescription>
                    Yüklediğiniz dosyaları yönetin ve yeni işler oluşturun.{" "}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {selectedFiles.length > 0 && (
                    <Button onClick={() => setIsCreateJobDialogOpen(true)}>
                      İş Oluştur ({selectedFiles.length})
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          selectedFiles.length === files.length &&
                          files.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Isim</TableHead>
                    <TableHead>Boyut</TableHead>
                    <TableHead>Yüklenme Tarihi</TableHead>
                    <TableHead>Eylemler</TableHead>
                    <TableHead>
                      <Button onClick={() => refetchFile()}>Yenile</Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isFetchingJobs ? (
                    <TableRow>
                      {/* Checkbox */}
                      <TableCell>
                        <Skeleton className="h-4 w-4 rounded-sm" />
                      </TableCell>

                      {/* File name */}
                      <TableCell>
                        <Skeleton className="h-4 w-48" />
                      </TableCell>

                      {/* File size */}
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>

                      {/* Upload date */}
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>

                      {/* Delete button */}
                      <TableCell>
                        <Skeleton className="h-8 w-20 rounded-md" />
                      </TableCell>
                    </TableRow>
                  ) : files.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-muted-foreground"
                      >
                        Dosya bulunamadı. Başlamak için PDF dosyalarınızı
                        yükleyin.
                      </TableCell>
                    </TableRow>
                  ) : (
                    files.map((file) => (
                      <TableRow key={file.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedFiles.includes(file.id)}
                            onCheckedChange={() => handleFileSelect(file.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {file.name}
                        </TableCell>
                        <TableCell>
                          {(file.size / 1024).toFixed(2)} KB
                        </TableCell>
                        <TableCell>
                          {new Date(file.uploadedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                Sil
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Emin misin?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Bu işlem geri alınamaz. Bu, dosyayı kalıcı
                                  olarak silecektir."{file.name}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Iptal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteFile(file.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Job Details Dialog */}
      <Dialog open={isJobDialogOpen} onOpenChange={setIsJobDialogOpen}>
        <DialogContent size="xl">
          <DialogHeader>
            <DialogTitle>{selectedJob?.name}</DialogTitle>
            <DialogDescription>İş detayları ve işlem durumu</DialogDescription>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Durum:</span>
                  {getStatusBadge(selectedJob.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">İlerleyiş:</span>
                  <span className="text-sm text-muted-foreground">
                    {getJobProgress(selectedJob).toFixed(0)}%
                  </span>
                </div>
                <Progress value={getJobProgress(selectedJob)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      İşlem başarıyla tamamlandı.
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-600">
                      {selectedJob.processedFiles}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Başarısız Dosyalar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64 rounded-md border">
                      <div className="p-4 space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Başarısız Dosyalar
                        </h4>

                        {selectedJob.failedFiles.length === 0 ? (
                          <p className="text-sm text-muted-foreground">
                            Başarısız dosya yok 🎉
                          </p>
                        ) : (
                          selectedJob.failedFiles.map((url, index) => (
                            <div
                              key={url}
                              className="flex items-center justify-between gap-2 rounded-md bg-muted px-3 py-2"
                            >
                              <span className="text-xs text-muted-foreground">
                                #{index + 1}
                              </span>

                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="truncate text-sm font-medium text-blue-600 hover:underline"
                              >
                                Dosyayı Aç
                              </a>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {selectedJob.outputFile && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Karar Dosyası:</Label>
                  <div className="flex items-center gap-2">
                    <Input value={selectedJob.outputFile} readOnly />
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={selectedJob.outputFile}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Indir
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Job Dialog */}
      <Dialog
        open={isCreateJobDialogOpen}
        onOpenChange={setIsCreateJobDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yeni Karar Metni</DialogTitle>
            <DialogDescription>
              Seçilen dosyalardan yeni bir işleme görevi oluşturun
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="job-name">Karar ismi</Label>
              <Input
                id="job-name"
                placeholder="Enter job name"
                value={newJobName}
                onChange={(e) => setNewJobName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Seçilen Dosya ({selectedFiles.length})</Label>
              <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                {files
                  .filter((f) => selectedFiles.includes(f.id))
                  .map((file) => (
                    <div key={file.id} className="text-sm py-1">
                      {file.name}
                    </div>
                  ))}
              </div>
            </div>
            {isFetching ? (
              <Spinner />
            ) : (
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateJobDialogOpen(false)}
                >
                  Iptal
                </Button>
                <Button
                  onClick={() => handleCreateJob()}
                  disabled={!newJobName.trim() || selectedFiles.length <= 0}
                >
                  Yeni Karar
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
