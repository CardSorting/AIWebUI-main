import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import type { Session } from "next-auth";
import { databaseAPI } from '@lib/DatabaseAPI';
import { authOptions } from './auth/[...nextauth]';
import { AIGenerationRequest, AIGenerationResponse } from '@features/aiCardGeneration/types';
import { CardInterface } from '@cardEditor/types';
import { nanoid } from 'nanoid';

// AI prompts for card generation
const PROMPTS = {
  stats: (request: AIGenerationRequest) => `
You are a Pokemon card game designer. Generate balanced stats for a ${request.pokemonName} card.

Card Details:
- Name: ${request.pokemonName}
- Type: ${getTypeName(request.typeId)}
- Subtype: ${getSubtypeName(request.subtypeId)}
- Power Level: ${request.powerLevel}
- Concept: ${request.concept || 'Standard Pokemon card'}

Generate ONLY a JSON response with:
{
  "hitpoints": number (40-80 for low, 80-150 for medium, 150+ for high),
  "weaknessTypeId": number (type that this Pokemon is weak to),
  "weaknessAmount": number (typically 2 for x2 weakness),
  "resistanceTypeId": number (type this Pokemon resists, or null),
  "resistanceAmount": number (typically 30, or 0 if no resistance),
  "retreatCost": number (0-4 energy cost to retreat)
}

Make the stats balanced for competitive play.`,

  moves: (request: AIGenerationRequest) => `
You are a Pokemon card game designer. Generate ${request.powerLevel === 'low' ? '1-2' : request.powerLevel === 'medium' ? '2' : '2-3'} moves for ${request.pokemonName}.

Card Details:
- Name: ${request.pokemonName}
- Type: ${getTypeName(request.typeId)}
- Power Level: ${request.powerLevel}
- Concept: ${request.concept || 'Standard Pokemon attacks'}
${request.customPrompts?.moves ? `- Custom Requirements: ${request.customPrompts.moves}` : ''}

Generate ONLY a JSON array of moves:
[
  {
    "name": "Move Name",
    "description": "Move effect description (keep under 100 characters)",
    "damageAmount": "20" (or "20+" or "10×" for variable damage),
    "energyCost": [
      {"amount": 1, "typeId": ${request.typeId}},
      {"amount": 1, "typeId": 11}
    ]
  }
]

Energy cost guidelines:
- Low power: 1-2 total energy, 10-30 damage
- Medium power: 2-3 total energy, 30-80 damage  
- High power: 3-4 total energy, 80-150+ damage
- TypeId 11 = Colorless (any energy)
- Include type-specific energy matching the Pokemon's type`,

  ability: (request: AIGenerationRequest) => `
You are a Pokemon card game designer. Generate 1 ability for ${request.pokemonName}.

Card Details:
- Name: ${request.pokemonName}
- Type: ${getTypeName(request.typeId)}
- Power Level: ${request.powerLevel}
- Concept: ${request.concept || 'Standard Pokemon ability'}
${request.customPrompts?.ability ? `- Custom Requirements: ${request.customPrompts.ability}` : ''}

Generate ONLY a JSON object:
{
  "name": "Ability Name",
  "description": "Ability effect description (keep under 120 characters)"
}

Make the ability thematic to the Pokemon and balanced for competitive play.`,

  flavor: (request: AIGenerationRequest) => `
You are a Pokemon card game writer. Generate flavor text for ${request.pokemonName}.

Card Details:
- Name: ${request.pokemonName}
- Type: ${getTypeName(request.typeId)}
- Concept: ${request.concept || 'Standard Pokemon'}
${request.customPrompts?.flavor ? `- Custom Requirements: ${request.customPrompts.flavor}` : ''}

Generate ONLY a JSON object:
{
  "dexEntry": "Pokedex entry (keep under 80 characters)",
  "illustrator": "AI Generated"
}

Write engaging, Pokemon-style flavor text that fits the card theme.`
};

