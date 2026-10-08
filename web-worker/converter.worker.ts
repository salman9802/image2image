import { convertToImage } from "@/lib/convert";
import { FORMATS } from "@/lib/formats";

self.onmessage = async (e) => {
  const { file, sourceFormatConfigId, targetFormatConfigId } = e.data;

  // NOTE: we send ids and do lookup in worker itself, as it copies the data send
  // and regular TS imports work here.
  const sourceFormatConfig = FORMATS[sourceFormatConfigId];
  const targetFormatConfig = FORMATS[targetFormatConfigId];
  try {
    const blob = await convertToImage(file, sourceFormatConfig, targetFormatConfig);
    self.postMessage({ success: true, blob });
  } catch (err) {
    self.postMessage({ success: false, error: err });
  }
}
