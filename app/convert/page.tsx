"use client";

import { Button } from "@/components/ui/button";
import { convert } from "@/lib/convert";
import { downloadBlob } from "@/lib/utils";
import { ImageUp, Upload } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";

export default function Page() {

  const [upload, setUpload] = React.useState<File>();

  const dropzone = useDropzone({
    accept: {
      "images/*": [".png", ".jpg", ".jpeg", ".webp", ".bmp", ".gif"]
    }
  });

  const acceptedFileItems = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
      <ul>
        {errors.map(e => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </li>
  ));

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
    <div className="py-24 max-w-xl min-h-screen mx-auto flex flex-col justify-center items-center gap-y-32">
      <div className="flex flex-col gap-2 items-center">
        <h1 className="font-semibold text-primary text-xl md:text-2xl lg:text-3xl">File Converter</h1>
        <p>Convert your images to any supported format.</p>
      </div>


      <div {...dropzone.getRootProps({ className: "border border-dotted border-neutral-400 p-24 text-neutral-400 cursor-pointer flex flex-col items-center justify-center gap-6" })}>
        <input
          {...dropzone.getInputProps()}
        // className="border border-neutral-300 px-4 py-2"
        // type="file"
        // accept="image/jpeg"
        // onChange={e => setUpload(e.target.files ? e.target.files[0] : undefined)}
        />

        <ImageUp className="size-24 text-neutral-300" />

        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>

      <aside>
        <h4>Accepted files</h4>
        <ul>{acceptedFileItems}</ul>
        <h4>Rejected files</h4>
        <ul>{fileRejectionItems}</ul>
      </aside>

      {/* Global Drag aware overlay */}
      {/* {dropzone.isDragGlobal && !dropzone.isDragActive && <div className="overlay">Drop files anywhere on this page...</div>} */}
      {
        dropzone.isDragGlobal && !dropzone.isDragActive && (
          <div className="absolute inset-0 backdrop-blur-md flex flex-col items-center justify-center">
            <div className="text-center p-32 bg-white w-11/12 md:w-2/3 lg:w-1/2">
              Drop files anywhere on this page...
            </div>
            {dropzone.isDragReject && (
              <p className="text-red-500 px-4 py-2 bg-red-500/10 border border-red-500">Some files will be rejected</p>
            )}
          </div>
        )
      }

      {/* <section className="container"> */}
      {/*   <div {...getRootProps({ className: "dropzone" })}> */}
      {/*     <input {...getInputProps()} /> */}
      {/*     <p>Drag 'n' drop some files here, or click to select files</p> */}
      {/*   </div> */}
      {/*   <aside> */}
      {/*     <h4>Files</h4> */}
      {/*     <ul>{files}</ul> */}
      {/*   </aside> */}
      {/* </section> */}

      {/* <div> */}
      {/*   {dropzone.isDragGlobal && !dropzone.isDragActive && <div className="overlay">Drop files anywhere on this page...</div>} */}
      {/*   <div {...dropzone.getRootProps({ className: "border border-dotted border-neutral-600" })} className=""> */}
      {/*     <input {...dropzone.getInputProps()} /> */}
      {/*     {dropzone.isDragGlobal && !dropzone.isDragActive && <p>🌐 Drag detected on page!</p>} */}
      {/*     {dropzone.isDragAccept && <p>✅ Drop to upload these files</p>} */}
      {/*     {dropzone.isDragReject && <p>❌ Some files will be rejected</p>} */}
      {/*   </div> */}
      {/* </div> */}

      <Button onClick={handleConvertToPng}>Convert to PNG</Button>
    </div >
  )
}

