import {auth} from './FirebaseHandler';
import {
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
  } from "firebase/auth";

import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"
const db = getFirestore()

export const doCreateUserWithEmailAndPassword = async (email, password, username ) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        await updateProfile(user, { displayName: username })

        await setDoc(doc(db, "users", user.uid), {
            username: username,
            email: email,
            createdAt: new Date(),
        })

        console.log("User registered successfully!")
    } catch (error) {
        console.error("Error registering user:", error.message)
        throw error
    }
};

export const doSignInWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    const user = result.user;
    
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
        await setDoc(userDocRef, {
            username: user.displayName || "Google User",
            email: user.email,
            createdAt: new Date(),
        });
        console.log("Google user document created in Firestore!");
    } else {
        const existingData = userDoc.data();
        if (existingData.username !== user.displayName) {
            await setDoc(userDocRef, {
                ...existingData,
                username: user.displayName || existingData.username,
            }, { merge: true });
            console.log("Updated username to match Google displayName");
        }
    }

    return result;
};

export const doSignOut = () => {
    return auth.signOut(auth);
};

