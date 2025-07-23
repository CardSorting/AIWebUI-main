import { CardInterface } from '@cardEditor/types';

export interface AIGenerationRequest {
  // Core identification
  pokemonName: string;
  baseSetId: number;
  supertypeId: number;
  typeId: number;
  subtypeId?: number;

  // Generation parameters
  powerLevel: 'low' | 'medium' | 'high';
  artworkStyle: 'realistic' | 'anime' | 'cartoon' | 'abstract';
  concept?: string;

  // Feature flags
  generateMoves: boolean;
  generateAbility: boolean;
  balanceStats: boolean;

  // Advanced options
  rarityId?: number;
  variationId?: number;
  customPrompts?: {
    moves?: string;
    ability?: string;
    artwork?: string;
    flavor?: string;
  };
}

export interface AIGenerationResponse {
  success: boolean;
  cardData: CardInterface;
  creditsUsed: number;
  remainingCredits: number;
  generationId?: string;
  warnings?: string[];
}

export type GenerationStep =
  | 'preparing'
  | 'validating'
  | 'generating_metadata'
  | 'generating_artwork'
  | 'generating_moves'
  | 'generating_ability'
  | 'balancing'
  | 'finalizing'
  | 'refining'
  | 'generating_batch'
  | 'completed'
  | 'error';

export interface GenerationProgress {
  step: GenerationStep;
  progress: number; // 0-100
  message: string;
  details?: string;
}

export interface BatchGenerationRequest {
  cards: AIGenerationRequest[];
  batchOptions?: {
    ensureUnique: boolean;
    theme?: string;
    setName?: string;
  };
}

export interface BatchGenerationResponse {
  success: boolean;
  cards: CardInterface[];
  totalCreditsUsed: number;
  remainingCredits: number;
  batchId: string;
  failures?: {
    index: number;
    error: string;
  }[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}
