import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import B2 from 'backblaze-b2';
import { databaseAPI } from '@lib/DatabaseAPI';
import type { ImageMetadata } from '@lib/DatabaseAPI';
import { authOptions } from './auth/[...nextauth]';

interface ApiResponse {
  imageUrl: string | null;
  backblazeUrl: string | null;
  fullResult: any;
  imageMetadata?: {
    id: string;
    backblazeUrl: string;
  };
  creditsUsed: number;
  remainingCredits: number;
}

const CREDIT_COST_PER_MEGAPIXEL = 5; // Adjust this value based on your pricing strategy

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions) as Session | null;
  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { prompt, imageSize = "1024x576" } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required and must be a string.' });
  }

  try {
    await databaseAPI.initialize();

    const [width, height] = imageSize.split('x').map(Number);
    const megapixels = (width * height) / 1000000;
    const creditCost = Math.ceil(megapixels * CREDIT_COST_PER_MEGAPIXEL);

    const user = await databaseAPI.getUserById(session.user.id);
    if (!user || user.credits < creditCost) {
      return res.status(403).json({ 
        error: 'Insufficient credits',
        required: creditCost,
        available: user ? user.credits : 0
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Server configuration error: GEMINI_API_KEY is missing.' });
    }

    // Use Python script to generate image since TypeScript SDK doesn't support image generation
    const pythonProcess = require('child_process').spawn('python3', [
      'scripts/generate_image.py',
      apiKey,
      prompt,
      width.toString(),
      height.toString()
    ]);

    let result = '';
    for await (const chunk of pythonProcess.stdout) {
      result += chunk;
    }

    let error = '';
    for await (const chunk of pythonProcess.stderr) {
      error += chunk;
    }

    if (error) {
      throw new Error(`Python script error: ${error}`);
    }

    const pythonResult = JSON.parse(result);
    if (!pythonResult.success) {
      throw new Error(pythonResult.error || 'Failed to generate image');
    }

    const imageBuffer = Buffer.from(pythonResult.image, 'base64');
    
    const imageMetadata = await databaseAPI.saveImageMetadata({
      prompt,
      imageData: imageBuffer,
      width: width,
      height: height,
      contentType: 'image/jpeg',
      seed: 0,
      hasNsfwConcepts: "false",
      fullResult: JSON.stringify(pythonResult.response),
      userId: session.user.id as string,
    } as Omit<ImageMetadata, 'id' | 'createdAt'>);

    await databaseAPI.updateUserCredits(session.user.id, -creditCost);

    const responsePayload: ApiResponse = {
      imageUrl: `/api/images/${imageMetadata.id}`,
      backblazeUrl: null,
      fullResult: pythonResult.response,
      imageMetadata: {
        id: imageMetadata.id.toString(),
        backblazeUrl: '',
      },
      creditsUsed: creditCost,
      remainingCredits: user.credits - creditCost
    };

    return res.status(200).json(responsePayload);

  } catch (error) {
    return handleError(error, res);
  } finally {
    await databaseAPI.close();
  }
}


function handleError(error: unknown, res: NextApiResponse) {
  if (error instanceof Error) {
    let errorMessage = error.message;
    let statusCode = 500;

    if (error.message.toLowerCase().includes('network')) {
      errorMessage = 'A network error occurred. Please check your connection and try again.';
      statusCode = 503;
    } else if (error.message.toLowerCase().includes('timeout')) {
      errorMessage = 'The request timed out. Please try again later.';
      statusCode = 504;
    } else if (error.message.toLowerCase().includes('rate limit')) {
      errorMessage = 'Rate limit exceeded. Please try again later.';
      statusCode = 429;
    }

    return res.status(statusCode).json({
      error: 'Failed to generate image',
      message: errorMessage,
      timestamp: new Date().toISOString(),
      requestId: res.req.headers['x-request-id'] || 'unknown'
    });
  } else {
    return res.status(500).json({
      error: 'An unexpected error occurred',
      message: 'An unknown error occurred while processing your request.',
      timestamp: new Date().toISOString(),
      requestId: res.req.headers['x-request-id'] || 'unknown'
    });
  }
}
