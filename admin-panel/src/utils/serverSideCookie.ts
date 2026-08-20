"use server";
import { envConfig } from "@/config/env.config";
import CryptoJS from "crypto-js";
import { cookies } from "next/headers";

const ENCRYPTION_KEY = envConfig.encryptionKey;
if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length < 32) {
  throw new Error(
    "Invalid COOKIE_ENCRYPTION_KEY - must be at least 32 characters"
  );
}

/**
 * Encrypts data for cookie storage using AES
 */
function encryptData(data: any): string {
  try {
    return CryptoJS.AES.encrypt(
      JSON.stringify(data),
      ENCRYPTION_KEY
    ).toString();
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Failed to encrypt data");
  }
}

/**
 * Decrypts data from cookie storage
 */
function decryptData(encryptedData: string): any {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) {
      throw new Error("Decryption failed - empty result");
    }

    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}

/**
 * Sets an encrypted cookie
 */
export async function setServerCookie(
  name: string,
  value: any,
  options: {
    maxAge?: number;
    path?: string;
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: "lax" | "strict" | "none";
  } = {}
): Promise<void> {
  const encryptedValue = encryptData(value);
  const cookieStore = await cookies();
  cookieStore.set({
    name,
    value: encryptedValue,
    ...options,
    httpOnly: options.httpOnly ?? true,
    secure: options.secure ?? process.env.NODE_ENV === "production",
    sameSite: options.sameSite ?? "strict",
    path: options.path ?? "/",
  });
}

/**
 * Gets and decrypts a cookie value
 */
export async function getServerCookie(name: string): Promise<any> {
  const cookieStore = await cookies();
  const encryptedValue = cookieStore?.get(name)?.value;
  if (!encryptedValue) return null;

  return await decryptData(encryptedValue);
}

/**
 * Deletes a cookie
 */
export async function deleteServerCookie(name: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set({
    name,
    value: "",
    maxAge: 0,
    path: "/",
  });
}

/**
 * Gets all cookies (does not decrypt)
 */
export async function getAllServerCookies(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const allCookies: Record<string, string> = {};
  cookieStore.getAll().forEach((cookie) => {
    allCookies[cookie.name] = cookie.value;
  });

  return allCookies;
}
