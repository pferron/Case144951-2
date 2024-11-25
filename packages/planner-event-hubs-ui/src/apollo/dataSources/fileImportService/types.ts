export type FileImportSummary = {
  failedRowCount: number;
  importErrorRows: number[];
  importRowErrors: ImportRowError[];
  skippedRowCount: number;
  skippedRows: number[];
  successRowCount: number;
  totalErrorCount: number;
  totalRowCount: number;
  unknownErrorRowCount: number;
  unknownErrorRows: number[];
  validationErrorRowCount: number;
  validationErrorRows: number[];
};

export type FileImportSummaryInput = {
  environment: string;
  hubId: string;
  importId: string;
  locale: string;
};

export type ImportRow = {
  columns: NameValuePair[];
  row: number;
};

export type ImportRowError = {
  error: string;
  row: ImportRow;
};

export type NameValuePair = {
  name: string;
  value: string;
};
