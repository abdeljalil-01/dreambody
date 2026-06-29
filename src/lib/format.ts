const WESTERN_DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

export function toWesternNumerals(value: string | number): string {
  const str = String(value);
  return str.replace(/[٠-٩]/g, (digit) => {
    const index = ARABIC_DIGITS.indexOf(digit);
    return index >= 0 ? WESTERN_DIGITS[index] : digit;
  });
}

export function formatNumber(value: number, unit?: string): string {
  const formatted = toWesternNumerals(Math.round(value).toLocaleString("en-US"));
  return unit ? `${formatted} ${unit}` : formatted;
}
