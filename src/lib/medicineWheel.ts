/**
 * Dagara Medicine Wheel Calculator Utilities
 * Based on the numerology system where letters are converted to numbers
 * and reduced to single digits (0-9), then mapped to the five elements.
 */

/**
 * Convert a letter to its numerical value (A=1, B=2, ..., Z=26)
 * then reduce to a single digit
 */
export function letterToDigit(letter: string): number {
  const upperLetter = letter.toUpperCase();
  const charCode = upperLetter.charCodeAt(0);
  
  // Only process A-Z
  if (charCode < 65 || charCode > 90) {
    return 0;
  }
  
  // A=1, B=2, ..., Z=26
  const value = charCode - 64;
  
  // Reduce to single digit
  return reduceToSingleDigit(value);
}

/**
 * Reduce a number to a single digit by summing its digits
 * Example: 19 -> 1+9 = 10 -> 1+0 = 1
 */
export function reduceToSingleDigit(num: number): number {
  while (num > 9) {
    num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
  }
  return num;
}

/**
 * Extract all individual digits from a date string
 * Example: "07/23/1985" -> [0, 7, 2, 3, 1, 9, 8, 5]
 */
export function extractDateDigits(dateString: string): number[] {
  return dateString
    .replace(/[^\d]/g, '') // Remove non-digits
    .split('')
    .map(char => parseInt(char, 10));
}

/**
 * Calculate digit frequency from name and birthdate
 * Returns an array of 10 elements representing counts of 0-9
 */
export function calculateDigitFrequency(name: string, birthDate: string): number[] {
  const digitCounts = new Array(10).fill(0);
  
  // Process name
  for (const char of name) {
    if (/[a-zA-Z]/.test(char)) {
      const digit = letterToDigit(char);
      digitCounts[digit]++;
    }
  }
  
  // Process birthdate
  const dateDigits = extractDateDigits(birthDate);
  for (const digit of dateDigits) {
    digitCounts[digit]++;
  }
  
  return digitCounts;
}

/**
 * Map digit counts to the five elements of the Medicine Wheel
 * WATER: 1, 6
 * NATURE: 3, 8
 * FIRE: 2, 7
 * MINERAL: 4, 9
 * EARTH: 0, 5
 */
export interface WheelData {
  water: number;
  nature: number;
  fire: number;
  mineral: number;
  earth: number;
}

export function mapToMedicineWheel(digitCounts: number[]): WheelData {
  return {
    water: digitCounts[1] + digitCounts[6],
    nature: digitCounts[3] + digitCounts[8],
    fire: digitCounts[2] + digitCounts[7],
    mineral: digitCounts[4] + digitCounts[9],
    earth: digitCounts[0] + digitCounts[5],
  };
}

/**
 * Get the dominant element from the wheel data
 */
export function getDominantElement(wheelData: WheelData): { element: string; count: number } {
  const elements = [
    { element: 'Water', count: wheelData.water },
    { element: 'Nature', count: wheelData.nature },
    { element: 'Fire', count: wheelData.fire },
    { element: 'Mineral', count: wheelData.mineral },
    { element: 'Earth', count: wheelData.earth },
  ];
  
  return elements.reduce((max, current) => 
    current.count > max.count ? current : max
  );
}

/**
 * Calculate masculine vs feminine energy balance
 * Masculine: 0-4, Feminine: 5-9
 */
export function getEnergyBalance(digitCounts: number[]): { masculine: number; feminine: number } {
  const masculine = digitCounts.slice(0, 5).reduce((sum, count) => sum + count, 0);
  const feminine = digitCounts.slice(5, 10).reduce((sum, count) => sum + count, 0);
  
  return { masculine, feminine };
}
