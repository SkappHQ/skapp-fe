export enum FileUploadErrorTypes {
  INVALID_TEXT_OR_CSV_FILE_TYPE_ERROR = "File type must be text/csv,.csv",
  INVALID_IMAGE_OR_PDF_FILE_TYPE_ERROR = "File type must be image/jpeg,.jpg,.jpeg,image/png,application/pdf,.pdf",
  TOO_MANY_FILES_ERROR = "Too many files",
  MAX_FILE_SIZE_ERROR = "File is larger than 5000000 bytes"
}
