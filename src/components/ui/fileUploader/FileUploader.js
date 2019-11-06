import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { fileConverter } from "../../../utils/fileConverter";
import { Button } from "@material-ui/core";

export const FileUploader = ({ onDone }) => {
  const onDrop = useCallback(
    acceptedFiles => {
      fileConverter.xlsxToJson(acceptedFiles[0], onDone);
    },
    [onDone]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <React.Fragment>
      <Button
        size="large"
        variant="contained"
        className="button"
        {...getRootProps()}
      >
        Upload Data
        <input {...getInputProps()} />
      </Button>
    </React.Fragment>
  );
};
