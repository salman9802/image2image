import { TbFileTypePng } from "react-icons/tb";

export { cn } from "cn";

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
