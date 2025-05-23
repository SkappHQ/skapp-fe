/**
 * Converts a byte value into a human-readable size format.
 *
 * @param bytes - The size in bytes to convert
 * @returns A string representation of the size with appropriate unit (B, KB, MB, GB, TB)
 *
 * @example
 * // Returns "1.5 MB"
 * formatBytesToReadableSize(1500000);
 *
 * @remarks
 * - Returns "0 B" if input is zero
 * - Uses decimal base (1000) rather than binary (1024)
 * - Units follow the decimal standard: B (Bytes), KB (Kilobytes), MB (Megabytes), etc.
 * - Values are rounded to whole numbers
 * - Handles unit conversion boundary (e.g., 1000 KB becomes 1 MB)
 */
export const formatBytesToReadableSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const base = 1000; // Use decimal base to match typical file size displays

  let exponent = Math.floor(Math.log(bytes) / Math.log(base));
  let value = bytes / Math.pow(base, exponent);

  value = Math.round(value);

  if (value === base && exponent < units.length - 1) {
    value = 1;
    exponent++;
  }

  const formattedValue = `${value} ${units[exponent]}`;

  return formattedValue;
};
