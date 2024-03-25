"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState, useTransition } from "react";
import Image from "next/image";

import { Button } from "@restauwants/ui/button";
import { Input } from "@restauwants/ui/input";
import { Label } from "@restauwants/ui/label";

import { getSignedUrl } from "./actions";

const MAX_FILE_SIZE = 3 * 1024 ** 2; // 3MB

export default function Upload() {
  const [isPending, startTransition] = useTransition();

  function upload(formData: FormData) {
    const uploadUrls: string[] = [];
    console.log("max upload size:", MAX_FILE_SIZE);
    console.log(formData);
    const files = formData.getAll("userFiles");
    for (const file of files) {
      console.log(file);
      if (typeof file === "string") {
        throw new Error("File is a string");
      }
      startTransition(async () => {
        try {
          const [url, filename] = await getSignedUrl(file.size);
          console.log("url:", url);
          console.log("filename:", filename);
          console.log("file size:", file.size);
          //console.log("test post request:", await generateV4UploadSignedUrl());
          const res = await fetch(url, {
            method: "PUT",
            body: file,
          });
          uploadUrls.push(url);
          console.log(res);
        } catch (e) {
          console.error(e);
        }
      });
    }
    return uploadUrls;
  }

  const [selectedFiles, setSelectedFiles] = useState([] as string[]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setSelectedFiles([]);
    const files = event.target.files;
    if (!files) return;
    for (let i = 0; i < files.length && i < 7; i++) {
      const file: File = files[i]!;
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          const result = reader.result;
          setSelectedFiles((prevFiles) => [...prevFiles, result]);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <form action={upload}>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="picture">Picture</Label>
        <Input
          id="picture"
          name="userFiles"
          type="file"
          accept="image/x-png,image/jpeg,image/gif"
          multiple
          onChange={handleFileChange}
        />
        {selectedFiles.length > 0 && (
          <div className="flex flex-col gap-1">
            <div className="grid grid-cols-3 gap-1">
              {selectedFiles.map((image: string, i: number) => (
                <div className="black relative h-16 w-16" key={i}>
                  <Image
                    src={image}
                    alt="Preview"
                    className="rounded-md"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              ))}
            </div>
            <Button size="sm" type="submit">
              Upload
            </Button>
          </div>
        )}
      </div>
    </form>
  );
}
