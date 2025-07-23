import { useUser } from '@auth0/nextjs-auth0/client';
import { Button } from '@mui/material';

export const LoginButton = () => {
  const { user, isLoading } = useUser();

  if (isLoading) return <Button disabled>Loading...</Button>;

  if (user) {
    return (
      <Button href="/api/auth/logout" variant="outlined" color="primary">
        Logout
      </Button>
    );
  }
  return (
    <Button href="/login" variant="contained" color="primary">
      Login
    </Button>
  );
};
