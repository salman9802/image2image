export { cn } from "cn"

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
