"use client";

export default function Upload() {
  function upload() {
    return new Promise<void>((resolve, reject) => {
      const filePicker = document.querySelector("input");

      if (!filePicker?.files || filePicker.files.length <= 0) {
        reject("No file selected.");
        return;
      }
      const myFile = filePicker.files[0];
      console.log(myFile);

      resolve();
    });
  }

  return (
    <input
      type="file"
      accept="image/x-png,image/jpeg,image/gif"
      onChange={() => upload()}
    />
  );
}
