import React from 'react';
import {
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { supertypes } from '@cardEditor/cardOptions/supertype';
import { types } from '@cardEditor/cardOptions/type';
import { subtypes } from '@cardEditor/cardOptions/subtype';
import { baseSets } from '@cardEditor/cardOptions/baseSet';
import { AIGenerationRequest } from '../../types';

interface BasicInfoStepProps {
  request: AIGenerationRequest;
  onChange: (request: AIGenerationRequest) => void;
  onNext: () => void;
}

const powerLevels = [
  {
    id: 'low',
    name: 'Starter',
    description: 'Basic Pokémon, 40-80 HP',
    color: '#4CAF50',
  },
  {
    id: 'medium',
    name: 'Evolved',
    description: 'Stage 1, 80-150 HP',
    color: '#FF9800',
  },
  {
    id: 'high',
    name: 'Legendary',
    description: 'Powerful, 150+ HP',
    color: '#F44336',
  },
];

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  request,
  onChange,
  onNext,
}) => {
  const handleFieldChange = (field: keyof AIGenerationRequest, value: any) => {
    onChange({ ...request, [field]: value });
  };

  const isFormValid = () => {
    return (
      request.pokemonName &&
      request.supertypeId &&
      request.typeId &&
      request.baseSetId
    );
  };

  // Filter types based on selected supertype and base set
  const getAvailableTypes = () => {
    if (!request.supertypeId || !request.baseSetId) return [];
    return types.filter(type => {
      const baseDep = type.baseSetDependencies?.[request.baseSetId];
      return baseDep && baseDep.supertypes.includes(request.supertypeId);
    });
  };

  // Filter subtypes based on selected type and base set
  const getAvailableSubtypes = () => {
    if (!request.typeId || !request.baseSetId) return [];
    return subtypes.filter(subtype => {
      const baseDep = subtype.baseSetDependencies?.[request.baseSetId];
      if (!baseDep) return false;
      return baseDep.some((dep: any) => dep.type === request.typeId);
    });
  };

  // Load quick start data from session storage
  React.useEffect(() => {
    const quickStartData = sessionStorage.getItem('aiCardQuickStart');
    if (quickStartData) {
      try {
        const data = JSON.parse(quickStartData);
        const typeMap: Record<string, number> = {
          fire: 2,
          water: 3,
          grass: 1,
          electric: 4,
          psychic: 5,
          fighting: 6,
          dark: 7,
          metal: 8,
          fairy: 9,
          dragon: 10,
          colorless: 11,
        };

        onChange({
          ...request,
          pokemonName: data.pokemonName || '',
          typeId: typeMap[data.type] || 1,
          powerLevel: data.powerLevel || 'medium',
          concept: data.concept || '',
          supertypeId: 1, // Pokemon
          baseSetId: 1, // Sword & Shield
          subtypeId: 1, // Basic
        });

        // Clear the session storage
        sessionStorage.removeItem('aiCardQuickStart');
      } catch (error) {
        console.error('Failed to load quick start data:', error);
      }
    }
  }, []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Basic Card Information
      </Typography>

      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Provide the basic information for your card. The AI will generate
        appropriate stats, moves, and artwork based on these parameters.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Pokémon/Card Name"
            value={request.pokemonName || ''}
            onChange={e => handleFieldChange('pokemonName', e.target.value)}
            placeholder="e.g., Pikachu, Charizard"
            helperText="Enter the name of the Pokémon or card"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Base Set</InputLabel>
            <Select
              value={request.baseSetId || ''}
              onChange={e => handleFieldChange('baseSetId', e.target.value)}
            >
              {baseSets.map(set => (
                <MenuItem key={set.id} value={set.id}>
                  {set.displayName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Card Type</InputLabel>
            <Select
              value={request.supertypeId || ''}
              onChange={e => handleFieldChange('supertypeId', e.target.value)}
            >
              {supertypes.map(supertype => (
                <MenuItem key={supertype.id} value={supertype.id}>
                  {supertype.displayName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth disabled={!request.supertypeId}>
            <InputLabel>Element/Type</InputLabel>
            <Select
              value={request.typeId || ''}
              onChange={e => handleFieldChange('typeId', e.target.value)}
            >
              {getAvailableTypes().map(type => (
                <MenuItem key={type.id} value={type.id}>
                  {type.displayName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {request.supertypeId === 1 && ( // Pokemon cards need subtypes
          <Grid item xs={12} md={6}>
            <FormControl fullWidth disabled={!request.typeId}>
              <InputLabel>Subtype</InputLabel>
              <Select
                value={request.subtypeId || ''}
                onChange={e => handleFieldChange('subtypeId', e.target.value)}
              >
                {getAvailableSubtypes().map(subtype => (
                  <MenuItem key={subtype.id} value={subtype.id}>
                    {subtype.displayName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Power Level
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
            {powerLevels.map(level => (
              <Chip
                key={level.id}
                label={level.name}
                variant={
                  request.powerLevel === level.id ? 'filled' : 'outlined'
                }
                color={request.powerLevel === level.id ? 'primary' : 'default'}
                onClick={() => handleFieldChange('powerLevel', level.id)}
                sx={{
                  borderRadius: 2,
                  fontWeight:
                    request.powerLevel === level.id ? 'bold' : 'normal',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: 2,
                  },
                }}
              />
            ))}
          </Box>
          {request.powerLevel && (
            <Typography variant="caption" color="text.secondary">
              {powerLevels.find(l => l.id === request.powerLevel)?.description}
            </Typography>
          )}
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Card Concept (Optional)"
            value={request.concept || ''}
            onChange={e => handleFieldChange('concept', e.target.value)}
            placeholder="Describe the theme, personality, or special characteristics..."
            helperText="Provide additional context to help the AI generate better content"
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button
          variant="contained"
          onClick={onNext}
          disabled={!isFormValid()}
          size="large"
        >
          Next: Generation Parameters
        </Button>
      </Box>
    </Box>
  );
};
