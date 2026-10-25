"use client";

import ConvertUploadItem from "@/components/convert/ConvertUploadItem";
import { ResponsiveTooltip } from "@/components/ResponsiveTooltip";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { TConvertUploadItem, useConvert } from "@/contexts/convert";
import { trackEvent } from "@/lib/analytics";
import { ACCEPTED_FORMAT_CONFIGS, detectFormat, DROPZONE_ACCEPTED_FILES, SUPPORTED_FORMAT_CONFIGS, TFormatConfig } from "@/lib/formats";
import { cn, downloadBlob } from "@/lib/utils";
import JSZip from "jszip";
import { ChevronDown, ChevronDownIcon, CloudDownload, FolderArchive, ImageUp, X } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import { CgArrowsExchange, CgSpinner } from "react-icons/cg";
import { FaFileUpload } from "react-icons/fa";
import { FaDownload } from "react-icons/fa";


export function ConvertView() {
  const context = useConvert();

  const handleDrop = React.useCallback((acceptedFiles: File[]) => {
    const uploadItems: TConvertUploadItem[] = [];

    acceptedFiles.map((acceptedFile, i) => {
      // console.log({ "acceptedFile.type": acceptedFile.type })
      // const sourceFormatConfig = getFormatConfigByMimeType(acceptedFile.type);
      const sourceFormatConfig = detectFormat(acceptedFile);
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

  const handleConvert = () => {
    if (context.state === "finished") {
      const finishedUploads = context.uploads.filter(u => u.state === "finished" && u.convertedBlob);
      finishedUploads.map(upload => {
        const filename = upload.file.name.split(".").slice(0, -1).join(".");
        downloadBlob(upload.convertedBlob!, `${filename}.${upload.targetFormatConfig?.extensions[0]}`);
        trackEvent("file_exported", {
          format: upload.targetFormatConfig?.label ?? "",
          tool: "image_converter"
        });
      });
      context.setUploads([]);

      // context.setState("idle");
      return;
    } else {
      context.setState("processing");
    }
  }

  const handleDownloadZip = async () => {
    if (context.state === "finished") {
      const finishedUploads = context.uploads.filter(u => u.state === "finished" && u.convertedBlob);
      const zip = new JSZip();
      finishedUploads.map(upload => {
        const filename = upload.file.name.split(".").slice(0, -1).join(".");
        // downloadBlob(upload.convertedBlob!, `${filename}.${upload.targetFormatConfig?.extensions[0]}`);
        zip.file(`${filename}.${upload.targetFormatConfig?.extensions[0]}`, upload.convertedBlob!);
        trackEvent("file_exported_zip", {
          format: upload.targetFormatConfig?.label ?? "",
          tool: "image_converter"
        });
      });
      const zipBlob = await zip.generateAsync({ type: "blob" });
      downloadBlob(zipBlob, "image2image-converted.zip");
      context.setUploads([]);
    }
  }

  // ========================= All Upload Target Selection =========================
  const [allUploadsTargetCollapsibleOpen, setAllUploadsTargetCollapsibleOpen] = React.useState(false);
  const handleAllUploadTargetSelection = (targetFormatConfig: TFormatConfig) => {
    const uploads = [...context.uploads];
    for (let i = 0; i < uploads.length; i++) {
      uploads[i].targetFormatConfig = targetFormatConfig;
      uploads[i].state = "ready";
    }
    context.setUploads(uploads);
    setAllUploadsTargetCollapsibleOpen(false);
  }

  return (
    <div className="py-24 w-11/12 max-w-xl  min-h-screen mx-auto flex flex-col justify-center items-center gap-y-12 md:max-w-2xl lg:max-w-3xl">
      <div className="flex flex-col gap-2 items-center">
        <div className="p-1 bg-primary/15">
          <CgArrowsExchange className="size-8 text-primary" />
        </div>
        <h1 className="font-semibold text-primary text-xl md:text-2xl lg:text-3xl">File Converter</h1>
        <p>Convert your images to any supported format.</p>
      </div>

      <div className="flex flex-col gap-4 items-start md:flex-row">
        <h2 className="font-semibold uppercase text-muted-foreground text-sm px-4 py-2">Accepts</h2>
        <div className="flex flex-wrap gap-x-4 gap-y-3">
          {ACCEPTED_FORMAT_CONFIGS.map((supportedFormatConfig, i) => (
            <div key={i} style={{
              boxShadow: "inset 0 1px 2px #ffffff50, 0 2px 4px #00000030, 0 4xp 8px #00000015"
            }} className="px-4 py-2 bg-primary/15 border border-primary/40 flex items-center gap-2">
              <p className="text-primary font-mono">
                {supportedFormatConfig.extensions[0]}
              </p>
              {supportedFormatConfig.downloadRequiredForDecode && (
                <ResponsiveTooltip content={"Downloads a converter the first time you use it."}>
                  <CloudDownload className="size-4 text-primary" strokeWidth={3} />
                </ResponsiveTooltip>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Uploads */}
      {
        (context.uploads && context.uploads.length > 0)
          ? (
            <div className="w-full flex flex-col gap-2">
              <div className="flex flex-col justify-between items-start sm:flex-row">
                <div className="flex flex-col">
                  <p className="tabular-nums font-semibold text-lg text-primary md:text-xl">{context.uploads.length} Files {context.state === "finished" ? "converted" : ""}</p>
                  <p className="text-sm">{
                    context.state === "idle"
                      ? `${context.uploads.filter(u => u.state === "ready").length} of ${context.uploads.length} ready.`
                      : context.state === "finished"
                        ? "Finished conversions. Files ready to download."
                        : "All set ready to convert."
                  }</p>
                </div>
                <div className="flex items-center">
                  <Button variant="ghost" onClick={() => context.setUploads([])}>Clear all</Button>
                  <div className="flex items-center gap-2">
                    {/* <span>Set all to</span> */}
                    <Collapsible open={allUploadsTargetCollapsibleOpen} onOpenChange={setAllUploadsTargetCollapsibleOpen}>
                      <CollapsibleTrigger render={
                        <Button variant="ghost" className="w-full">
                          Convert all to
                          <ChevronDownIcon className="ml-auto group-data-panel-open/button:rotate-180" />
                        </Button>
                      } />
                      <CollapsibleContent className="p-2 mb-2 flex flex-wrap gap-x-4 gap-y-3">
                        {SUPPORTED_FORMAT_CONFIGS.map((supportedFormatConfig, i) => (
                          <p onClick={() => handleAllUploadTargetSelection(supportedFormatConfig)} key={i} className="cursor-pointer bg-primary/15 px-4 py-2 text-primary font-mono">
                            {supportedFormatConfig.extensions[0]}
                            {/* {supportedFormatConfig.extensions.reduce((prev, curr) => `${ prev } / ${ curr }`, "").slice(0)} */}
                          </p>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </div>
              </div>

              <div className="bg-accent w-full p-6 flex flex-col gap-6">
                {context.uploads.map(upload => <ConvertUploadItem
                  key={upload.id}
                  uploadId={upload.id}
                  onFormatSelect={() => {
                    // TODO: 
                  }}
                />
                )}
              </div>
            </div>
          )
          : null
      }

      <div className="w-full flex flex-col gap-2">
        <div {...dropzone.getRootProps({
          className: cn("w-full border border-dotted border-neutral-400 text-neutral-600 dark:text-neutral-200 cursor-pointer flex flex-col items-center justify-center gap-6 p-6 md:p-12 lg:p-24 ",

            "hover:bg-accent",

            // Keyboard focus
            dropzone.isFocused && "border-primary bg-primary/15",
            // Valid file being dragged over
            dropzone.isDragAccept && "border-primary bg-primary/15",
            // Invalid file being dragged over
            dropzone.isDragReject && "border-destructive bg-destructive/10",

            context.uploads.length !== 0 && "h-25 gap-3"
          )
        })}>
          <input
            {...dropzone.getInputProps()}
          />

          <div className="p-1 bg-primary/15">
            <ImageUp className="size-12 text-primary" />
          </div>

          <p>Drag 'n' drop some files here</p>
          <p>or</p>
          <span className="text-primary">Click to select files from you device</span>
        </div>
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
      <div className="w-full flex flex-col gap-2">
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
                    <div className="w-full flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <FaDownload />
                        <span>Download all</span>
                      </div>
                    </div>
                  )
            }
          </Button>

          {context.state === "finished" && (
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="default" size="icon" className="rounded-l-none border-l border-primary-foreground/20" />}>
                <ChevronDown />
                <span className="sr-only">More save options</span>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDownloadZip}>
                  <FolderArchive />
                  Download as Zip
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className="flex flex-col items-center">
          <p className="text-sm">All conversions happen locally in your browser.</p>
          <p className="text-sm">Uploads never leave you system.</p>
        </div>
      </div>

      {/* Global Drag aware overlay */}
      {
        dropzone.isDragGlobal && !dropzone.isDragActive && (
          <div {...globalDropzone.getRootProps({
            className: "fixed inset-0 backdrop-blur-md flex flex-col items-center justify-center bg-primary/15"
          })}>
            <input {...globalDropzone.getInputProps()} />
            <div className="flex flex-col items-center gap-6 bg-white/30 p-32 w-11/12 md:w-2/3 lg:w-1/2">
              <FaFileUpload className="size-12 text-primary/70" />
              <div className="text-center text-neutral-600 dark:text-neutral-200">
                Drop files anywhere on this page...
              </div>

              {dropzone.isDragReject && (
                <p className="text-red-500 px-4 py-2 bg-red-500/10 border border-red-500">Some files will be rejected</p>
              )}
            </div>
          </div>
        )
      }
    </div>
  )
}
