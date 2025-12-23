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
import { File } from "@/types";
// Types
type JobStatus = "running" | "completed" | "failed" | "pending";

interface Job {
  id: string;
  name: string;
  status: JobStatus;
  createdAt: string;
  processedFiles: number;
  failedFiles: number;
  totalFiles: number;
  outputFile?: string;
}

export default function DashboardPage() {
  const [jobs, setJobs] = React.useState<Job[]>([]);
  const [files, setFiles] = React.useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = React.useState<string[]>([]);
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);
  const [isJobDialogOpen, setIsJobDialogOpen] = React.useState(false);
  const [isCreateJobDialogOpen, setIsCreateJobDialogOpen] =
    React.useState(false);
  const [newJobName, setNewJobName] = React.useState("");

  // TODO: Implement fetch jobs from backend
  const fetchJobs = () => {
    // TODO: Fetch jobs from backend
  };

  // TODO: Implement fetch files from backend
  const fetchFiles = () => {
    // TODO: Fetch files from backend
  };

  React.useEffect(() => {
    fetchJobs();
    fetchFiles();
  }, []);

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

  const handleCreateJob = () => {
    // TODO: Implement create job logic
    setIsCreateJobDialogOpen(false);
    setSelectedFiles([]);
    setNewJobName("");
  };

  const handleDeleteJob = (jobId: string) => {
    // TODO: Implement delete job logic
  };

  const handleDeleteFile = (fileId: string) => {
    // TODO: Implement delete file logic
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
    return ((job.processedFiles + job.failedFiles) / job.totalFiles) * 100;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <div>
            
            <SelectFilesButton />
          </div>
        </div>
      </div>

      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Past Jobs</CardTitle>
              <CardDescription>
                View and manage your processing jobs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-muted-foreground"
                      >
                        No jobs found
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
                              {job.processedFiles + job.failedFiles} /{" "}
                              {job.totalFiles} files
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the job "{job.name}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteJob(job.id)}
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

        <TabsContent value="files" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Files</CardTitle>
                  <CardDescription>
                    Manage your uploaded files and create new jobs
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {selectedFiles.length > 0 && (
                    <Button onClick={() => setIsCreateJobDialogOpen(true)}>
                      Create Job ({selectedFiles.length})
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
                    <TableHead>Name</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-muted-foreground"
                      >
                        No files found. Upload PDF files to get started.
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
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the file "{file.name}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
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
            <DialogDescription>
              Job details and processing status
            </DialogDescription>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status:</span>
                  {getStatusBadge(selectedJob.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Progress:</span>
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
                      Successfully Processed
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
                    <CardTitle className="text-sm">Failed Files</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-red-600">
                      {selectedJob.failedFiles}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {selectedJob.outputFile && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Output File:</Label>
                  <div className="flex items-center gap-2">
                    <Input value={selectedJob.outputFile} readOnly />
                    <Button variant="outline" size="sm">
                      Download
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
            <DialogTitle>Create New Job</DialogTitle>
            <DialogDescription>
              Create a new processing job from selected files
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="job-name">Job Name</Label>
              <Input
                id="job-name"
                placeholder="Enter job name"
                value={newJobName}
                onChange={(e) => setNewJobName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Selected Files ({selectedFiles.length})</Label>
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
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateJobDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateJob} disabled={!newJobName.trim()}>
                Create Job
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
