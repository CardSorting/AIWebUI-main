import React from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Grid,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Brush as BrushIcon,
  Create as CreateIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';
import NextLink from 'next/link';
import Routes from '@routes';

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  isNew?: boolean;
  isPopular?: boolean;
}

export const FeatureShowcase: React.FC = () => {
  const theme = useTheme();

  const features: Feature[] = [
    {
      title: 'AI Complete Card Generation',
      description:
        'Generate entire Pokémon cards automatically with balanced stats, moves, abilities, and custom artwork in seconds.',
      icon: <PsychologyIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.primary.main,
      features: [
        'Auto-balanced stats & moves',
        'AI-generated artwork',
        'Type-appropriate abilities',
        'Competitive game balance',
        'Multiple art styles',
      ],
      ctaText: 'Generate Complete Card',
      ctaLink: Routes.AICardGenerator,
      isNew: true,
      isPopular: true,
    },
    {
      title: 'AI Artwork Generator',
      description:
        'Create stunning custom artwork for your cards using advanced AI image generation with multiple styles and prompts.',
      icon: <BrushIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.secondary.main,
      features: [
        'Text-to-image generation',
        'Multiple art styles',
        'Type-specific prompts',
        'High-quality results',
        'Instant generation',
      ],
      ctaText: 'Generate AI Art',
      ctaLink: Routes.AIImageGenerator,
      isPopular: true,
    },
    {
      title: 'Custom Card Designer',
      description:
        'Design every aspect of your cards manually with our comprehensive editor featuring all official card types and formats.',
      icon: <CreateIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.success.main,
      features: [
        'All Pokémon types',
        'Trainer & Energy cards',
        'Multiple base sets',
        'Advanced customization',
        'Professional templates',
      ],
      ctaText: 'Start Designing',
      ctaLink: Routes.Creator,
    },
  ];

  return (
    <Box>
      <Box textAlign="center" mb={6}>
        <Typography
          variant="h2"
          component="h2"
          gutterBottom
          sx={{ fontSize: '2.5rem', fontWeight: 'bold' }}
        >
          Everything You Need to Create Amazing Cards
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: 'auto' }}
        >
          From AI-powered automation to detailed manual control, choose the
          perfect approach for your card creation needs.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                border: `2px solid ${alpha(feature.color, 0.2)}`,
                borderRadius: 3,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: `0 12px 25px ${alpha(feature.color, 0.25)}`,
                  borderColor: alpha(feature.color, 0.4),
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: feature.color,
                  borderRadius: '12px 12px 0 0',
                },
              }}
            >
              {/* Badges */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  display: 'flex',
                  gap: 1,
                }}
              >
                {feature.isNew && (
                  <Chip
                    label="NEW"
                    size="small"
                    sx={{
                      background: theme.palette.success.main,
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.7rem',
                    }}
                  />
                )}
                {feature.isPopular && (
                  <Chip
                    label="POPULAR"
                    size="small"
                    sx={{
                      background: theme.palette.warning.main,
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.7rem',
                    }}
                  />
                )}
              </Box>

              <CardContent sx={{ flexGrow: 1, pt: 4 }}>
                {/* Icon */}
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}10)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                    color: feature.color,
                  }}
                >
                  {feature.icon}
                </Box>

                {/* Title & Description */}
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  fontWeight="bold"
                >
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {feature.description}
                </Typography>

                {/* Feature List */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    fontWeight="bold"
                    color={feature.color}
                  >
                    Key Features:
                  </Typography>
                  <Box component="ul" sx={{ pl: 0, m: 0, listStyle: 'none' }}>
                    {feature.features.map((item, itemIndex) => (
                      <Box
                        component="li"
                        key={itemIndex}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 0.5,
                          color: 'text.secondary',
                          fontSize: '0.875rem',
                        }}
                      >
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: feature.color,
                            mr: 1.5,
                            flexShrink: 0,
                          }}
                        />
                        {item}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </CardContent>

              <CardActions sx={{ p: 3, pt: 0 }}>
                <NextLink
                  href={feature.ctaLink}
                  passHref
                  style={{ width: '100%' }}
                >
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 'bold',
                      background: feature.color,
                      '&:hover': {
                        background:
                          theme.palette.mode === 'light'
                            ? alpha(feature.color, 0.8)
                            : alpha(feature.color, 1.2),
                        transform: 'translateY(-1px)',
                        boxShadow: 4,
                      },
                    }}
                  >
                    {feature.ctaText}
                  </Button>
                </NextLink>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Stats */}
      <Box
        sx={{
          mt: 8,
          p: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}05)`,
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        }}
      >
        <Grid container spacing={4} textAlign="center">
          <Grid item xs={6} sm={3}>
            <Typography
              variant="h3"
              component="div"
              fontWeight="bold"
              color="primary"
            >
              17+
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pokémon Types
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography
              variant="h3"
              component="div"
              fontWeight="bold"
              color="primary"
            >
              13+
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Card Subtypes
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography
              variant="h3"
              component="div"
              fontWeight="bold"
              color="primary"
            >
              3
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Base Sets
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography
              variant="h3"
              component="div"
              fontWeight="bold"
              color="primary"
            >
              ∞
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Possibilities
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
