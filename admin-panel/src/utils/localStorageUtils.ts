// storage-utils.ts

interface StorageUtils {
  setItem(key: string, value: unknown, encrypt?: boolean): Promise<void>;
  getItem<T>(key: string, decrypt?: boolean): Promise<T | null>;
  removeItem(key: string): void;
  clear(): void;
  getAllItems(decrypt?: boolean): Promise<Record<string, unknown>>;
}

// Configuration for crypto
const CRYPTO_CONFIG = {
  name: "AES-GCM",
  length: 256,
  ivLength: 12, // 96 bits is recommended for AES-GCM
};

class SecureStorage implements StorageUtils {
  private secretKey: CryptoKey | null = null;
  private keyPromise: Promise<CryptoKey> | null = null;

  constructor(private secret: string) {
    this.initializeKey();
  }

  private async initializeKey(): Promise<void> {
    if (!this.keyPromise) {
      this.keyPromise = this.importKey(this.secret);
    }
    this.secretKey = await this.keyPromise;
  }

  private async importKey(secret: string): Promise<CryptoKey> {
    // Convert the secret to a CryptoKey
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );

    // Derive a key from the secret
    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: encoder.encode("some-static-salt"), // In production, use a random salt
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      CRYPTO_CONFIG,
      false,
      ["encrypt", "decrypt"]
    );
  }

  private async ensureKey(): Promise<CryptoKey> {
    if (!this.secretKey) {
      await this.initializeKey();
      if (!this.secretKey) {
        throw new Error("Failed to initialize encryption key");
      }
    }
    return this.secretKey;
  }

  private async encrypt(data: string): Promise<string> {
    const key = await this.ensureKey();
    const iv = crypto.getRandomValues(new Uint8Array(CRYPTO_CONFIG.ivLength));
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);

    const encryptedData = await crypto.subtle.encrypt(
      {
        name: CRYPTO_CONFIG.name,
        iv,
      },
      key,
      encodedData
    );

    // Combine IV and encrypted data for storage
    const combined = new Uint8Array(iv.length + encryptedData.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedData), iv.length);

    return btoa(String.fromCharCode(...combined));
  }

  private async decrypt(encryptedData: string): Promise<string> {
    const key = await this.ensureKey();
    const binaryData = Uint8Array.from(atob(encryptedData), (c) =>
      c.charCodeAt(0)
    );

    // Extract IV and encrypted data
    const iv = binaryData.slice(0, CRYPTO_CONFIG.ivLength);
    const data = binaryData.slice(CRYPTO_CONFIG.ivLength);

    const decryptedData = await crypto.subtle.decrypt(
      {
        name: CRYPTO_CONFIG.name,
        iv,
      },
      key,
      data
    );

    return new TextDecoder().decode(decryptedData);
  }

  public async setItem(
    key: string,
    value: unknown,
    encrypt: boolean = true
  ): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      const processedValue = encrypt
        ? await this.encrypt(serializedValue)
        : serializedValue;

      localStorage.setItem(key, processedValue);
    } catch (error) {
      console.error("Error setting item in storage:", error);
      throw error;
    }
  }

  public async getItem<T>(
    key: string,
    decrypt: boolean = true
  ): Promise<T | null> {
    try {
      const value = localStorage.getItem(key);
      if (value === null) return null;

      let processedValue: string;
      if (decrypt) {
        try {
          processedValue = await this.decrypt(value);
        } catch (e) {
          // If decryption fails, try to parse as plain JSON
          processedValue = value;
        }
      } else {
        processedValue = value;
      }

      return JSON.parse(processedValue) as T;
    } catch (error) {
      console.error("Error getting item from storage:", error);
      return null;
    }
  }

  public removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  public clear(): void {
    localStorage.clear();
  }

  public async getAllItems(
    decrypt: boolean = true
  ): Promise<Record<string, unknown>> {
    const result: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        result[key] = await this.getItem(key, decrypt);
      }
    }
    return result;
  }
}

// Create an instance with your secret key (keep this secure!)
export const LocalStorage = new SecureStorage(
  "your-very-strong-secret-key-here-32-chars"
);

