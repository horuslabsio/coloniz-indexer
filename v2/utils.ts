export function bigIntToString(value: bigint): string {
  const hex = value.toString(16);
  // Ensure even length by padding with 0 if necessary
  const paddedHex = hex.length % 2 ? '0' + hex : hex;

  // Convert each byte (2 hex chars) to an ASCII character
  let result = '';
  for (let i = 0; i < paddedHex.length; i += 2) {
    const charCode = parseInt(paddedHex.slice(i, i + 2), 16);
    if (charCode === 0) break; // Stop at null terminator
    result += String.fromCharCode(charCode);
  }

  return result.trim();
}