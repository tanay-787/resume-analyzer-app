import React, { createContext, useContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, firestore } from "../config/firebaseConfig";
import { useNavigate } from "react-router-dom";
import {
  Notification,
  NotificationGroup,
} from "@progress/kendo-react-notification";

// Define authentication context type
interface AuthContextType {
  user: User | null;
  userToken: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  createUserWithEmail: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  showAuthError: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ 
  children,
}: { 
  children: React.ReactNode 
}) => { 
  const [user, setUser] = useState<User | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          setUserToken(token);

          // Fetch user data from Firestore
          const userDocRef = doc(firestore, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setUser(firebaseUser);
            setIsLoggedIn(true);
            
            // // Check if API key exists
            // const userData = userDoc.data();
            // if (userData.apiKey) {
            //   // User has API key, redirect to analyzer
            //   navigate("/analyze");
            // } else {
            //   // User needs to set API key
            //   navigate("/set-api-key");
            // }
          } else {
            // Create user document if it doesn't exist
            const userData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              createdAt: new Date(),
            };
            
            await setDoc(userDocRef, userData);
            setUser(firebaseUser);
            setIsLoggedIn(true);
            // New user, redirect to API key setup
            navigate("/set-api-key");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
          setIsLoggedIn(false);
        }
      } else {
        setUser(null);
        setUserToken(null);
        setIsLoggedIn(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  // Function to display notification
  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const showAuthError = () => {
    if (!isLoggedIn) {
      showNotification(
        "Authentication Error: You must be logged in to perform this action.",
        "error"
      );
      return false;
    }
    return true;
  };

  // Rest of the code remains unchanged
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const userData = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
      };

      const userDocRef = doc(firestore, "users", result.user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          ...userData,
          createdAt: new Date(),
        });
        
        setIsLoggedIn(true);
        showNotification("Account created successfully", "success");
        // New user, redirect to API key setup
        navigate("/set-api-key");
      } else {
        setIsLoggedIn(true);
        showNotification("Successfully signed in", "success");
        
        // Check if API key exists
        const userData = userDoc.data();
        if (userData.apiKey) {
          // User has API key, redirect to analyzer
          navigate("/analyze");
        } else {
          // User needs to set API key
          navigate("/set-api-key");
        }
      }
    } catch (error) {
      console.error(error);
      showNotification("Failed to sign in with Google", "error");
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true);
      showNotification("Successfully signed in", "success");
      navigate("/set-api-key");
    } catch (error) {
      showNotification(
        "Failed to sign in: Please re-check credentials and try again",
        "error"
      );
    }
  };

  const createUserWithEmail = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      await updateProfile(user, { displayName });

      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
      };

      const userDocRef = doc(firestore, "users", user.uid);
      await setDoc(userDocRef, {
        ...userData,
        createdAt: new Date(),
      });

      setIsLoggedIn(true);
      showNotification("Account created successfully", "success");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      showNotification("Error creating account", "error");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setUser(null);
      showNotification("Successfully signed out", "success");
      navigate("/");
    } catch (error) {
      console.error(error);
      showNotification("Failed to sign out", "error");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userToken,
        isLoggedIn,
        loading,
        signInWithGoogle,
        signInWithEmail,
        createUserWithEmail,
        logout,
        showAuthError
      }}
    >
      {children}

      {/* KendoReact Notification UI */}
      <NotificationGroup style={{ top: '10%', left: '50%', transform: 'translateX(-50%)' }}>
        {notification && (
          <Notification
            type={{ style: notification.type, icon: true }}
            closable={true}
          >
            {notification.message}
          </Notification>
        )}
      </NotificationGroup>
    </AuthContext.Provider>
  );
};

// Custom hook for using authentication
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
