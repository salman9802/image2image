
export type TConvertParams = {
  file: File;
  targetFormat: string;
  quality?: number;
}

export type TConvertComponentState = "idle" | "processing";
