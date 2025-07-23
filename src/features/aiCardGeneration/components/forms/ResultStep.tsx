import React from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import {
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { CardInterface } from '@cardEditor/types';
import CardDisplay from '@cardEditor/cardStyles/components/CardDisplay';

interface ResultStepProps {
  generatedCard: CardInterface | null;
  onSave: () => void;
  onEdit: () => void;
  onRegenerate: () => void;
  onBack: () => void;
}

export const ResultStep: React.FC<ResultStepProps> = ({
  generatedCard,
  onSave,
  onEdit,
  onRegenerate,
  onBack,
}) => {
  if (!generatedCard) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h6" color="text.secondary">
          No card generated yet
        </Typography>
        <Button variant="outlined" onClick={onBack} sx={{ mt: 2 }}>
          Back to Generation
        </Button>
      </Box>
    );
  }

  const getTypeDisplayName = (typeId: number) => {
    const typeNames: Record<number, string> = {
      1: 'Grass',
      2: 'Fire',
      3: 'Water',
      4: 'Lightning',
      5: 'Psychic',
      6: 'Fighting',
      7: 'Dark',
      8: 'Metal',
      9: 'Fairy',
      10: 'Dragon',
      11: 'Colorless',
    };
    return typeNames[typeId] || 'Unknown';
  };

  const getSubtypeDisplayName = (subtypeId?: number) => {
    const subtypeNames: Record<number, string> = {
      1: 'Basic',
      2: 'Stage 1',
      3: 'Stage 2',
      4: 'V',
      5: 'VMAX',
      6: 'VSTAR',
    };
    return subtypeId ? subtypeNames[subtypeId] || 'Unknown' : 'None';
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Your AI-Generated Card
      </Typography>

      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Your custom Pokémon card has been generated! Review the results and save
        to continue editing.
      </Typography>

      <Alert severity="success" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Generation Complete!</strong> Your card has been created with
          balanced stats, custom moves, and AI-generated artwork. You can now
          save it to the editor for further customization.
        </Typography>
      </Alert>

      <Grid container spacing={4}>
        {/* Card Preview */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom textAlign="center">
              Card Preview
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                maxHeight: 500,
                overflow: 'hidden',
              }}
            >
              <CardDisplay />
            </Box>
          </Paper>
        </Grid>

        {/* Card Details */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Card Details
            </Typography>

            <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
              <Chip
                label={generatedCard.name || 'Unnamed'}
                color="primary"
                variant="filled"
              />
              <Chip
                label={getTypeDisplayName(generatedCard.typeId)}
                color="secondary"
                variant="outlined"
              />
              <Chip
                label={getSubtypeDisplayName(generatedCard.subtypeId)}
                variant="outlined"
              />
              {generatedCard.hitpoints && (
                <Chip
                  label={`${generatedCard.hitpoints} HP`}
                  color="success"
                  variant="outlined"
                />
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Card Stats */}
            <Typography variant="subtitle2" gutterBottom>
              Generated Features:
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <li>
                <Typography variant="body2">
                  <strong>HP:</strong> {generatedCard.hitpoints || 'N/A'}
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Moves:</strong> {generatedCard.moves?.length || 0}{' '}
                  attacks/abilities
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Weakness:</strong> {generatedCard.weaknessAmount}×
                  damage
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Retreat Cost:</strong>{' '}
                  {generatedCard.retreatCost || 0} energy
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Artwork:</strong> AI-generated custom image
                </Typography>
              </li>
            </Box>

            {generatedCard.dexEntry && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Pokédex Entry:
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  style={{ fontStyle: 'italic' }}
                >
                  "{generatedCard.dexEntry}"
                </Typography>
              </>
            )}
          </Paper>

          {/* Move Details */}
          {generatedCard.moves && generatedCard.moves.length > 0 && (
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Moves & Abilities
              </Typography>

              {generatedCard.moves.map((move, index) => (
                <Card key={move.id} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        {move.name}
                      </Typography>
                      {'damageAmount' in move && move.damageAmount && (
                        <Typography variant="h6" color="primary">
                          {move.damageAmount}
                        </Typography>
                      )}
                    </Box>

                    {'energyCost' in move &&
                      move.energyCost &&
                      move.energyCost.length > 0 && (
                        <Box display="flex" gap={0.5} mb={1}>
                          {move.energyCost.map((cost, costIndex) => (
                            <Chip
                              key={costIndex}
                              label={`${cost.amount}× ${getTypeDisplayName(
                                cost.typeId,
                              )}`}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      )}

                    <Typography variant="body2" color="text.secondary">
                      {move.description}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 4,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box display="flex" gap={2}>
          <Button variant="outlined" onClick={onBack} size="large">
            Back
          </Button>
          <Button
            variant="outlined"
            onClick={onRegenerate}
            startIcon={<RefreshIcon />}
            size="large"
          >
            Regenerate
          </Button>
        </Box>

        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            onClick={onEdit}
            startIcon={<EditIcon />}
            size="large"
          >
            Edit in Designer
          </Button>
          <Button
            variant="contained"
            onClick={onSave}
            startIcon={<SaveIcon />}
            size="large"
            sx={{ px: 4 }}
          >
            Save & Continue
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
