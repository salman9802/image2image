import { fileIcon, formatFileSize } from "@/lib/utils";
import { X } from "lucide-react";

type TConvertUploadItemProps = {
  upload: File;
  removeUpload: () => any;
}
export default function ConvertUploadItem({ upload, removeUpload }: TConvertUploadItemProps) {
  const mimeType = upload.type;

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

      {/* filesize */}
      <span className="flex-1 tabular-nums">{formatFileSize(upload.size)}</span>

      {/* 'X' remove. might require cb() */}
      <X onClick={removeUpload} className="size-5 cursor-pointer text-neutral-600" />
    </div>
  );
}

