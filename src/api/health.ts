import type { VercelRequest, VercelResponse } from '@vercel/node';
export default async function handler(_: VercelRequest, res: VercelResponse) {
  res.status(200).json({
    status: 'ok',
    time: new Date().toISOString(),
    commit: process.env.VERCEL_GIT_COMMIT_SHA || 'local',
    env: process.env.VERCEL_ENV || 'local'
  });
}
