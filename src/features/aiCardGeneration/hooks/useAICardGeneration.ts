import { useCallback } from 'react';
import { useCardOptionsStore } from '@cardEditor/cardOptions';
import { useAIGenerationStore } from '../store/aiGenerationStore';
import { AIGenerationResponse, GenerationStep } from '../types';

export const useAICardGeneration = () => {
  const {
    generationRequest,
    setGenerationRequest,
    updateGenerationRequest,
    generatedCard,
    setGeneratedCard,
    addToHistory,
    currentStep,
    setCurrentStep,
    progress,
    setProgress,
    isGenerating,
    setIsGenerating,
    error,
    setError,
    resetGeneration,
    resetError,
  } = useAIGenerationStore();

  const cardOptionsStore = useCardOptionsStore();

  const updateProgress = useCallback(
    (step: GenerationStep, progress: number, message: string) => {
      setCurrentStep(step);
      setProgress({ step, progress, message });
    },
    [setCurrentStep, setProgress],
  );

  const generateCard = useCallback(async () => {
    try {
      setIsGenerating(true);
      setError(null);
      resetGeneration();

      // Step 1: Validate input
      updateProgress('validating', 10, 'Validating generation parameters...');

      if (!generationRequest.pokemonName?.trim()) {
        throw new Error('Pokemon name is required');
      }

      // Step 2: Call AI generation API
      updateProgress(
        'generating_metadata',
        30,
        'Generating card stats and moves...',
      );

      const response = await fetch('/api/generate-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(generationRequest),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Generation failed: ${response.status}`,
        );
      }

      updateProgress('generating_artwork', 60, 'Creating AI artwork...');

      const result: AIGenerationResponse = await response.json();

      if (!result.success) {
        throw new Error('AI generation failed');
      }

      updateProgress('finalizing', 90, 'Finalizing card data...');

      setGeneratedCard(result.cardData);
      addToHistory(result.cardData);

      updateProgress('completed', 100, 'Card generation completed!');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Generation failed';
      setError(errorMessage);
      updateProgress('error', 0, errorMessage);
    } finally {
      setIsGenerating(false);
    }
  }, [
    generationRequest,
    setIsGenerating,
    setError,
    resetGeneration,
    setGeneratedCard,
    addToHistory,
    updateProgress,
  ]);

  const saveToEditor = useCallback(async () => {
    if (!generatedCard) return;

    try {
      // Import the generated card into the main card editor
      cardOptionsStore.setState(generatedCard);

      // Reset AI generation state
      resetGeneration();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to save card';
      setError(errorMessage);
    }
  }, [generatedCard, cardOptionsStore, resetGeneration, setError]);

  return {
    // State
    generationRequest,
    generatedCard,
    currentStep,
    progress,
    isGenerating,
    error,

    // Actions
    setGenerationRequest,
    updateGenerationRequest,
    generateCard,
    saveToEditor,
    resetGeneration,
    resetError,
  };
};
