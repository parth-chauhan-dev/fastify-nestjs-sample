import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';

export function verifySubscriptionToken(token: string): any {
  if (!token) {
    throw new Error('Token is required');
  }

  const publicKey = fs.readFileSync(process.env.JWT_PUBLIC_KEY_PATH!, 'utf-8');
  try {
    return jwt.verify(token, publicKey, { algorithms: ['RS256'] });
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export function extractTokenFromConnectionParams(
  connectionParams: any,
): string | null {
  const header =
    connectionParams?.Authorization || connectionParams?.authorization;
  return header ? header.split(' ')[1] : null;
}
