"use client";

import ConvertUploadItem from "@/components/convert/ConvertUploadItem";
import { Button } from "@/components/ui/button";
import { ConvertContextProvider, TConvertUploadItem, useConvert } from "@/contexts/convert";
import { convert, getFormatConfigByMimeType } from "@/lib/convert";
import { DROPZONE_ACCEPTED_FILES } from "@/lib/formats";
import { cn, downloadBlob, fileIcon } from "@/lib/utils";
import { TConvertComponentState } from "@/types/convert.type";
import { Check, File, ImageUp, Upload, X } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import { CgSpinner } from "react-icons/cg";
import { FaFileUpload } from "react-icons/fa";
import { FaDownload } from "react-icons/fa";

export default function Page() {

  const context = useConvert();

  // const [state, setState] = React.useState<TConvertComponentState>("idle");

  // const [uploads, setUploads] = React.useState<File[]>();

  const handleDrop = React.useCallback((acceptedFiles: File[]) => {
    const uploadItems: TConvertUploadItem[] = [];

    acceptedFiles.map((acceptedFile, i) => {
      const sourceFormatConfig = getFormatConfigByMimeType(acceptedFile.type);
      if (sourceFormatConfig == null) {
        alert(`File '${acceptedFile.name}' isn't supported`);
      } else {
        uploadItems.push({
          id: crypto.randomUUID(),
          file: acceptedFile,
          sourceFormatConfig,
          state: "waiting",
          convertedBlob: null
        });
      }
    });

    context.setUploads(prev => [...prev, ...uploadItems]);
    context.setState("idle");
    // context.setUploads(acceptedFiles);
  }, []);

  const dropzone = useDropzone({
    accept: DROPZONE_ACCEPTED_FILES,
    onDrop: handleDrop
  });

  const globalDropzone = useDropzone({
    accept: DROPZONE_ACCEPTED_FILES,
    onDrop: handleDrop
  });

  const acceptedFileItems = dropzone.acceptedFiles.map(file => (
    <div key={file.path} className="px-4 py-2 border border-green-500 bg-green-500/30 flex items-center gap-2">
      <Check className="text-white fill-green-500" />
      <div className="">
        <p className="font-semibold text-lg">{file.path}</p>
        <p className="text-sm text-muted">{file.size} bytes</p>
      </div>
      {file.path} - {file.size} bytes
    </div>
  ));

  const fileRejectionItems = dropzone.fileRejections.map(({ file, errors }) => (
    <div key={file.path} className="px-4 py-2 border border-red-500 bg-red-500/30 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <X className="text-red-500" />
        <div className="">
          <p className="font-semibold text-lg">{file.path}</p>
          <p className="text-sm text-neutral-800">{file.size} bytes</p>
        </div>
      </div>
      <div>
        {errors.map(e => (
          <span key={e.code} className=" text-red-500"><span className="font-semibold">Error:</span> {e.message}</span>
        ))}
      </div>
    </div>
  ));

  // const handleConvertToPng = async () => {
  //   if (!upload) {
  //     alert("No Upload found");
  //     return;
  //   }
  //
  //   const blob = await convert({
  //     file: upload,
  //     targetFormat: "png",
  //   });
  //   if (blob instanceof Blob)
  //     downloadBlob(blob, "convert-png.png");
  //   else {
  //     alert("Couldn't convert file See console for errors");
  //     console.error(blob);
  //   }
  // }

  const handleConvert = () => {
    context.setState("processing");
  }

  return (
    <div className="py-24 w-11/12 max-w-xl  min-h-screen mx-auto flex flex-col justify-center items-center gap-y-12 md:max-w-2xl lg:max-w-3xl">
      <div className="flex flex-col gap-2 items-center">
        <h1 className="font-semibold text-primary text-xl md:text-2xl lg:text-3xl">File Converter</h1>
        <p>Convert your images to any supported format.</p>
      </div>

      {/* Uploads */}
      {
        (context.uploads && context.uploads.length > 0)
          ? (
            <div className="bg-black/5 w-full p-6 flex flex-col gap-6">
              {context.uploads.map(upload => <ConvertUploadItem
                key={upload.id}
                uploadId={upload.id}
                onFormatSelect={() => {
                  // TODO: 
                }}
              />
              )}
            </div>
          )
          : null
      }

      <div {...dropzone.getRootProps({
        className: cn("w-full border border-dotted border-neutral-400 p-24 text-neutral-400 cursor-pointer flex flex-col items-center justify-center gap-6",
          // Keyboard focus
          dropzone.isFocused && "border-primary bg-primary/5",
          // Valid file being dragged over
          dropzone.isDragAccept && "border-primary bg-primary/5",
          // Invalid file being dragged over
          dropzone.isDragReject && "border-destructive bg-destructive/10",
        )
      })}>
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

      {/* <h4>Accepted files</h4> */}
      {/* <div className="flex flex-col gap-2">{acceptedFileItems}</div> */}

      {/* File Rejections */}
      {fileRejectionItems.length > 0 && (
        <aside className="flex flex-col gap-4">
          <h4 className="border-l-2 border-red-500 pl-4 font-semibold text-lg md:text-xl">Rejected files</h4>
          <div className="flex flex-col gap-2">{fileRejectionItems}</div>
        </aside>
      )}

      {/* Convert Button */}
      <div className="w-full flex items-center justify-center">
        <Button disabled={["idle", "processing"].includes(context.state)} onClick={handleConvert} className="flex-1">
          {
            ["idle", "pending"].includes(context.state)
              ? <span>Convert</span>
              : context.state === "processing"
                ? (
                  <>
                    <CgSpinner className="animate-spin" />
                    <span>Processing...</span>
                  </>
                )
                : (
                  <>
                    <FaDownload />
                    <span>Download all</span>
                  </>
                )
          }
        </Button>
      </div>

      {/* Global Drag aware overlay */}
      {
        dropzone.isDragGlobal && !dropzone.isDragActive && (
          <div {...globalDropzone.getRootProps({
            className: "absolute inset-0 backdrop-blur-md flex flex-col items-center justify-center bg-primary/10"
          })}>
            <input {...globalDropzone.getInputProps()} />
            <div className="flex flex-col items-center gap-6 bg-white/50 p-32 w-11/12 md:w-2/3 lg:w-1/2">
              <FaFileUpload className="size-12 text-primary/70" />
              <div className="text-center text-neutral-600">
                Drop files anywhere on this page...
              </div>

              {dropzone.isDragReject && (
                <p className="text-red-500 px-4 py-2 bg-red-500/10 border border-red-500">Some files will be rejected</p>
              )}
            </div>
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

      {/* <Button onClick={handleConvertToPng}>Convert to PNG</Button> */}
    </div>
  )
}
