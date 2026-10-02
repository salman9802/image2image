/*
 * Central config for image format support: decode/encode capability,
 * MIME/extension detection and dropdown filtering.
 */

// A decoded image is either what the browser natively decoded (ImageBitmap)
// or raw pixels handed back by a custom decoder (ImageData) — canvas accepts both.
export type TDecodedImage = ImageBitmap | ImageData;


export type TDecoder = (file: File) => Promise<TDecodedImage>;
export type TEncoder = (canvas: OffscreenCanvas, quality?: number) => Promise<Blob>;

export interface TFormatConfig {
  id: string;
  label: string;                                    // for UI, e.g. "JPEG"
  extensions: string[];                             // all known extensions e.g. ["jpg", "jpeg"]
  mimeTypes: string[];                              // all known MIME types, [] if browser gives none
  encode?: TEncoder;                                // present = usable as input
  decode?: TDecoder;                                // present = usable as output
  supportsQuality?: boolean;                        // show a quality slider for this output?
}

// ========================= Canvas-based decode/encode =========================
// covers all natively-supported formats

export const canvasDecode: TDecoder = (file) => createImageBitmap(file);

export const canvasEncode = (mimeType: string): TEncoder => (canvas, quality) => canvas.convertToBlob({ type: mimeType, quality });


export function drawToCanvas(decoded: TDecodedImage): OffscreenCanvas {
  const canvas = new OffscreenCanvas(decoded.width, decoded.height);
}



