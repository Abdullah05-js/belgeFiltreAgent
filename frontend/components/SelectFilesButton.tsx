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
import { IFileUpload, IFileUploadResponse } from "@/types";
import { ScrollArea } from "./ui/scroll-area";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const SelectFilesButton = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = React.useState<File[]>([]);

  const mutete = useMutation({
    mutationFn: async (data: IFileUpload) => {
      try {
        const resp = await axios.post<IFileUploadResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/files/upload`,
          data
        );

        if (resp.data.links.length !== data.keys.length)
          throw new Error("hatta oluştu tekrar deneyin.");

        const uploadPromises = resp.data.links.map((link, index) => {
          const file = files[index];

          return axios.put(link, file, {
            headers: {
              "Content-Type": file.type,
            },
          });
        });

        await Promise.all(uploadPromises);
      } catch (error) {
        throw new Error((error as Error).message) || "error";
      }
    },
    onError(error, variables, onMutateResult, context) {},
    onSuccess(data, variables, onMutateResult, context) {},
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
        <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
          Upload PDF
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Dosyaları Seçiniz</SheetTitle>
        </SheetHeader>
        <Button variant="default" onClick={() => fileInputRef.current?.click()}>
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
              </div>
            ))}
          </div>
        </ScrollArea>
        <SheetFooter>
          <Button type="submit">Save changes</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SelectFilesButton;
