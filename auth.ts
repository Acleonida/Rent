import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config';
import { User, UserRole, SignupForm, LoginForm } from '../../shared/types';

// Auth state listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const user = await getUserById(firebaseUser.uid);
      callback(user);
    } else {
      callback(null);
    }
  });
};

// Sign in with email and password
export const signIn = async (credentials: LoginForm): Promise<User> => {
  try {
    const { user: firebaseUser } = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    );
    
    const user = await getUserById(firebaseUser.uid);
    if (!user) {
      throw new Error('User profile not found');
    }
    
    return user;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign in');
  }
};

// Sign up with email and password
export const signUp = async (userData: SignupForm): Promise<User> => {
  try {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );

    // Create user profile
    const user: Omit<User, 'id'> = {
      email: userData.email,
      displayName: userData.displayName,
      phoneNumber: userData.phoneNumber,
      role: userData.role,
      createdAt: new Date(),
      updatedAt: new Date(),
      province: 'Davao del Sur',
      isVerified: false,
      rating: 0,
      totalReviews: 0
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), user);

    // Update Firebase Auth profile
    await updateProfile(firebaseUser, {
      displayName: userData.displayName
    });

    return { id: firebaseUser.uid, ...user };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create account');
  }
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<User> => {
  try {
    const provider = new GoogleAuthProvider();
    const { user: firebaseUser } = await signInWithPopup(auth, provider);
    
    // Check if user profile exists
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    
    if (!userDoc.exists()) {
      // Create new user profile
      const user: Omit<User, 'id'> = {
        email: firebaseUser.email!,
        displayName: firebaseUser.displayName || 'User',
        photoURL: firebaseUser.photoURL || undefined,
        role: UserRole.RENTER,
        createdAt: new Date(),
        updatedAt: new Date(),
        province: 'Davao del Sur',
        isVerified: false,
        rating: 0,
        totalReviews: 0
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), user);
      return { id: firebaseUser.uid, ...user };
    } else {
      return { id: firebaseUser.uid, ...userDoc.data() } as User;
    }
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign in with Google');
  }
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign out');
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to send password reset email');
  }
};

// Get user by ID
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() } as User;
    }
    return null;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get user');
  }
};

// Update user profile
export const updateUserProfile = async (
  userId: string,
  updates: Partial<Omit<User, 'id' | 'email' | 'createdAt'>>
): Promise<User> => {
  try {
    const userRef = doc(db, 'users', userId);
    const updateData = {
      ...updates,
      updatedAt: new Date()
    };
    
    await updateDoc(userRef, updateData);
    
    const updatedUser = await getUserById(userId);
    if (!updatedUser) {
      throw new Error('User not found');
    }
    
    return updatedUser;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update profile');
  }
};

// Upgrade user to lessor
export const upgradeToLessor = async (userId: string): Promise<User> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      role: UserRole.LESSOR,
      updatedAt: new Date()
    });
    
    const updatedUser = await getUserById(userId);
    if (!updatedUser) {
      throw new Error('User not found');
    }
    
    return updatedUser;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to upgrade to lessor');
  }
};

// Get current user
export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
}; 