/**
 * Dagara Numerology System - Base 5 Calculation
 * Based on Blue Heron lineage cosmology
 */

export type Element = 'FIRE' | 'WATER' | 'EARTH' | 'MINERAL' | 'NATURE';
export type SpiritBird = 'Flicker' | 'Blue Heron' | 'Egret' | 'Wind Eagle' | 'Hummingbird';

export interface ElementData {
  element: Element;
  bird: SpiritBird;
  number: number;
  traits: string[];
  description: string;
  color: string;
  strengths: string;
  challenges: string;
  balancePractice: string;
}

// Dagara Element mappings (Base 5 system)
const ELEMENT_MAP: Record<number, ElementData> = {
  2: {
    element: 'FIRE',
    bird: 'Flicker',
    number: 2,
    traits: ['Vision', 'Ancestors', 'Passion', 'Dreaming'],
    description: 'Fire people are visionaries who connect past and future. Like the Flicker, you see ahead and illuminate the path for others.',
    color: 'var(--fire-orange)',
    strengths: 'Leadership, inspiration, ancestral wisdom, strategic vision',
    challenges: 'Burnout, impulsiveness, disconnection from present moment',
    balancePractice: 'Ground your fire with daily water rituals. Light a candle and breathe deeply before making decisions.'
  },
  1: {
    element: 'WATER',
    bird: 'Blue Heron',
    number: 1,
    traits: ['Healing', 'Peace', 'Reconciliation', 'Cleansing'],
    description: 'Water people are natural healers who restore flow. Like the Blue Heron standing in still water, you bring peace to troubled situations.',
    color: 'var(--water-cerulean)',
    strengths: 'Emotional intelligence, reconciliation, intuition, healing presence',
    challenges: 'Absorbing others\' emotions, boundary issues, stagnation',
    balancePractice: 'Practice daily cleansing rituals. Run water over your hands while releasing what is not yours to carry.'
  },
  0: {
    element: 'EARTH',
    bird: 'Egret',
    number: 0,
    traits: ['Nourishment', 'Home', 'Grounding', 'Mothering'],
    description: 'Earth people are nurturers who create stability. Like the Egret foraging for food, you provide sustenance and create safe spaces.',
    color: 'var(--earth-brown)',
    strengths: 'Stability, caregiving, practical wisdom, creating sanctuary',
    challenges: 'Over-responsibility, difficulty receiving, martyrdom',
    balancePractice: 'Walk barefoot on earth daily. Place a grounding stone in your pocket as a reminder of your rootedness.'
  },
  4: {
    element: 'MINERAL',
    bird: 'Wind Eagle',
    number: 4,
    traits: ['Storytelling', 'Memory', 'Communication', 'Bones'],
    description: 'Mineral people are communicators who preserve wisdom. Like the Wind Eagle soaring above, you see the big picture and share stories.',
    color: 'var(--mineral-gray)',
    strengths: 'Communication, teaching, pattern recognition, wisdom keeper',
    challenges: 'Over-analysis, detachment, living in the past',
    balancePractice: 'Speak your truth daily. Journal to externalize mental loops. Hold a stone when you need clarity.'
  },
  3: {
    element: 'NATURE',
    bird: 'Hummingbird',
    number: 3,
    traits: ['Magic', 'Transformation', 'Shapeshifting', 'Vitality'],
    description: 'Nature people are transformers who embrace change. Like the Hummingbird vibrating at high frequency, you bring magic and renewal.',
    color: 'var(--nature-emerald)',
    strengths: 'Adaptability, transformation, joy, creative energy',
    challenges: 'Scattered energy, difficulty completing, restlessness',
    balancePractice: 'Spend time in nature daily. Notice the small miracles. Let your energy settle before sleep with deep breathing.'
  }
};

/**
 * Calculate Dagara element from birth year using Base 5 system
 * 
 * @param birthYear - Full birth year (e.g., 1985)
 * @returns ElementData object with full element information
 */
export function calculateDagaraElement(birthYear: number): ElementData {
  // Sum all digits of birth year
  const yearStr = birthYear.toString();
  let sum = 0;
  
  for (const digit of yearStr) {
    sum += parseInt(digit, 10);
  }
  
  // Reduce to Base 5 (0-4)
  const base5Result = sum % 5;
  
  // Map to element (also includes 7 -> 2, 6 -> 1, 5 -> 0, 9 -> 4, 8 -> 3)
  return ELEMENT_MAP[base5Result];
}

/**
 * Get element data by number (for direct lookups)
 */
export function getElementByNumber(num: number): ElementData {
  const base5 = num % 5;
  return ELEMENT_MAP[base5];
}

/**
 * Get all elements (for reference/display)
 */
export function getAllElements(): ElementData[] {
  return [
    ELEMENT_MAP[2], // Fire
    ELEMENT_MAP[1], // Water
    ELEMENT_MAP[0], // Earth
    ELEMENT_MAP[4], // Mineral
    ELEMENT_MAP[3], // Nature
  ];
}

/**
 * Validate birth year input
 */
export function isValidBirthYear(year: number): boolean {
  const currentYear = new Date().getFullYear();
  return year >= 1900 && year <= currentYear;
}
