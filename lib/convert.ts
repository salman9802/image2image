import { TConvertParams } from "@/types/convert.type";
import { drawToCanvas, FORMATS, TFormatConfig } from "./formats";



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

export function getFormatConfigByMimeType(mimeType: string) {
  const sourceFormatConfigs = Object.keys(FORMATS).filter(format => FORMATS[format].mimeTypes.includes(mimeType)).map(format => FORMATS[format]);

  if (sourceFormatConfigs.length > 0)
    return sourceFormatConfigs[0];
  else
    return null;
}

export async function convertToImage(file: File, source: TFormatConfig, target: TFormatConfig, quality?: number) {
  if (source.decode === undefined) throw new Error("Error: Failed to decode source file in convertToImage()");
  if (target.encode === undefined) throw new Error("Error: Failed to encode target file in convertToImage()");
  const decoded = await source.decode(file);
  const canvas = drawToCanvas(decoded);
  return target.encode(canvas, quality);
}