// Helper functions for type names
function getTypeName(typeId: number): string {
  const types: Record<number, string> = {
    1: 'Grass', 2: 'Fire', 3: 'Water', 4: 'Lightning', 5: 'Psychic',
    6: 'Fighting', 7: 'Dark', 8: 'Metal', 9: 'Fairy', 10: 'Dragon', 11: 'Colorless'
  };
  return types[typeId] || 'Unknown';
}

function getSubtypeName(subtypeId?: number): string {
  const subtypes: Record<number, string> = {
    1: 'Basic', 2: 'Stage 1', 3: 'Stage 2', 4: 'V', 5: 'VMax', 6: 'VStar'
  };
  return subtypes[subtypeId || 1] || 'Basic';
}

const CREDIT_COST_CARD_GENERATION = 10;
const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export { config };

export default async function handler(req: NextApiRequest, res: NextApiResponse<AIGenerationResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      cardData: {} as CardInterface, 
      creditsUsed: 0, 
      remainingCredits: 0 
    });
  }

  const session = await getServerSession(req, res, authOptions) as Session | null;
  if (!session?.user) {
    return res.status(401).json({ 
      success: false, 
      cardData: {} as CardInterface, 
      creditsUsed: 0, 
      remainingCredits: 0 
    });
  }

  try {
    const request: AIGenerationRequest = req.body;
    
    if (!request.pokemonName || typeof request.pokemonName !== 'string') {
      return res.status(400).json({ 
        success: false, 
        cardData: {} as CardInterface, 
        creditsUsed: 0, 
        remainingCredits: 0 
      });
    }

    await databaseAPI.initialize();

    // Check user credits
    const user = await databaseAPI.getUserById(session.user.id);
    if (!user || user.credits < CREDIT_COST_CARD_GENERATION) {
      return res.status(403).json({ 
        success: false, 
        cardData: {} as CardInterface, 
        creditsUsed: 0, 
        remainingCredits: user ? user.credits : 0 
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        success: false, 
        cardData: {} as CardInterface, 
        creditsUsed: 0, 
        remainingCredits: user.credits 
      });
    }

    // Generate card components using AI
    const [statsResult, movesResult, abilityResult, flavorResult] = await Promise.all([
      generateWithGemini(apiKey, PROMPTS.stats(request)),
      request.generateMoves ? generateWithGemini(apiKey, PROMPTS.moves(request)) : Promise.resolve(null),
      request.generateAbility ? generateWithGemini(apiKey, PROMPTS.ability(request)) : Promise.resolve(null),
      generateWithGemini(apiKey, PROMPTS.flavor(request))
    ]);

    // Parse AI responses
    const stats = JSON.parse(statsResult);
    const moves = movesResult ? JSON.parse(movesResult) : [];
    const ability = abilityResult ? JSON.parse(abilityResult) : null;
    const flavor = JSON.parse(flavorResult);

    // Generate artwork using existing image generation system
    const artworkPrompt = request.customPrompts?.artwork || 
      `${request.pokemonName} Pokemon, ${request.artworkStyle} style, ${getTypeName(request.typeId)} type, high quality artwork`;
    
    const artworkResult = await generateArtwork(apiKey, artworkPrompt, session.user.id);

    // Construct final card data
    const cardData: CardInterface = {
      // Basic info
      name: request.pokemonName,
      baseSetId: request.baseSetId,
      supertypeId: request.supertypeId,
      typeId: request.typeId,
      subtypeId: request.subtypeId,
      backgroundColor: 'white',
      
      // Generated stats
      hitpoints: stats.hitpoints,
      weaknessTypeId: stats.weaknessTypeId,
      weaknessAmount: stats.weaknessAmount,
      weaknessModifier: '×' as const,
      resistanceTypeId: stats.resistanceTypeId || undefined,
      resistanceAmount: stats.resistanceAmount || undefined,
      resistanceModifier: '-' as const,
      retreatCost: stats.retreatCost,
      
      // Generated content
      images: [{
        id: nanoid(),
        name: `${request.pokemonName} Artwork`,
        order: 0,
        behindTemplate: true,
        src: artworkResult.imageUrl
      }],
      
      moves: [
        // Add ability as first "move" if generated
        ...(ability ? [{
          id: nanoid(),
          name: ability.name,
          description: ability.description,
          order: 0,
        }] : []),
        // Add generated moves
        ...moves.map((move: any, index: number) => ({
          id: nanoid(),
          name: move.name,
          description: move.description,
          order: ability ? index + 1 : index,
          type: 'default' as const,
          damageAmount: move.damageAmount,
          energyCost: move.energyCost
        }))
      ],
      
      // Flavor text
      dexEntry: flavor.dexEntry,
      illustrator: flavor.illustrator,
      
      // Default values
      setIconId: 1,
      rotationIconId: 2,
      rarityIconId: 1,
      typeImgId: 11,
    };

    // Validate generated card
    const validation = validateCardData(cardData);
    if (!validation.isValid) {
      return res.status(400).json({ 
        success: false, 
        cardData, 
        creditsUsed: 0, 
        remainingCredits: user.credits,
        warnings: validation.errors 
      });
    }

    // Deduct credits
    await databaseAPI.updateUserCredits(session.user.id, -CREDIT_COST_CARD_GENERATION);

    return res.status(200).json({
      success: true,
      cardData,
      creditsUsed: CREDIT_COST_CARD_GENERATION,
      remainingCredits: user.credits - CREDIT_COST_CARD_GENERATION,
      generationId: nanoid(),
      warnings: validation.warnings
    });

  } catch (error) {
    console.error('Card generation error:', error);
    return res.status(500).json({ 
      success: false, 
      cardData: {} as CardInterface, 
      creditsUsed: 0, 
      remainingCredits: 0 
    });
  } finally {
    await databaseAPI.close();
  }
}

