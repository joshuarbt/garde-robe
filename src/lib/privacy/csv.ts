export function escapeCsvField(value: string | number | null | undefined): string {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);

  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

export function rowsToCsv(
  headers: string[],
  rows: Array<Array<string | number | null | undefined>>,
): string {
  const lines = [headers.map(escapeCsvField).join(",")];

  for (const row of rows) {
    lines.push(row.map(escapeCsvField).join(","));
  }

  return `${lines.join("\n")}\n`;
}
