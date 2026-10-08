"use client";

import { cn, downloadBlob, fileIcon, formatFileSize } from "@/lib/utils";
import { ArrowRight, ChevronDown, X } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverTitle, PopoverDescription, } from "../ui/popover";
import { Button } from "../ui/button";
import { SUPPORTED_FORMAT_CONFIGS, TFormatConfig } from "@/lib/formats";
import React from "react";
import { useConvert } from "@/contexts/convert";
import { IoMdDownload } from "react-icons/io";
import AnimatedProcessing from "./AnimatedProcessing";

type TConvertUploadItemProps = {
  // state: TConvertComponentState;
  uploadId: string;
  // upload: File;
  onFormatSelect: (mimeType: string) => any;
  // removeUpload: () => any;
  // startConversion: () => any;
}
export default function ConvertUploadItem({ uploadId, onFormatSelect }: TConvertUploadItemProps) {
  const context = useConvert();

  const upload = context.getUploadById(uploadId);

  if (upload == null) return null;

  const mimeType = upload.file.type;

  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [targetFormatConfig, setTargetFormatConfig] = React.useState<TFormatConfig>();
  React.useEffect(() => {
    if (upload.targetFormatConfig)
      setTargetFormatConfig(upload.targetFormatConfig);
  }, [upload.targetFormatConfig]);

  React.useEffect(() => {
    if (targetFormatConfig) {
      context.setUploadTargetFormatConfig(uploadId, targetFormatConfig);

      onFormatSelect(targetFormatConfig.mimeTypes[0]);
      // context.setUploadState(uploadId, "ready");
      setPopoverOpen(false);
    }
  }, [targetFormatConfig]);

  React.useEffect(() => {
    if (context.state === "processing" && upload.state === "ready") {
      context.setUploadState(uploadId, "processing");
      (async () => {
        if (targetFormatConfig == undefined) throw new Error("Error: no target format selected for one of the uploads.");

        // const blob = await convertToImage(upload.file, upload.sourceFormatConfig, targetFormatConfig);
        const worker = new Worker(new URL("./../../web-worker/converter.worker.ts", import.meta.url));

        // worker.postMessage({ upload, targetFormatConfig });

        worker.postMessage({
          file: upload.file,
          sourceFormatConfigId: upload.sourceFormatConfig.id,
          targetFormatConfigId: targetFormatConfig.id
        });

        worker.onerror = (ev) => {
          // TOOD: "error" state in S.M.
          // console.error(ev.message);
          worker.terminate();
        };

        worker.onmessage = ev => {
          if (ev.data.success) {
            context.setUploadConvertedBlob(uploadId, ev.data.blob);
            context.setUploadState(uploadId, "finished");
          } else {
            // TODO: new error state in S.M.
            context.setUploadState(uploadId, "error");
            console.error(ev.data.error)
          }
          worker.terminate();
        }

        // context.setUploadConvertedBlob(uploadId, blob);
        // context.setUploadState(uploadId, "finished");
      })();
    }
  }, [context.state]);

  return (
    <div className="bg-white dark:bg-neutral-900 flex flex-wrap justify-between items-center px-6 py-4 gap-4 sm:gap-0">
      {/* Icon + Name */}
      <div className="flex-1 flex flex-col gap-2">
        {/* <File className="size-4" /> */}
        <div className="flex items-center gap-2">
          {fileIcon(mimeType)}
          <span className="max-w-[10ch] break-all wrap-break-word">{upload.file.name}</span>
        </div>
        <div className="text-xs flex items-end gap-x-2">
          <span className="font-mono">{upload.file.type}</span>
          <div className="self-center size-1 bg-neutral-600" />
          <span className="tabular-nums">{formatFileSize(upload.file.size)}</span>
        </div>

      </div>

      {/* to dropdown */}
      <div className="flex-1 flex items-center gap-4">
        {/* <span className="text-neutral-600">to</span> */}
        <ArrowRight className="text-neutral-400" />
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger render={<Button variant="outline" className={cn("border-primary text-primary",
            targetFormatConfig && "bg-primary/15 border-none")} />}>
            {
              targetFormatConfig
                ? <span>{targetFormatConfig.extensions[0]}</span>
                : <span>format</span>
            }
            <ChevronDown />
          </PopoverTrigger>
          <PopoverContent>
            <PopoverHeader>
              <PopoverTitle>Supported Formats:</PopoverTitle>
              <PopoverDescription>Select the format to convert this file to</PopoverDescription>
            </PopoverHeader>

            <div className="flex flex-wrap gap-x-4 gap-y-3">
              {SUPPORTED_FORMAT_CONFIGS.filter(config => !config.mimeTypes.includes(upload.file.type)).map((supportedFormatConfig, i) => (
                <p onClick={() => setTargetFormatConfig(supportedFormatConfig)} key={i} className="cursor-pointer bg-primary/15 px-4 py-2 text-primary font-mono">
                  {supportedFormatConfig.extensions[0]}
                  {/* {supportedFormatConfig.extensions.reduce((prev, curr) => `${ prev } / ${ curr }`, "").slice(0)} */}
                </p>
              ))}
            </div>

          </PopoverContent>
        </Popover>
      </div>

      {/* state */}
      <span className={cn("flex-1 uppercase text-center font-semibold",
        {
          "text-orange-500": upload.state === "waiting",
          "text-amber-400": upload.state === "processing",
          "text-primary": upload.state === "ready",
          "text-green-500": upload.state === "finished",
          "text-red-500": upload.state === "error"
        }
      )}>{
          upload.state === "processing"
            ? <AnimatedProcessing />
            : upload.state
        }</span>

      {/* filesize */}
      {/* <span className="flex-1 tabular-nums">{formatFileSize(upload.file.size)}</span> */}

      {/* 'X' remove. might require cb() */}
      {
        upload.state === "finished"
          ? (
            <IoMdDownload
              onClick={() => {
                if (upload.convertedBlob && targetFormatConfig) {
                  const filename = upload.file.name.split(".").slice(0, -1).join(".");
                  downloadBlob(upload.convertedBlob, `${filename}.${targetFormatConfig.extensions[0]}`);
                } else {
                  alert("Something went wrong. Please refresh the page and try again.");
                }
              }} className="size-5 cursor-pointer text-primary lg:size-8" />
            // {/* <span>Download</span> */}
          )
          : (
            <X onClick={() => context.removeUpload(uploadId)} className="size-5 cursor-pointer text-neutral-600" />
          )
      }
    </div>
  );
}