async function generateWithGemini(apiKey: string, prompt: string): Promise<string> {
  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  let text = response.text();
  
  // Clean up response to ensure valid JSON
  text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  
  return text;
}

async function generateArtwork(apiKey: string, prompt: string, userId: string) {
  // Use existing Python script for image generation
  const pythonProcess = require('child_process').spawn('python3', [
    'scripts/generate_image.py',
    apiKey,
    prompt,
    '400',
    '400'
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
    throw new Error(`Image generation failed: ${error}`);
  }

  const pythonResult = JSON.parse(result);
  if (!pythonResult.success) {
    throw new Error(pythonResult.error || 'Failed to generate artwork');
  }

  const imageBuffer = Buffer.from(pythonResult.image, 'base64');
  
  // Save image to database
  const imageMetadata = await databaseAPI.saveImageMetadata({
    prompt,
    imageData: imageBuffer,
    width: 400,
    height: 400,
    contentType: 'image/jpeg',
    seed: 0,
    hasNsfwConcepts: "false",
    fullResult: JSON.stringify(pythonResult.response),
    userId: userId,
  });

  return {
    imageUrl: `/api/images/${imageMetadata.id}`,
    metadata: imageMetadata
  };
}

function validateCardData(card: CardInterface): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!card.name) errors.push('Card name is required');
  if (!card.hitpoints || card.hitpoints < 10) errors.push('Invalid HP value');
  if (!card.images || card.images.length === 0) errors.push('Card must have artwork');
  
  // Reasonable ranges
  if (card.hitpoints && card.hitpoints > 500) warnings.push('HP seems very high');
  if (card.retreatCost && card.retreatCost > 5) warnings.push('Retreat cost seems very high');
  
  // Move validation
  if (card.moves) {
    card.moves.forEach((move, index) => {
      if (!move.name) errors.push(`Move ${index + 1} missing name`);
      if (!move.description) errors.push(`Move ${index + 1} missing description`);
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}