import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { fileConverter } from "../utils/fileConverter";

import "./Dropzone.scss";

export const Dropzone = ({ onDone, label, children }) => {
  const onDrop = useCallback(
    acceptedFiles => {
      fileConverter.xlsxToJson(acceptedFiles[0], onDone);
    },
    [onDone]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <React.Fragment>
      <div className="dropzoneContainer" {...getRootProps()}>
        <h1>{`${label}`}</h1>

        <input {...getInputProps()} />

        {children}
      </div>
    </React.Fragment>
  );
};
