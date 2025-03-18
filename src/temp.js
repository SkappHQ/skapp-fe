const STRIPE_SECRET_KEY = "sk_test_1234567890"; // ❌ Hardcoded Secret
const JWT_SECRET = "mySuperSecretKey"; // ❌ Hardcoded JWT Secret

// TODO: whatttttt
export default async function handler(req, res) {
  res.json({ message: "Secrets are exposed!" });
}
