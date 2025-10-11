import { Router } from 'express';
import { prisma } from '../db';

const router = Router();

// POST /user/onboard
router.post('/onboard', async (req, res) => {
  const { uid, email, displayName, role, bio } = req.body;
  if (!uid || !email || !displayName || !role) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  let user = await prisma.user.findUnique({ where: { id: uid } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        id: uid,
        email,
        displayName,
        role,
        bio,
        onboardingComplete: true,
      },
    });
  }
  return res.json(user);
});

export default router;
