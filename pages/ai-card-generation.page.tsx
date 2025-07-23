import React from 'react';
import type { NextPage } from 'next';
import { SEO } from '@layout';
import { 
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Alert,
  AlertTitle
} from '@mui/material';
import {
  AutoFixHigh as AutoFixHighIcon,
  Construction as ConstructionIcon,
  Lightbulb as LightbulbIcon,
} from '@mui/icons-material';
import NextLink from 'next/link';
import Routes from '@routes';

const AICardGenerationPage: NextPage = () => {
  return (
    <>
      <SEO
        title="AI Card Generation - Pokécardmaker"
        description="Generate complete custom Pokémon cards automatically using AI. Create balanced stats, moves, abilities, and artwork with advanced artificial intelligence."
      />
      
      <Container maxWidth="lg">
        <Box sx={{ py: 6 }}>
          {/* Hero Section */}
          <Box textAlign="center" mb={6}>
            <AutoFixHighIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
            <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
              AI Card Generation
            </Typography>
            <Typography variant="h5" color="text.secondary" paragraph>
              Generate complete Pokémon cards automatically with AI
            </Typography>
          </Box>

          {/* Launch AI Generator */}
          <Box textAlign="center" mb={6}>
            <Paper 
              elevation={3}
              sx={{ 
                p: 4,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}
            >
              <Typography variant="h4" gutterBottom fontWeight="bold">
                🎉 AI Card Generation is Now Live!
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                Create complete Pokémon cards with AI-generated stats, moves, abilities, and artwork.
              </Typography>
              <NextLink href={Routes.AICardGenerator} passHref>
                <Button 
                  variant="contained" 
                  color="secondary"
                  size="large"
                  sx={{ 
                    py: 1.5, 
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                  }}
                >
                  Start Generating Cards
                </Button>
              </NextLink>
            </Paper>
          </Box>

          {/* Features Overview */}
          <Alert 
            severity="success" 
            sx={{ 
              mb: 6, 
              '& .MuiAlert-message': { width: '100%' } 
            }}
          >
            <AlertTitle sx={{ fontWeight: 'bold' }}>
              ✨ AI Generation Features
            </AlertTitle>
            <Typography variant="body1" paragraph>
              Our AI system automatically creates:
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0 }}>
              <li>Balanced stats based on card type and power level</li>
              <li>Thematic moves with appropriate energy costs</li>
              <li>Custom abilities that match the Pokémon's theme</li>
              <li>Stunning AI-generated artwork</li>
              <li>Complete card metadata and flavor text</li>
            </Box>
          </Alert>

          {/* Current Alternatives */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 4, 
                  height: '100%',
                  border: '2px solid',
                  borderColor: 'secondary.main',
                  borderRadius: 2,
                }}
              >
                <LightbulbIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                <Typography variant="h4" gutterBottom fontWeight="bold">
                  AI Artwork Generator
                </Typography>
                <Typography variant="body1" paragraph color="text.secondary">
                  Start creating amazing cards today! Generate stunning AI artwork for your custom Pokémon cards with our text-to-image AI system.
                </Typography>
                <Box component="ul" sx={{ color: 'text.secondary', mb: 3 }}>
                  <li>Text-to-image generation</li>
                  <li>Multiple art styles</li>
                  <li>Type-specific prompts</li>
                  <li>High-quality results</li>
                </Box>
                <NextLink href={Routes.AIImageGenerator} passHref>
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    size="large" 
                    fullWidth
                    sx={{ py: 1.5 }}
                  >
                    Generate AI Artwork
                  </Button>
                </NextLink>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 4, 
                  height: '100%',
                  border: '2px solid',
                  borderColor: 'primary.main',
                  borderRadius: 2,
                }}
              >
                <ConstructionIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h4" gutterBottom fontWeight="bold">
                  Manual Card Designer
                </Typography>
                <Typography variant="body1" paragraph color="text.secondary">
                  Design every aspect of your cards with our comprehensive editor. Perfect for detailed customization and professional results.
                </Typography>
                <Box component="ul" sx={{ color: 'text.secondary', mb: 3 }}>
                  <li>All card types & subtypes</li>
                  <li>Custom moves & abilities</li>
                  <li>Professional templates</li>
                  <li>Complete control</li>
                </Box>
                <NextLink href={Routes.Creator} passHref>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="large" 
                    fullWidth
                    sx={{ py: 1.5 }}
                  >
                    Open Card Designer
                  </Button>
                </NextLink>
              </Paper>
            </Grid>
          </Grid>

          {/* Roadmap Preview */}
          <Box mt={8}>
            <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
              What's Coming
            </Typography>
            <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ mb: 4 }}>
              The future of AI-powered card creation
            </Typography>

            <Grid container spacing={3}>
              {[
                {
                  title: 'Smart Card Generation',
                  description: 'AI creates complete cards with balanced stats, moves, and abilities based on your input.',
                },
                {
                  title: 'Auto-Balancing System',
                  description: 'Competitive game balance ensures cards are fair and tournament-ready.',
                },
                {
                  title: 'Theme-Based Creation',
                  description: 'Generate entire card sets with consistent themes and storylines.',
                },
                {
                  title: 'One-Click Generation',
                  description: 'From concept to finished card in seconds with AI-powered automation.',
                },
              ].map((feature, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Paper 
                    elevation={1} 
                    sx={{ 
                      p: 3, 
                      height: '100%',
                      backgroundColor: 'grey.50',
                      border: '1px solid',
                      borderColor: 'grey.200',
                    }}
                  >
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Newsletter/Updates */}
          <Box 
            mt={8} 
            textAlign="center"
            sx={{
              p: 4,
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              borderRadius: 2,
            }}
          >
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Be the First to Know
            </Typography>
            <Typography variant="body1" paragraph>
              Follow our development progress and be notified when AI card generation goes live!
            </Typography>
            <NextLink href={Routes.Home} passHref>
              <Button 
                variant="contained" 
                color="secondary" 
                size="large"
                sx={{ px: 4, py: 1.5 }}
              >
                Back to Home
              </Button>
            </NextLink>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default AICardGenerationPage;