import type { Request, Response } from "express";

import { supabase } from "../config/supabase.js";
import type { LoginInput, SignupInput } from "../validators/authSchema.js";

function extractBearerToken(authorization?: string) {
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return null;
  }

  const token = authorization.slice("Bearer ".length).trim();
  return token || null;
}

function mapAuthPayload(user: { id: string; email?: string | null }, session?: { access_token: string; refresh_token: string } | null) {
  return {
    user: {
      id: user.id,
      email: user.email ?? null,
    },
    session: session
      ? {
          accessToken: session.access_token,
          refreshToken: session.refresh_token,
        }
      : null,
  };
}

export async function signup(req: Request<unknown, unknown, SignupInput>, res: Response) {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return res.status(400).json({
      message: error.message,
    });
  }

  if (!data.user) {
    return res.status(400).json({
      message: "Signup failed",
    });
  }

  const payload = mapAuthPayload(data.user, data.session);

  const message = data.session
    ? "Signup successful"
    : "Signup successful. Please verify your email before logging in.";

  return res.status(201).json({
    message,
    ...payload,
  });
}

export async function login(req: Request<unknown, unknown, LoginInput>, res: Response) {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user || !data.session) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  return res.status(200).json({
    message: "Login successful",
    ...mapAuthPayload(data.user, data.session),
  });
}

export async function logout(req: Request, res: Response) {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    return res.status(401).json({
      message: "Authorization token is required",
    });
  }

  const { error } = await supabase.auth.admin.signOut(token, "global");

  if (error) {
    return res.status(500).json({
      message: "Unable to revoke session",
    });
  }

  return res.status(200).json({
    message: "Logged out successfully and session revoked",
  });
}

export async function me(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }

  return res.status(200).json({
    user: {
      id: req.user.id,
      email: req.user.email ?? null,
    },
  });
}
