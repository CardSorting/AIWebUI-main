import React, { useState } from 'react';
import type { NextPage } from 'next';
import { SEO } from '@layout';
import {
  Box,
  Button,
  Container,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { useAICardGeneration } from '@features/aiCardGeneration/hooks/useAICardGeneration';
import { BasicInfoStep } from '@features/aiCardGeneration/components/forms/BasicInfoStep';
import { ParametersStep } from '@features/aiCardGeneration/components/forms/ParametersStep';
import { GenerationStep } from '@features/aiCardGeneration/components/forms/GenerationStep';
import { ResultStep } from '@features/aiCardGeneration/components/forms/ResultStep';

const steps = ['Basic Info', 'Parameters', 'Generate', 'Result'];

const AICardGeneratorPage: NextPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const {
    generationRequest,
    setGenerationRequest,
    generateCard,
    generatedCard,
    isGenerating,
    progress,
    resetGeneration,
    resetError,
  } = useAICardGeneration();

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
    resetError();
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
    resetError();
  };

  const handleReset = () => {
    setActiveStep(0);
    resetGeneration();
  };

  const canProceedToNext = () => {
    switch (activeStep) {
      case 0: // Basic Info
        return (
          generationRequest.pokemonName?.trim() &&
          generationRequest.baseSetId &&
          generationRequest.supertypeId &&
          generationRequest.typeId
        );
      case 1: // Parameters
        return true; // Parameters are optional
      case 2: // Generation
        return generatedCard !== null && !isGenerating;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <BasicInfoStep
            request={generationRequest}
            onChange={request => setGenerationRequest(request)}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <ParametersStep
            request={generationRequest}
            onChange={request => setGenerationRequest(request)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <GenerationStep
            request={generationRequest}
            isGenerating={isGenerating}
            progress={progress}
            onGenerate={generateCard}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <ResultStep
            generatedCard={generatedCard}
            onSave={() => {}}
            onEdit={() => {}}
            onRegenerate={() => {
              resetGeneration();
              setActiveStep(2);
            }}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <SEO
        title="AI Card Generator - Pokécardmaker"
        description="Generate complete custom Pokémon cards automatically using AI. Create balanced stats, moves, abilities, and artwork with advanced artificial intelligence."
      />

      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              fontWeight="bold"
            >
              AI Card Generator
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Create complete Pokémon cards with artificial intelligence
            </Typography>
          </Box>

          {/* Stepper */}
          <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map(label => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>

          {/* Step Content */}
          <Paper elevation={2} sx={{ p: 4, mb: 4, minHeight: 400 }}>
            {renderStepContent()}
          </Paper>

          {/* Navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
              size="large"
            >
              Back
            </Button>

            <Box sx={{ display: 'flex', gap: 2 }}>
              {activeStep === steps.length - 1 && (
                <Button onClick={handleReset} variant="outlined" size="large">
                  Start Over
                </Button>
              )}

              {activeStep < steps.length - 1 && (
                <Button
                  variant="contained"
                  onClick={activeStep === 2 ? generateCard : handleNext}
                  disabled={
                    !canProceedToNext() || (activeStep === 2 && isGenerating)
                  }
                  size="large"
                >
                  {activeStep === 2
                    ? isGenerating
                      ? 'Generating...'
                      : 'Generate Card'
                    : 'Next'}
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default AICardGeneratorPage;
