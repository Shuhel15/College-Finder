import crypto from "crypto";

import {
  setEmailOtp,
  getEmailOtp,
  deleteEmailOtp,
} from "@/lib/redis";

export function generateOtp(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

export async function storeOtp(
  email: string,
  otp: string,
): Promise<boolean> {
  return setEmailOtp(email, otp);
}

export async function getOtp(
  email: string,
): Promise<string | null> {
  return getEmailOtp(email);
}

export async function deleteOtp(
  email: string,
): Promise<void> {
  await deleteEmailOtp(email);
}