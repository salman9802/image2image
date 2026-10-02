import { TbFileTypePng } from "react-icons/tb";

export { cn } from "cn";

/** Util fn for downloading a Blob object as a file with given name */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);

  try {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
  } catch (error) {
    // NOTE: might do something later
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Converts given file size (in bytes) to human readable format */
export function formatFileSize(filesize: number) {
  if (filesize === 0) return "0 bytes";

  const units = ["bytes", "KB", "MB", "GB", "TB"];

  /* This is change-of-base formula:
   *      log_1024(bytes) = log(bytes) / log(1024)
   * Here: log_1024 means log with base 1024
   * This helps us answer the question: "How many times does 1024 fit as a power into bytes?"
   */
  let logBase1024 = Math.log(filesize) / Math.log(1024);
  logBase1024 = Math.floor(logBase1024); // We will use it as the index of `units[]`

  const maxHoldingUnit = units[logBase1024];

  const remainingBytes = (filesize / Math.pow(1024, logBase1024)).toFixed(2);

  return `${remainingBytes} ${maxHoldingUnit}`;
}

export function fileIcon(mimeType: string) {
  switch (mimeType) {
    case "image/png":
      return <TbFileTypePng />;
    case "image/png":
      break;
    case "image/png":
      break;
    case "image/png":
      break;
    case "image/png":
      break;
    case "image/png":
      break;
    case "image/png":
      break;
    case "image/png":
      break;
    case "image/png":
      break;
    default:
      break;
  }
}
