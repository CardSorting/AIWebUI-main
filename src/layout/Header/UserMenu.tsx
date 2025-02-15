import { FC } from 'react';
import { useSession, signOut } from 'next-auth/react';
import type { Session } from 'next-auth';

interface CustomSession extends Session {
  user: {
    id: string;
    name: string;
    email: string;
    credits: number;
  }
}
import { useRouter } from 'next/router';
import {
  Avatar,
  Box,
  Button,
  Typography,
  Chip,
} from '@mui/material';
import { LogoutOutlined as LogoutIcon } from '@mui/icons-material';
import NextLink from 'next/link';
import Routes from '@routes';

const UserMenu: FC = () => {
  const { data: session } = useSession() as { data: CustomSession | null };
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push(Routes.Home);
  };

  if (!session) {
    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <NextLink href="/login" passHref>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
            }}
          >
            Log in
          </Button>
        </NextLink>
        <NextLink href="/login?tab=signup" passHref>
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
            }}
          >
            Sign up
          </Button>
        </NextLink>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Chip
        color="primary"
        label={`${session.user?.credits || 0} Credits`}
        sx={{ fontWeight: 'bold' }}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: 'primary.main',
            fontSize: '0.875rem',
          }}
        >
          {session.user?.name?.[0]?.toUpperCase() || 'U'}
        </Avatar>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            {session.user?.name}
          </Typography>
        </Box>
        <Button
          onClick={handleSignOut}
          color="inherit"
          size="small"
          startIcon={<LogoutIcon />}
          sx={{ ml: 1 }}
        >
          Sign out
        </Button>
      </Box>
    </Box>
  );
};

export default UserMenu;
