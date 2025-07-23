import type { DefaultSession, DefaultUser } from 'next-auth';
import type { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User extends DefaultUser {
    id: string;
    credits: number;
    membershipTier?: string;
    membershipExpiry?: Date;
  }

  interface Session extends DefaultSession {
    user: User & DefaultSession['user'];
    expires: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    credits: number;
    membershipTier?: string;
    membershipExpiry?: Date;
  }
}

export interface AuthCallbacks {
  jwt: {
    token: JWT;
    user?: User;
    trigger?: 'signIn' | 'signUp' | 'update';
    session?: Session;
  };
  session: {
    session: Session;
    token: JWT;
    user?: User;
  };
}
