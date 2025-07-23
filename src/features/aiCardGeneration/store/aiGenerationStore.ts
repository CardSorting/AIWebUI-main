import create from 'zustand';
import { CardInterface } from '@cardEditor/types';
import {
  AIGenerationRequest,
  GenerationProgress,
  GenerationStep,
} from '../types';

interface AIGenerationStore {
  // Generation request state
  generationRequest: AIGenerationRequest;
  setGenerationRequest: (request: AIGenerationRequest) => void;
  updateGenerationRequest: (updates: Partial<AIGenerationRequest>) => void;

  // Generated results
  generatedCard: CardInterface | null;
  setGeneratedCard: (card: CardInterface | null) => void;
  generationHistory: CardInterface[];
  addToHistory: (card: CardInterface) => void;

  // Progress tracking
  currentStep: GenerationStep;
  setCurrentStep: (step: GenerationStep) => void;
  progress: GenerationProgress;
  setProgress: (progress: GenerationProgress) => void;

  // UI state
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;

  // Batch generation
  batchRequests: AIGenerationRequest[];
  setBatchRequests: (requests: AIGenerationRequest[]) => void;
  batchResults: CardInterface[];
  setBatchResults: (results: CardInterface[]) => void;

  // Reset functions
  resetGeneration: () => void;
  resetError: () => void;
}

const defaultGenerationRequest: AIGenerationRequest = {
  pokemonName: '',
  baseSetId: 1, // Sword & Shield
  supertypeId: 1, // Pokemon
  typeId: 1, // Grass
  subtypeId: 1, // Basic
  powerLevel: 'medium',
  artworkStyle: 'realistic',
  generateMoves: true,
  generateAbility: false,
  balanceStats: true,
};

export const useAIGenerationStore = create<AIGenerationStore>((set, get) => ({
  // Generation request state
  generationRequest: defaultGenerationRequest,
  setGenerationRequest: request => set({ generationRequest: request }),
  updateGenerationRequest: updates =>
    set(state => ({
      generationRequest: { ...state.generationRequest, ...updates },
    })),

  // Generated results
  generatedCard: null,
  setGeneratedCard: card => set({ generatedCard: card }),
  generationHistory: [],
  addToHistory: card =>
    set(state => ({
      generationHistory: [card, ...state.generationHistory].slice(0, 10), // Keep last 10
    })),

  // Progress tracking
  currentStep: 'preparing',
  setCurrentStep: step => set({ currentStep: step }),
  progress: { step: 'preparing', progress: 0, message: '' },
  setProgress: progress => set({ progress }),

  // UI state
  isGenerating: false,
  setIsGenerating: generating => set({ isGenerating: generating }),
  error: null,
  setError: error => set({ error }),

  // Batch generation
  batchRequests: [],
  setBatchRequests: requests => set({ batchRequests: requests }),
  batchResults: [],
  setBatchResults: results => set({ batchResults: results }),

  // Reset functions
  resetGeneration: () =>
    set({
      generatedCard: null,
      currentStep: 'preparing',
      progress: { step: 'preparing', progress: 0, message: '' },
      isGenerating: false,
      error: null,
    }),
  resetError: () => set({ error: null }),
}));
