import { TConvertParams } from "@/types/convert.type";



export async function convert({ file, targetFormat, quality }: TConvertParams) {
  try {
    const bitmap = await createImageBitmap(file);
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext("2d");
    if (ctx == null) return null;
    ctx.drawImage(bitmap, 0, 0);

    const blob = await canvas.convertToBlob({
      type: `image/${targetFormat}`,
      quality: quality ?? 0.92
    });

    return blob;
  } catch (error: any) {
    if (error instanceof Error) return error;
    return new Error("Error: in convert() ", error);
  }
}
