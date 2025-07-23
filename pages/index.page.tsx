import { FC } from 'react';
import { SEO } from '@layout';
import { Box, Button, Typography, Grid, Paper, Divider, Container, useTheme, alpha } from '@mui/material';
import { siteDescription } from 'src/constants';
import { 
  Brush as BrushIcon, 
  Create as CreateIcon, 
  AutoAwesome as AutoAwesomeIcon,
  AutoFixHigh as AutoFixHighIcon,
  Psychology as PsychologyIcon,
  ImageSearch as ImageSearchIcon, 
  Palette as PaletteIcon,
  EmojiEvents as EmojiEventsIcon,
  Bolt as BoltIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import Image from 'next/image';
import NextLink from 'next/link';
import Routes from '@routes';
import { useType } from '@cardEditor/cardOptions/type';
import banner from '@assets/images/banner.png';
import cardImgPaths from '@utils/cardImgPaths';
import { AICardQuickStart } from '../src/components/homepage/AICardQuickStart';
import { FeatureShowcase } from '../src/components/homepage/FeatureShowcase';

const Home: FC = () => {
  const { pokemonTypes } = useType();
  const theme = useTheme();

  const sectionStyle = {
    p: 4,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 2,
    boxShadow: 3,
  };

  const featureBoxStyle = {
    p: 3,
    bgcolor: theme.palette.background.default,
    borderRadius: 2,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  };

  const iconStyle = {
    fontSize: 48,
    mb: 2,
    color: theme.palette.primary.main,
  };

  return (
    <>
      <SEO
        fullTitle="Pokécardmaker | AI-Powered Custom Pokémon Card Creator"
        description={`${siteDescription} - Create complete Pokémon cards with AI-generated artwork, balanced stats, and custom moves in seconds.`}
      />
      <Container maxWidth="lg">
        <Box sx={{ py: 6 }}>
          {/* Hero Banner */}
          <Paper elevation={3} sx={{ overflow: 'hidden', mb: 6, borderRadius: 2 }}>
            <Image src={banner} layout="responsive" alt="Pokécardmaker banner" />
          </Paper>

          {/* Hero Section */}
          <Box textAlign="center" mb={8}>
            <Typography 
              variant="h1" 
              align="center" 
              gutterBottom 
              sx={{ 
                fontSize: { xs: '2.5rem', md: '3.5rem' }, 
                fontWeight: 'bold',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Create Epic Pokémon Cards
            </Typography>
            <Typography 
              variant="h4" 
              align="center" 
              color="text.secondary" 
              gutterBottom 
              sx={{ mb: 2, fontSize: { xs: '1.5rem', md: '2rem' } }}
            >
              Powered by AI, Designed by You
            </Typography>
            <Typography 
              variant="h6" 
              align="center" 
              color="text.secondary" 
              sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
            >
              Generate complete cards with balanced stats, custom moves, and stunning AI artwork - or design every detail yourself with our advanced editor.
            </Typography>

            {/* Primary CTAs */}
            <Box display="flex" justifyContent="center" gap={3} mb={2} flexWrap="wrap">
              <NextLink href={Routes.AICardGenerator} passHref>
                <Button 
                  variant="contained" 
                  startIcon={<AutoFixHighIcon />} 
                  size="large" 
                  color="primary" 
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                      transform: 'translateY(-1px)',
                      boxShadow: 6,
                    }
                  }}
                >
                  AI Generate Complete Card
                </Button>
              </NextLink>
              <NextLink href={Routes.AIImageGenerator} passHref>
                <Button 
                  variant="outlined" 
                  startIcon={<BrushIcon />} 
                  size="large" 
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    fontSize: '1.1rem',
                    borderWidth: 2,
                    borderRadius: 2,
                    '&:hover': {
                      borderWidth: 2,
                      transform: 'translateY(-1px)',
                      boxShadow: 4,
                    }
                  }}
                >
                  Generate AI Art Only
                </Button>
              </NextLink>
              <NextLink href={Routes.Creator} passHref>
                <Button 
                  variant="text" 
                  startIcon={<CreateIcon />} 
                  size="large" 
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    fontSize: '1.1rem',
                    borderRadius: 2,
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    }
                  }}
                >
                  Manual Designer
                </Button>
              </NextLink>
            </Box>

            {/* Feature badges */}
            <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap" mb={8}>
              <Box display="flex" alignItems="center" color="text.secondary">
                <BoltIcon sx={{ fontSize: 18, mr: 0.5 }} />
                <Typography variant="caption">Lightning Fast</Typography>
              </Box>
              <Box display="flex" alignItems="center" color="text.secondary">
                <PsychologyIcon sx={{ fontSize: 18, mr: 0.5 }} />
                <Typography variant="caption">AI Powered</Typography>
              </Box>
              <Box display="flex" alignItems="center" color="text.secondary">
                <TrendingUpIcon sx={{ fontSize: 18, mr: 0.5 }} />
                <Typography variant="caption">Balanced Stats</Typography>
              </Box>
            </Box>
          </Box>

          {/* AI Quick Start Section */}
          <Box mb={8}>
            <AICardQuickStart />
          </Box>

          <Divider sx={{ my: 8 }} />

          {/* Feature Showcase */}
          <FeatureShowcase />

          <Divider sx={{ my: 8 }} />

          {/* Final CTA Section */}
          <Box 
            textAlign="center" 
            sx={{
              p: 6,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            <Typography variant="h2" gutterBottom sx={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
              Ready to Create Your Dream Pokémon Card?
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 4, fontSize: '1.1rem', maxWidth: 700, mx: 'auto' }}>
              Join thousands of creators who have brought their Pokémon visions to life. Whether you want instant AI generation or detailed customization, we have the perfect tool for you.
            </Typography>
            <Box display="flex" justifyContent="center" gap={3} flexWrap="wrap">
              <NextLink href={Routes.AICardGenerator} passHref>
                <Button 
                  variant="contained" 
                  startIcon={<AutoFixHighIcon />} 
                  size="large" 
                  color="primary" 
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    borderRadius: 2,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                      transform: 'translateY(-2px)',
                      boxShadow: 8,
                    }
                  }}
                >
                  Start with AI Generation
                </Button>
              </NextLink>
              <NextLink href={Routes.Creator} passHref>
                <Button 
                  variant="outlined" 
                  startIcon={<CreateIcon />} 
                  size="large" 
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    borderWidth: 2,
                    borderRadius: 2,
                    '&:hover': {
                      borderWidth: 2,
                      transform: 'translateY(-2px)',
                      boxShadow: 6,
                    }
                  }}
                >
                  Use Manual Designer
                </Button>
              </NextLink>
            </Box>

            <Box mt={4} display="flex" justifyContent="center" gap={4} flexWrap="wrap">
              <Typography variant="body2" color="text.secondary" display="flex" alignItems="center">
                <PsychologyIcon sx={{ fontSize: 16, mr: 0.5 }} />
                AI-Powered Generation
              </Typography>
              <Typography variant="body2" color="text.secondary" display="flex" alignItems="center">
                <BoltIcon sx={{ fontSize: 16, mr: 0.5 }} />
                Lightning Fast Results
              </Typography>
              <Typography variant="body2" color="text.secondary" display="flex" alignItems="center">
                <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} />
                Competitive Balance
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Home;