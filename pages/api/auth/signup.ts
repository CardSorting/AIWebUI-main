import { NextApiRequest, NextApiResponse } from 'next';
import { databaseAPI } from '@lib/DatabaseAPI';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  let initialized = false;
  try {
    await databaseAPI.initialize();
    initialized = true;

    // Input validation
    if (!email.includes('@')) {
      return res.status(400).json({ message: 'Invalid email address' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await databaseAPI.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create new user
    const user = await databaseAPI.createUser(name, email, password);

    return res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error creating user';
    return res.status(500).json({ message: errorMessage });
  } finally {
    if (initialized) {
      try {
        await databaseAPI.close();
      } catch (closeError) {
        console.error('Error closing database connection:', closeError);
      }
    }
  }
}
