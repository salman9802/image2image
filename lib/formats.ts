/*
 * Central config for image format support: decode/encode capability,
 * MIME/extension detection and dropdown filtering.
 */


import { encode as avifEncode, decode as avifDecode } from "@jsquash/avif";


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
  encode?: TEncoder;                                // present = usable as output
  decode?: TDecoder;                                // present = usable as input
  supportsQuality?: boolean;                        // show a quality slider for this output?
}

// ========================= Canvas-based decode/encode =========================
// covers all natively-supported formats

export const canvasDecode: TDecoder = (file) => createImageBitmap(file);

export const canvasEncode = (mimeType: string): TEncoder => (canvas, quality) => canvas.convertToBlob({ type: mimeType, quality });


// Draws either an ImageBitmap or raw ImageData onto a fresh canvas.
export function drawToCanvas(decoded: TDecodedImage): OffscreenCanvas {
  const canvas = new OffscreenCanvas(decoded.width, decoded.height);
  const ctx = canvas.getContext("2d");
  if (ctx == null) throw new Error("Error: Failed to retrieve canvas context in drawToCanvas()");
  if (decoded instanceof ImageData) {
    ctx.putImageData(decoded, 0, 0);
  } else {
    ctx.drawImage(decoded, 0, 0);
  }
  return canvas;
}


// ========================= Format Configuration Registry =========================

export const FORMATS: Record<string, TFormatConfig> = {
  jpeg: {
    id: "jpeg",
    label: "JPEG",
    extensions: ["jpg", "jpeg"],
    mimeTypes: ["image/jpeg"],
    decode: canvasDecode,
    encode: canvasEncode("image/jpeg"),
    supportsQuality: true,
  },
  png: {
    id: "png",
    label: "PNG",
    extensions: ["png"],
    mimeTypes: ["image/png"],
    decode: canvasDecode,
    encode: canvasEncode("image/png"),
    supportsQuality: true
  },
  webp: {
    id: "webp",
    label: "WebP",
    extensions: ["webp"],
    mimeTypes: ["image/webp"],
    decode: canvasDecode,
    encode: canvasEncode("image/webp"),
    supportsQuality: true,
  },
  bmp: {
    id: "bmp",
    label: "BMP",
    extensions: ["bmp"],
    mimeTypes: ["image/bmp"],
    decode: canvasDecode,
    // no encode, BMP is input-only here
  },
  gif: {
    id: "gif",
    label: "GIF",
    extensions: ["gif"],
    mimeTypes: ["image/gif"],
    decode: canvasDecode,
    // no encode, static-frame-only, no animated GIF support in MVP
  },
  avif: {
    id: "avif",
    label: "AVIF",
    extensions: ["avif"],
    mimeTypes: ["image/avif"],
    // NOTE: avif decode works with `ArrayBuffer` not `Blob`
    decode: (file) => file.arrayBuffer().then(avifDecode),
    encode: async (canvas, quality) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Error: Failed to retrieve canvas context in avif encode()");
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const avifArrayBuffer = await avifEncode(imageData, { quality, lossless: true });

      return new Blob([avifArrayBuffer], { type: "image/avif" });
    },
    supportsQuality: true,
  }
} as const;


export const DROPZONE_ACCEPTED_FILES = Object.keys(FORMATS).filter(format => FORMATS[format].decode !== undefined).map(format => {
  const formatConfig = FORMATS[format];
  let acceptedFiles: any = {};
  formatConfig.mimeTypes.map(mimeType => acceptedFiles[mimeType] = formatConfig.extensions.map(ext => `.${ext}`));

  return acceptedFiles;
});

export const SUPPORTED_FORMAT_CONFIGS = Object.keys(FORMATS).filter(format => FORMATS[format].encode !== undefined).map(format => FORMATS[format]);


export const ACCEPTED_FORMAT_CONFIGS = Object.keys(FORMATS).filter(format => FORMATS[format].decode !== undefined).map(format => FORMATS[format]);

