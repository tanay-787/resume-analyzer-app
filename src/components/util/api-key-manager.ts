import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../config/firebaseConfig";
import { decryptApiKey } from "./encryption-fns";
import { User } from "firebase/auth";

/**
 * Retrieves and decrypts the API key for a user
 * @param user The Firebase user object
 * @returns The decrypted API key or null if not found
 */
export const getDecryptedApiKey = async (user: User | null): Promise<string | null> => {
  if (!user) return null;
  
  try {
    const userDoc = await getDoc(doc(firestore, "users", user.uid));
    const userData = userDoc.data();
    
    if (!userData) return null;
    
    // Check if we're using the new encrypted format
    if (userData.isEncrypted && userData.encryptedApiKey) {
      return await decryptApiKey(userData.encryptedApiKey, user.uid);
    }
    
    // Fallback to the old unencrypted format if present
    if (userData.apiKey) {
      return userData.apiKey;
    }
    
    return null;
  } catch (error) {
    console.error("Error retrieving API key:", error);
    return null;
  }
};