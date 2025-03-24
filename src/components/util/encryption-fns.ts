/**
 * 
 * Helper functions for WebCrypto API
 */

export const generateKey = async () => {
    return crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
  };

export const importKey = async (keyString: string) => {
    const keyBuffer = new TextEncoder().encode(keyString);
    return crypto.subtle.importKey(
      "raw",
      keyBuffer,
      { name: "AES-GCM" },
      false,
      ["encrypt", "decrypt"]
    );
  };

export const encryptApiKey = async (apiKey: string) => {
    const key = await generateKey();
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 12-byte IV for AES-GCM
    const encodedApiKey = new TextEncoder().encode(apiKey);
  
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      encodedApiKey
    );
  
    // Convert ArrayBuffer to Uint8Array
    const encryptedBytes = new Uint8Array(encryptedBuffer);
  
    // Combine IV and encrypted data
    const encryptedData = new Uint8Array(iv.length + encryptedBytes.length);
    encryptedData.set(iv, 0);
    encryptedData.set(encryptedBytes, iv.length);
  
    // Convert to Base64 correctly
    return btoa(String.fromCharCode.apply(null, [...encryptedData]));
  };

export const decryptApiKey = async (encryptedData: string, secretKey: string) => {
    const key = await importKey(secretKey);
    const encryptedBytes = new Uint8Array(
      atob(encryptedData)
        .split("")
        .map((char) => char.charCodeAt(0))
    );
  
    const iv = encryptedBytes.slice(0, 12);
    const encryptedContent = encryptedBytes.slice(12);
  
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      encryptedContent
    );
  
    return new TextDecoder().decode(decryptedBuffer);
  };