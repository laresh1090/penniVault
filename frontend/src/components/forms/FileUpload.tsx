"use client";

import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudUploadAlt,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  label: string;
  name: string;
  accept?: string;
  maxSizeMB?: number;
  error?: string;
  required?: boolean;
  onFileSelect?: (file: File | null) => void;
  className?: string;
}

export default function FileUpload({
  label,
  name,
  accept,
  maxSizeMB = 5,
  error,
  required,
  onFileSelect,
  className,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function validateAndSelect(file: File | null) {
    setFileError(null);

    if (!file) {
      setSelectedFile(null);
      onFileSelect?.(null);
      return;
    }

    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setFileError(`File size exceeds ${maxSizeMB}MB limit`);
      setSelectedFile(null);
      onFileSelect?.(null);
      return;
    }

    setSelectedFile(file);
    onFileSelect?.(file);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0] || null;
    validateAndSelect(file);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    validateAndSelect(file);
  }

  function handleClick() {
    inputRef.current?.click();
  }

  const displayError = error || fileError;

  return (
    <div className={cn("pv-form-group", className)}>
      <label className="pv-form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>

      <div
        className={cn("pv-file-upload", isDragOver && "drag-over")}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={accept}
          onChange={handleInputChange}
          style={{ display: "none" }}
        />
        <div className="upload-icon">
          <FontAwesomeIcon icon={faCloudUploadAlt} />
        </div>
        <div className="upload-text">
          Choose file or <span style={{ color: "#EB5310" }}>drag &amp; drop</span>
        </div>
        <div className="upload-hint">
          Accepted: {accept || "All files"} &bull; Max: {maxSizeMB}MB
        </div>
        {selectedFile && (
          <div className="upload-file-name">{selectedFile.name}</div>
        )}
      </div>

      {displayError && (
        <div className="pv-form-error">
          <FontAwesomeIcon icon={faExclamationCircle} />
          {displayError}
        </div>
      )}
    </div>
  );
}
