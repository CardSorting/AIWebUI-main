import React, { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Fade,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Zoom,
  useTheme,
} from '@mui/material';
import {
  AutoFixHigh as AutoFixHighIcon,
  Bolt as BoltIcon,
  Brush as BrushIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import Routes from '@routes';

interface QuickStartFormData {
  pokemonName: string;
  type: string;
  powerLevel: string;
  concept: string;
}

const pokemonTypes = [
  { id: 'fire', name: 'Fire', color: '#FF6B6B' },
  { id: 'water', name: 'Water', color: '#4ECDC4' },
  { id: 'grass', name: 'Grass', color: '#45B7D1' },
  { id: 'electric', name: 'Electric', color: '#FFA726' },
  { id: 'psychic', name: 'Psychic', color: '#AB47BC' },
  { id: 'fighting', name: 'Fighting', color: '#8D6E63' },
  { id: 'dark', name: 'Dark', color: '#424242' },
  { id: 'metal', name: 'Metal', color: '#78909C' },
];

const powerLevels = [
  { id: 'low', name: 'Starter', description: 'Basic Pokémon, 40-80 HP' },
  { id: 'medium', name: 'Evolved', description: 'Stage 1, 80-150 HP' },
  { id: 'high', name: 'Legendary', description: 'Powerful, 150+ HP' },
];

export const AICardQuickStart: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const [formData, setFormData] = useState<QuickStartFormData>({
    pokemonName: '',
    type: '',
    powerLevel: 'medium',
    concept: '',
  });
  const [isHovered, setIsHovered] = useState(false);

  const handleInputChange = (
    field: keyof QuickStartFormData,
    value: string,
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleQuickGenerate = () => {
    // Store the quick start data in session storage
    sessionStorage.setItem('aiCardQuickStart', JSON.stringify(formData));
    router.push(Routes.AICardGenerator);
  };

  const isFormValid = formData.pokemonName.trim() && formData.type;

  const selectedType = pokemonTypes.find(t => t.id === formData.type);

  return (
    <Paper
      elevation={6}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        p: 4,
        background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}10)`,
        border: `2px solid ${theme.palette.primary.main}30`,
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered
          ? `0 12px 25px ${theme.palette.primary.main}25`
          : `0 4px 12px ${theme.palette.primary.main}15`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        },
      }}
    >
      <Box display="flex" alignItems="center" mb={3}>
        <Zoom in timeout={500}>
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              borderRadius: '50%',
              p: 1.5,
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PsychologyIcon sx={{ color: 'white', fontSize: 32 }} />
          </Box>
        </Zoom>
        <Box>
          <Typography
            variant="h4"
            component="h2"
            fontWeight="bold"
            color="primary"
          >
            AI Card Generator
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Create a complete Pokémon card in seconds
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Pokémon Name"
            value={formData.pokemonName}
            onChange={e => handleInputChange('pokemonName', e.target.value)}
            placeholder="e.g., Thunderbolt, Mystic Dragon"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Pokémon Type</InputLabel>
            <Select
              value={formData.type}
              onChange={e => handleInputChange('type', e.target.value)}
              label="Pokémon Type"
              sx={{
                borderRadius: 2,
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              {pokemonTypes.map(type => (
                <MenuItem key={type.id} value={type.id}>
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: type.color,
                        mr: 1,
                      }}
                    />
                    {type.name}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom color="text.secondary">
            Power Level
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {powerLevels.map(level => (
              <Chip
                key={level.id}
                label={level.name}
                variant={
                  formData.powerLevel === level.id ? 'filled' : 'outlined'
                }
                color={formData.powerLevel === level.id ? 'primary' : 'default'}
                onClick={() => handleInputChange('powerLevel', level.id)}
                sx={{
                  borderRadius: 2,
                  fontWeight:
                    formData.powerLevel === level.id ? 'bold' : 'normal',
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
          {formData.powerLevel && (
            <Fade in timeout={300}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: 'block' }}
              >
                {
                  powerLevels.find(l => l.id === formData.powerLevel)
                    ?.description
                }
              </Typography>
            </Fade>
          )}
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Card Concept (Optional)"
            value={formData.concept}
            onChange={e => handleInputChange('concept', e.target.value)}
            placeholder="Describe the theme, personality, or special abilities..."
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" gap={2} alignItems="center">
            <Button
              variant="contained"
              size="large"
              startIcon={<AutoFixHighIcon />}
              onClick={handleQuickGenerate}
              disabled={!isFormValid}
              sx={{
                flex: 1,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 'bold',
                fontSize: '1.1rem',
                background: selectedType
                  ? `linear-gradient(135deg, ${selectedType.color}90, ${selectedType.color}70)`
                  : `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                '&:hover': {
                  background: selectedType
                    ? `linear-gradient(135deg, ${selectedType.color}, ${selectedType.color}90)`
                    : `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                  transform: 'translateY(-1px)',
                  boxShadow: 6,
                },
                '&:disabled': {
                  background: theme.palette.grey[300],
                  color: theme.palette.grey[500],
                },
              }}
            >
              Generate Complete Card
            </Button>

            <Box display={{ xs: 'none', sm: 'flex' }} gap={1}>
              <Box display="flex" alignItems="center" color="text.secondary">
                <BoltIcon sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption">Fast</Typography>
              </Box>
              <Box display="flex" alignItems="center" color="text.secondary">
                <BrushIcon sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="caption">AI Art</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Box
        sx={{
          position: 'absolute',
          bottom: -20,
          right: -20,
          width: 100,
          height: 100,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}05)`,
          borderRadius: '50%',
          zIndex: -1,
        }}
      />
    </Paper>
  );
};
