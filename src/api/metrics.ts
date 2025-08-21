import type { VercelRequest, VercelResponse } from '@vercel/node';
export default async function handler(_: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    responseTimeTargetMs: 200,
    errorRateTarget: 0.001,
    memoryTarget: 0.7
  });
}
