"use client";

import { cn, downloadBlob, fileIcon, formatFileSize } from "@/lib/utils";
import { ChevronDown, X } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverTitle, PopoverDescription, } from "../ui/popover";
import { Button } from "../ui/button";
import { FORMATS, SUPPORTED_FORMAT_CONFIGS, TFormatConfig } from "@/lib/formats";
import React from "react";
import { TConvertComponentState } from "@/types/convert.type";
import { convertToImage } from "@/lib/convert";

type TConvertUploadItemProps = {
  state: TConvertComponentState;
  upload: File;
  onFormatSelect: (mimeType: string) => any;
  removeUpload: () => any;
  // startConversion: () => any;
}
export default function ConvertUploadItem({ state, upload, onFormatSelect, removeUpload }: TConvertUploadItemProps) {
  const mimeType = upload.type;

  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [selectedFormatConfig, setSelectedFormatConfig] = React.useState<TFormatConfig>();
  const [output, setOutput] = React.useState<Blob>();

  React.useEffect(() => {
    if (selectedFormatConfig) {
      onFormatSelect(selectedFormatConfig.mimeTypes[0]);
      setPopoverOpen(false);
    }
  }, [selectedFormatConfig]);

  React.useEffect(() => {
    if (state === "processing") {
      (async () => {
        if (selectedFormatConfig == undefined) throw new Error("Error: no target format selected for one of the uploads.");

        const sourceFormatConfig = Object.keys(FORMATS).filter(format => FORMATS[format].mimeTypes.includes(upload.type)).map(format => FORMATS[format])[0];

        const blob = await convertToImage(upload, sourceFormatConfig, selectedFormatConfig);
        setOutput(blob);
        const filename = upload.name.split(".").slice(-1).join(".");
        downloadBlob(blob, `${filename}.${selectedFormatConfig.extensions[0]}`);
      })();
    }
  }, [state]);

  return (
    <div className="bg-white flex justify-between items-center px-6 py-4">
      {/* Icon + Name */}
      <div className="flex-1 flex gap-2 items-center">
        {fileIcon(mimeType)}
        {/* <File className="size-4" /> */}
        <span>{upload.name}</span>
      </div>

      {/* to dropdown */}
      <div className="flex-1 flex items-center gap-4">
        <span className="text-neutral-600">to</span>
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger render={<Button variant="outline" className={cn("border-primary text-primary",
            selectedFormatConfig && "bg-primary/5 border-none")} />}>
            {
              selectedFormatConfig
                ? <span>{selectedFormatConfig.extensions[0]}</span>
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
              {SUPPORTED_FORMAT_CONFIGS.map((supportedFormatConfig, i) => (
                <p onClick={() => setSelectedFormatConfig(supportedFormatConfig)} key={i} className="cursor-pointer bg-primary/5 px-4 py-2 text-primary font-mono">
                  {supportedFormatConfig.extensions[0]}
                  {/* {supportedFormatConfig.extensions.reduce((prev, curr) => `${ prev } / ${ curr }`, "").slice(0)} */}
                </p>
              ))}
            </div>

          </PopoverContent>
        </Popover>
      </div>

      {/* filesize */}
      <span className="flex-1 tabular-nums">{formatFileSize(upload.size)}</span>

      {/* 'X' remove. might require cb() */}
      <X onClick={removeUpload} className="size-5 cursor-pointer text-neutral-600" />
    </div>
  );
}

