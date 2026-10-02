import { fileIcon, formatFileSize } from "@/lib/utils";

type TConvertUploadItemProps = {
  upload: File;
}
export default function ConvertUploadItem({ upload }: TConvertUploadItemProps) {
  const mimeType = upload.type;

  return (
    <div className="bg-black/5 flex justify-between px-4 py-2">
      {/* Icon + Name */}
      <div className="flex gap-2 items-center">
        {/* TODO: helper to determine icon based on file mimeType */}
        {fileIcon(mimeType)}
        {/* <File className="size-4" /> */}
        <span>{upload.name}</span>
      </div>

      {/* to dropdown */}

      {/* filesize */}
      <span className="tabular-nums">{formatFileSize(upload.size)}</span>

      {/* 'X' remove. might require cb() */}
    </div>
  );
}

