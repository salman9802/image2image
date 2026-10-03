"use client";

import { fileIcon, formatFileSize } from "@/lib/utils";
import { ChevronDown, X } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverTitle, PopoverDescription, } from "../ui/popover";
import { Button } from "../ui/button";
import { SUPPORTED_FORMAT_CONFIGS, TFormatConfig } from "@/lib/formats";
import React from "react";

type TConvertUploadItemProps = {
  upload: File;
  onFormatSelect: (mimeType: string) => any;
  removeUpload: () => any;
}
export default function ConvertUploadItem({ upload, onFormatSelect, removeUpload }: TConvertUploadItemProps) {
  const mimeType = upload.type;

  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const [selectedFormatConfig, setSelectedFormatConfig] = React.useState<TFormatConfig>();

  React.useEffect(() => {
    if (selectedFormatConfig) {
      onFormatSelect(selectedFormatConfig.mimeTypes[0]);
      setPopoverOpen(false);
    }
  }, [selectedFormatConfig]);

  return (
    <div className="bg-black/5 flex justify-between items-center px-4 py-2">
      {/* Icon + Name */}
      <div className="flex-1 flex gap-2 items-center">
        {/* TODO: helper to determine icon based on file mimeType */}
        {fileIcon(mimeType)}
        {/* <File className="size-4" /> */}
        <span>{upload.name}</span>
      </div>

      {/* to dropdown */}
      <div className="flex-1 flex items-center gap-4">
        <span className="text-neutral-600">to</span>
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger render={<Button variant="outline" className="bg-primary/5 border-primary" />}>
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
                  {/* {supportedFormatConfig.extensions.reduce((prev, curr) => `${prev}/${curr}`, "").slice(0)} */}
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

