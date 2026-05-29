import type { CookieOptions, Request, Response } from "express";

import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";
import { supabase, supabaseAdmin } from "../config/supabase.js";
import type { LoginInput, SignupInput } from "../validators/authSchema.js";

const REFRESH_TOKEN_COOKIE_NAME = "rh_refresh_token";

function getRefreshCookieOptions(): CookieOptions {
  const isProduction = env.nodeEnv === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/api/v1/auth",
    maxAge: 1000 * 60 * 60 * 24 * 30,
  };
}

function setRefreshTokenCookie(res: Response, refreshToken: string) {
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, getRefreshCookieOptions());
}

function clearRefreshTokenCookie(res: Response) {
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
    ...getRefreshCookieOptions(),
    maxAge: undefined,
  });
}

function extractBearerToken(authorization?: string) {
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return null;
  }

  const token = authorization.slice("Bearer ".length).trim();
  return token || null;
}

function isDuplicateUsernameAuthError(message: string): boolean {
  const normalizedMessage = message.toLowerCase();

  return normalizedMessage.includes("username") || normalizedMessage.includes("users_username_key");
}

async function getUsernameByAuthId(authId: string): Promise<string | null> {
  const publicUser = await prisma.public_users.findUnique({
    where: {
      auth_id: authId,
    },
    select: {
      username: true,
    },
  });

  return publicUser?.username ?? null;
}

function mapAuthPayload(
  user: { id: string; email?: string | null },
  username: string | null,
  session?: { access_token: string } | null,
) {
  return {
    user: {
      id: user.id,
      email: user.email ?? null,
      username,
    },
    session: session
      ? {
          accessToken: session.access_token,
        }
      : null,
  };
}

export async function signup(req: Request<unknown, unknown, SignupInput>, res: Response) {
  const { username, email, password } = req.body;
  const standardUsername = username.toLowerCase();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: standardUsername,
      },
    },
  });

  if (error) {
    if (isDuplicateUsernameAuthError(error.message)) {
      return res.status(409).json({
        message: "Username is already taken",
      });
    }

    return res.status(400).json({
      message: error.message,
    });
  }

  if (!data.user) {
    return res.status(400).json({
      message: "Signup failed",
    });
  }

  const payload = mapAuthPayload(data.user, standardUsername, data.session);

  if (data.session?.refresh_token) {
    setRefreshTokenCookie(res, data.session.refresh_token);
  }

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

  const username = await getUsernameByAuthId(data.user.id);

  setRefreshTokenCookie(res, data.session.refresh_token);

  return res.status(200).json({
    message: "Login successful",
    ...mapAuthPayload(data.user, username, data.session),
  });
}

export async function logout(req: Request, res: Response) {
  clearRefreshTokenCookie(res);

  const token = extractBearerToken(req.headers.authorization);

  if (token) {
    await supabaseAdmin.auth.admin.signOut(token, "global");
  }

  return res.status(200).json({
    message: "Logged out successfully and session revoked",
  });
}

export async function refreshSession(req: Request, res: Response) {
  const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];

  if (!refreshToken) {
    clearRefreshTokenCookie(res);
    return res.status(401).json({
      message: "Refresh token is required",
    });
  }

  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: refreshToken,
  });

  if (error || !data.user || !data.session?.refresh_token) {
    clearRefreshTokenCookie(res);
    return res.status(401).json({
      message: "Invalid or expired refresh token",
    });
  }

  setRefreshTokenCookie(res, data.session.refresh_token);

  const username = await getUsernameByAuthId(data.user.id);

  return res.status(200).json({
    message: "Session refreshed",
    ...mapAuthPayload(data.user, username, data.session),
  });
}

export async function me(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }

  const username = await getUsernameByAuthId(req.user.id);

  return res.status(200).json({
    user: {
      id: req.user.id,
      email: req.user.email ?? null,
      username,
    },
  });
}
