"use client";

import { Button } from "@/components/ui/button";
import { convert } from "@/lib/convert";
import { downloadBlob } from "@/lib/utils";
import React from "react";

export default function Page() {

  const [upload, setUpload] = React.useState<File>();

  const handleConvertToPng = async () => {
    if (!upload) {
      alert("No Upload found");
      return;
    }

    const blob = await convert({
      file: upload,
      targetFormat: "png",
    });
    if (blob instanceof Blob)
      downloadBlob(blob, "convert-png.png");
    else {
      alert("Couldn't convert file See console for errors");
      console.error(blob);
    }
  }

  return (
    <div className="max-w-xl min-h-screen mx-auto flex flex-col justify-center items-center gap-6">
      <input
        className="border border-neutral-300 px-4 py-2"
        type="file"
        accept="image/jpeg"
        onChange={e => setUpload(e.target.files ? e.target.files[0] : undefined)}
      />
      <Button onClick={handleConvertToPng}>Convert to PNG</Button>
    </div>
  )
}

