import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { fileConverter } from "../utils/fileConverter";

export const Dropzone = ({ onDone }) => {
  const onDrop = useCallback(acceptedFiles => {
    const data = fileConverter.xlsxToJson(acceptedFiles[0], onDone);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
};
