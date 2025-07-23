import React from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import {
  AutoFixHigh as AutoFixHighIcon,
  Brush as BrushIcon,
  Check as CheckIcon,
  Psychology as PsychologyIcon,
  Tune as TuneIcon,
} from '@mui/icons-material';
import { AIGenerationRequest, GenerationProgress } from '../../types';

interface GenerationStepProps {
  request: AIGenerationRequest;
  onGenerate: () => void;
  onBack: () => void;
  isGenerating: boolean;
  progress: GenerationProgress;
}

export const GenerationStep: React.FC<GenerationStepProps> = ({
  request,
  onGenerate,
  onBack,
  isGenerating,
  progress,
}) => {
  const getStepIcon = (
    stepName: string,
    isCompleted: boolean,
    isCurrent: boolean,
  ) => {
    if (isCompleted) return <CheckIcon color="success" />;
    if (isCurrent) return <AutoFixHighIcon color="primary" />;

    switch (stepName) {
      case 'artwork':
        return <BrushIcon />;
      case 'moves':
        return <PsychologyIcon />;
      case 'balance':
        return <TuneIcon />;
      default:
        return <AutoFixHighIcon />;
    }
  };

  const generationSteps = [
    {
      key: 'validating',
      label: 'Validating Parameters',
      description: 'Checking generation settings',
    },
    {
      key: 'generating_metadata',
      label: 'Generating Stats',
      description: 'Creating HP, stats, and card info',
    },
    {
      key: 'generating_moves',
      label: 'Creating Moves',
      description: 'Designing attacks and abilities',
    },
    {
      key: 'generating_artwork',
      label: 'Generating Artwork',
      description: 'Creating AI artwork',
    },
    {
      key: 'balancing',
      label: 'Balancing Card',
      description: 'Ensuring competitive balance',
    },
    {
      key: 'finalizing',
      label: 'Finalizing',
      description: 'Completing card generation',
    },
  ];

  const getCurrentStepIndex = () => {
    return generationSteps.findIndex(step => step.key === progress.step);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {isGenerating ? 'Generating Your Card...' : 'Ready to Generate'}
      </Typography>

      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        {isGenerating
          ? 'Please wait while we create your custom Pokémon card with AI.'
          : 'Review your settings and start the AI generation process.'}
      </Typography>

      <Grid container spacing={4}>
        {/* Generation Summary */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Generation Summary
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
              <Chip
                label={`${request.pokemonName || 'Unnamed'}`}
                color="primary"
                variant="outlined"
              />
              <Chip
                label={`Power: ${request.powerLevel}`}
                color="secondary"
                variant="outlined"
              />
              <Chip
                label={`Style: ${request.artworkStyle}`}
                variant="outlined"
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              Features to Generate:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <CheckIcon
                    color={request.generateMoves ? 'success' : 'disabled'}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Attack Moves"
                  secondary={
                    request.generateMoves ? 'Will generate moves' : 'Skipped'
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckIcon
                    color={request.generateAbility ? 'success' : 'disabled'}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Special Ability"
                  secondary={
                    request.generateAbility
                      ? 'Will generate ability'
                      : 'Skipped'
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckIcon
                    color={request.balanceStats ? 'success' : 'disabled'}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Stat Balancing"
                  secondary={
                    request.balanceStats
                      ? 'Will balance for competition'
                      : 'Skipped'
                  }
                />
              </ListItem>
            </List>

            {request.concept && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Concept:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {request.concept}
                </Typography>
              </>
            )}
          </Paper>
        </Grid>

        {/* Progress Display */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {isGenerating ? 'Generation Progress' : 'Generation Steps'}
            </Typography>

            {isGenerating && (
              <Box mb={3}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography variant="body2" color="primary">
                    {progress.message}
                  </Typography>
                  <Typography variant="body2" color="primary">
                    {progress.progress}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progress.progress}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            )}

            <List>
              {generationSteps.map((step, index) => {
                const isCompleted =
                  index < currentStepIndex || progress.step === 'completed';
                const isCurrent = index === currentStepIndex && isGenerating;

                return (
                  <ListItem key={step.key}>
                    <ListItemIcon>
                      {getStepIcon(step.key, isCompleted, isCurrent)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          color={
                            isCompleted
                              ? 'success.main'
                              : isCurrent
                              ? 'primary.main'
                              : 'text.primary'
                          }
                          fontWeight={isCurrent ? 'bold' : 'normal'}
                        >
                          {step.label}
                        </Typography>
                      }
                      secondary={step.description}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        </Grid>

        {/* Estimated Cost */}
        <Grid item xs={12}>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Estimated Cost:</strong> 10 credits for complete card
              generation (includes AI artwork, stats, moves, and balancing)
            </Typography>
          </Alert>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          onClick={onBack}
          disabled={isGenerating}
          size="large"
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={onGenerate}
          disabled={isGenerating}
          size="large"
          startIcon={<AutoFixHighIcon />}
          sx={{ px: 4 }}
        >
          {isGenerating ? 'Generating...' : 'Generate Card'}
        </Button>
      </Box>
    </Box>
  );
};
