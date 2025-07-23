import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { AIGenerationRequest } from '../../types';

interface ParametersStepProps {
  request: AIGenerationRequest;
  onChange: (request: AIGenerationRequest) => void;
  onNext: () => void;
  onBack: () => void;
}

const artworkStyles = [
  {
    id: 'realistic',
    name: 'Realistic',
    description: 'Photorealistic style with detailed textures',
  },
  {
    id: 'anime',
    name: 'Anime',
    description: 'Japanese animation style with bold colors',
  },
  {
    id: 'cartoon',
    name: 'Cartoon',
    description: 'Stylized cartoon with clean lines',
  },
  {
    id: 'abstract',
    name: 'Abstract',
    description: 'Artistic and interpretive style',
  },
];

export const ParametersStep: React.FC<ParametersStepProps> = ({
  request,
  onChange,
  onNext,
  onBack,
}) => {
  const handleFieldChange = (field: keyof AIGenerationRequest, value: any) => {
    onChange({ ...request, [field]: value });
  };

  const handleCustomPromptChange = (field: string, value: string) => {
    onChange({
      ...request,
      customPrompts: {
        ...request.customPrompts,
        [field]: value,
      },
    });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Generation Parameters
      </Typography>

      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Customize how the AI generates your card. These settings control the
        style, features, and balance of your generated card.
      </Typography>

      <Grid container spacing={4}>
        {/* Artwork Style */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Artwork Style
          </Typography>
          <Grid container spacing={2}>
            {artworkStyles.map(style => (
              <Grid item xs={12} sm={6} md={3} key={style.id}>
                <Card
                  variant={
                    request.artworkStyle === style.id ? 'outlined' : 'elevation'
                  }
                  elevation={request.artworkStyle === style.id ? 0 : 1}
                  onClick={() => handleFieldChange('artworkStyle', style.id)}
                  sx={{
                    cursor: 'pointer',
                    border:
                      request.artworkStyle === style.id
                        ? '2px solid'
                        : '1px solid',
                    borderColor:
                      request.artworkStyle === style.id
                        ? 'primary.main'
                        : 'divider',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {style.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {style.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Feature Toggles */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Generated Features
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={request.generateMoves}
                    onChange={e =>
                      handleFieldChange('generateMoves', e.target.checked)
                    }
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      Generate Moves
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Create attack moves with energy costs
                    </Typography>
                  </Box>
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={request.generateAbility}
                    onChange={e =>
                      handleFieldChange('generateAbility', e.target.checked)
                    }
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      Generate Ability
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Add a special ability to the card
                    </Typography>
                  </Box>
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={request.balanceStats}
                    onChange={e =>
                      handleFieldChange('balanceStats', e.target.checked)
                    }
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      Balance Stats
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Ensure competitive game balance
                    </Typography>
                  </Box>
                }
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Custom Prompts */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Custom Prompts (Advanced)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Override default AI prompts with your own custom instructions.
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Custom Artwork Prompt"
                value={request.customPrompts?.artwork || ''}
                onChange={e =>
                  handleCustomPromptChange('artwork', e.target.value)
                }
                placeholder="e.g., majestic dragon breathing golden fire in a storm..."
                helperText="Specific instructions for artwork generation"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Custom Moves Prompt"
                value={request.customPrompts?.moves || ''}
                onChange={e =>
                  handleCustomPromptChange('moves', e.target.value)
                }
                placeholder="e.g., powerful electric attacks that can paralyze..."
                helperText="Instructions for move generation"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Custom Ability Prompt"
                value={request.customPrompts?.ability || ''}
                onChange={e =>
                  handleCustomPromptChange('ability', e.target.value)
                }
                placeholder="e.g., ability that boosts other Pokémon..."
                helperText="Instructions for ability generation"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Custom Flavor Text Prompt"
                value={request.customPrompts?.flavor || ''}
                onChange={e =>
                  handleCustomPromptChange('flavor', e.target.value)
                }
                placeholder="e.g., mysterious and ancient, guardian of the forest..."
                helperText="Instructions for Pokédex entries and descriptions"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button variant="outlined" onClick={onBack} size="large">
          Back
        </Button>
        <Button variant="contained" onClick={onNext} size="large">
          Next: Preview & Generate
        </Button>
      </Box>
    </Box>
  );
};
