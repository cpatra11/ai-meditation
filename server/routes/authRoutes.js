import express from "express";
import jwt from "jsonwebtoken"; // Import jsonwebtoken

const authRoutes = express.Router();

authRoutes.get("/", (_, res) => {
  res.send("Welcome to the auth routes");
});

authRoutes.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ message: "Login successful", token });
    } else {
      console.error("Invalid login attempt", { email });
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Problem logging in" });
  }
});

export default authRoutes;
