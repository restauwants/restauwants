"use client";

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
          console.log(res);
        } catch (e) {
          console.error(e);
        }
      });
    }
  }

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
        {selectedFile && (
          <div className="mt-2">
            <Image
              src={selectedFile}
              alt="Preview"
              className="rounded-md"
              width={500}
              height={500}
            />
            <Button size="sm" type="submit">
              Upload
            </Button>
          </div>
        )}
      </div>
    </form>
  );
}