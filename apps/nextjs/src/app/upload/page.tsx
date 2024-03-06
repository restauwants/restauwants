"use client";

import { useTransition } from "react";

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
            method: 'PUT',
            body: file 
          })
          console.log(res)
        } catch (e) {
          console.error(e);
        }
      });
    }
  }

  return (
    <form action={upload}>
      <input
        type="file"
        name="userFiles"
        accept="image/x-png,image/jpeg,image/gif"
        multiple
      />
      <button type="submit">Upload</button>
    </form>
  );
}
