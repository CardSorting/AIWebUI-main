import { CacheProvider, EmotionCache, ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { AppProps as NextAppProps } from 'next/app';
import { FC, useEffect } from 'react';
import { createEmotionCache } from '@css';
import { Footer, Header } from '@layout';
import CookieConsent from '@components/CookieConsent';
import { GoogleTagManagerScript } from '@features/analytics/components/GTM';
import { useRouter } from 'next/router';
import { useSettingsStore } from '@features/settings';
import { getTheme } from '@utils/theme';
import { Background, MainContainer } from './styles';
import { SessionProvider } from 'next-auth/react';

interface AppProps extends NextAppProps {
  emotionCache: EmotionCache;
  pageProps: {
    session?: any;
    [key: string]: any;
  };
}

const clientSideCache = createEmotionCache();

const App: FC<AppProps> = ({
  emotionCache = clientSideCache,
  Component,
  pageProps,
}) => {
  const router = useRouter();
  const theme = useSettingsStore(store => store.theme);

  useEffect(() => {
    const handleRouteChange = () => {
      // Removed GoatCounter tracking or custom logic can be added here
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <SessionProvider session={pageProps.session}>
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={getTheme(theme)}>
          <GoogleTagManagerScript />
          <CssBaseline />
          <Background>
            <CookieConsent />
            <Header />
            <MainContainer as="main">
              <Component {...pageProps} />
            </MainContainer>
            <Footer />
          </Background>
        </ThemeProvider>
      </CacheProvider>
    </SessionProvider>
  );
};

export default App;
