import { Router } from 'express';
import { prisma } from '../db';

const router = Router();

// GET /creators?category=&q=&verified=&skip=&take=
router.get('/', async (req, res) => {
  const { category, q, verified, skip = 0, take = 20 } = req.query;
  const where: any = { role: 'creator' };
  if (typeof category === 'string') where.categories = { has: category };
  if (typeof q === 'string' && q.length > 1) where.displayName = { contains: q, mode: 'insensitive' };
  if (typeof verified === 'string') where.verified = verified === 'true';
  const creators = await prisma.user.findMany({
    where,
    skip: Number(skip),
    take: Math.min(Number(take), 50),
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, displayName: true, profilePhotoUrl: true, bio: true, categories: true, verified: true,
      responseTimeHours: true, introVideoUrl: true, pricingTiers: true,
    }
  });
  res.json({ creators });
});

// GET /creators/:id
router.get('/:id', async (req, res) => {
  const creator = await prisma.user.findFirst({
    where: { id: req.params.id, role: 'creator' },
    select: {
      id: true, displayName: true, profilePhotoUrl: true, bio: true, introVideoUrl: true,
      socialLinks: true, verified: true, categories: true, responseTimeHours: true, pricingTiers: true,
    }
  });
  if (!creator) return res.status(404).json({ error: 'Not found' });
  res.json(creator);
});

export default router;
