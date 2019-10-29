import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { fileConverter } from "../utils/fileConverter";

import "./Dropzone.scss";

const label = "Please drag n drop\nyour Binance order history";

export const Dropzone = ({ onDone, children }) => {
  const onDrop = useCallback(
    acceptedFiles => {
      fileConverter.xlsxToJson(acceptedFiles[0], onDone);
    },
    [onDone]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="dropzoneContainer" {...getRootProps()}>
      <input {...getInputProps()} />
      <h1>{`${label}`}</h1>
      {children}
    </div>
  );
};
