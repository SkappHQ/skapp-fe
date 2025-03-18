import { db } from '@/lib/db';

export default async function handler(req, res) {
  const { userId } = req.query;

  const user = await db.query(`SELECT * FROM users WHERE id = ${userId}`); // ❌ BAD! Direct injection risk

  res.json(user);
}
