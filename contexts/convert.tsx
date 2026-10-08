"use client";

import { TFormatConfig } from "@/lib/formats";
import React from "react";

export type TConvertState = "idle" | "pending" | "processing" | "finished"; // State Machine
export type TConvertUploadItemState = "waiting" | "ready" | "processing" | "finished" | "error"; // State Machine

export type TConvertUploadItem = {
  id: string;
  file: File;
  sourceFormatConfig: TFormatConfig;
  targetFormatConfig?: TFormatConfig;
  state: TConvertUploadItemState;
  convertedBlob: null | Blob;
};

export type TConvertContext = {
  state: TConvertState;
  setState: React.Dispatch<React.SetStateAction<TConvertState>>;
  uploads: TConvertUploadItem[];
  setUploads: React.Dispatch<React.SetStateAction<TConvertUploadItem[]>>;
  getUploadById: (uploadId: string) => TConvertUploadItem | null;
  setUploadConvertedBlob: (uploadId: string, blob: Blob) => any;
  setUploadState: (uploadId: string, state: TConvertUploadItemState) => any;
  removeUpload: (uploadId: string) => any;
  setUploadTargetFormatConfig: (uploadId: string, targetFormatConfig: TFormatConfig) => any;
}

// const context: TConvertContext = {
//   state: "idle",
//   uploads: []
// };

export const ConvertContext = React.createContext<TConvertContext | null>(null);

export const ConvertContextProvider = ({ children }: { children: React.ReactNode; }) => {
  const [state, setState] = React.useState<TConvertState>("idle");
  const [uploads, setUploads] = React.useState<TConvertUploadItem[]>([]);

  const getUploadById = React.useCallback((uploadId: string): TConvertUploadItem | null => {
    const uploadIndex = uploads.findIndex(u => u.id === uploadId);

    if (uploadIndex === -1) return null;

    return uploads[uploadIndex];
  }, [uploads]);

  const setUploadConvertedBlob = React.useCallback((uploadId: string, blob: Blob) => {
    const uploadIndex = [...uploads].findIndex(u => u.id === uploadId);
    if (uploadIndex === -1) return;
    uploads[uploadIndex].convertedBlob = blob;
    uploads[uploadIndex].state = "finished";
    // setUploads(prev => ([...prev.filter(u => u.id !== uploadId), upload]))
    setUploads([...uploads]);

    // We ensure parent moves to appropriate state after each upload change
    const haveAllUploadsFinished = uploads.every(u => u.state === "finished");
    if (haveAllUploadsFinished)
      setState("finished");
    else
      setState("processing");
  }, [uploads, getUploadById]);

  const setUploadState = React.useCallback((uploadId: string, state: TConvertUploadItemState) => {
    const uploadIndex = uploads.findIndex(u => u.id === uploadId);
    if (uploadIndex === -1) return;
    uploads[uploadIndex].state = state;
    // setUploads(prev => ([...prev.filter(u => u.id !== uploadId), upload]))
    setUploads([...uploads]);

    // We ensure parent moves to appropriate state after each upload change
    const unfinishedUploads = uploads.filter(u => u.state !== "finished")
    if (unfinishedUploads.length === 0) return;
    const areAllUploadsReady = unfinishedUploads.every(u => u.state === "ready");
    if (areAllUploadsReady)
      setState("pending");
    else
      setState("idle");
  }, [uploads, getUploadById]);

  // setUploadTargetFormatConfig
  const setUploadTargetFormatConfig = React.useCallback((uploadId: string, targetFormatConfig: TFormatConfig) => {
    const uploadIndex = uploads.findIndex(u => u.id === uploadId);
    if (uploadIndex === -1) return;
    uploads[uploadIndex].targetFormatConfig = targetFormatConfig;
    uploads[uploadIndex].state = "ready";
    // setUploads(prev => ([...prev.filter(u => u.id !== uploadId), upload]))
    setUploads([...uploads]);

    // We ensure parent moves to appropriate state after each upload change
    const unfinishedUploads = uploads.filter(u => u.state !== "finished")
    if (unfinishedUploads.length === 0) return;
    const areAllUploadsReady = unfinishedUploads.every(u => u.state === "ready");
    if (areAllUploadsReady)
      setState("pending");
    else
      setState("idle");
  }, [uploads, getUploadById]);


  const removeUpload = React.useCallback((uploadId: string) => {
    setUploads(prevUploads => prevUploads ? prevUploads.filter(u => u.id !== uploadId) : [])
  }, []);

  return (
    <ConvertContext value={{ state, setState, uploads, setUploads, getUploadById, setUploadConvertedBlob, setUploadState, removeUpload, setUploadTargetFormatConfig }}>
      {children}
    </ConvertContext>
  );
}

export function useConvert() {
  const context = React.useContext(ConvertContext);
  if (context == null) {
    throw new Error("Error: useConvert() hook can only be used inside ConvertContextProvider.");
  }
  return context;
}
