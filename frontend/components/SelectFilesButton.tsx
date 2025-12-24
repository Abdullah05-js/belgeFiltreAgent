"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "./ui/separator";
import React, { useRef } from "react";
import { IFileUpload, IFileUploadResponse, UploadProgress } from "@/types";
import { ScrollArea } from "./ui/scroll-area";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Progress } from "./ui/progress";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";

const SelectFilesButton = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = React.useState<File[]>([]);
  const [progress, setProgress] = React.useState<UploadProgress>({});

  const mutete = useMutation({
    mutationFn: async (data: IFileUpload) => {
      try {
        const resp = await axios.post<IFileUploadResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/document/upload`,
          data
        );

        console.log(resp);

        if (resp.data.links.length !== data.count)
          throw new Error("hatta oluştu tekrar deneyin.");

        const uploadPromises = resp.data.links.map((link, index) => {
          const file = files[index];

          return axios.put(link, file, {
            headers: {
              "Content-Type": file.type,
            },
            onUploadProgress: (event) => {
              if (!event.total) return;

              const percent = Math.round((event.loaded * 100) / event.total);

              setProgress((prev) => ({
                ...prev,
                [file.name]: percent,
              }));
            },
          });
        });

        await Promise.all(uploadPromises);
      } catch (error) {
        throw new Error((error as Error).message) || "error";
      }
    },
    onError(error, variables, onMutateResult, context) {
      toast.error("Hata: " + error.message);
    },
    onSuccess(data, variables, onMutateResult, context) {
      toast.success("Başarılı şekilde dosyalar kaydedildi");
      setFiles([]);
      setProgress({});
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (uploadedFiles) {
      const files = Array.from(uploadedFiles ?? []);
      setFiles((prev) => {
        const existing = new Set(prev.map((f) => f.name));
        return [...prev, ...files.filter((f) => !existing.has(f.name))];
      });
    }
    console.log(event.target.value);
    event.target.value = "";
  };

  return (
    <Sheet>
      <Input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        multiple={true}
        hidden
        onChange={handleFileUpload}
      />
      <SheetTrigger asChild>
        <Button
          variant="outline"
          disabled={mutete.isPending}
          onClick={() => fileInputRef.current?.click()}
        >
          {mutete.isPending ? <Spinner /> : "Upload PDF"}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Dosyaları Seçiniz</SheetTitle>
        </SheetHeader>
        <Button
          disabled={mutete.isPending}
          variant="default"
          onClick={() => fileInputRef.current?.click()}
        >
          Dosya Ekle
        </Button>
        <ScrollArea className="w-full h-2/3 rounded-md border">
          <div className="flex flex-col gap-2.5 p-4">
            {files.map((file, index) => (
              <div
                className="hover:bg-red-500 rounded-lg"
                onClick={() =>
                  setFiles((prev) => {
                    return [...prev.filter((a) => a.name !== file.name)];
                  })
                }
              >
                <div className="text-sm p-3">
                  {index + 1} ) {file.name} ({Math.round(file.size / 1024)} KB)
                </div>
                <Separator className="my-2" />
                <Progress value={progress[index] ?? 0} />
              </div>
            ))}
          </div>
        </ScrollArea>
        <SheetFooter>
          <Button
            disabled={mutete.isPending}
            onClick={() =>
              mutete.mutate({
                count: files.length,
              })
            }
          >
            {mutete.isPending ? <Spinner /> : "Değişiklikleri kaydet"}
          </Button>
          <SheetClose asChild>
            <Button disabled={mutete.isPending} variant="outline">
              Iptal
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SelectFilesButton;
