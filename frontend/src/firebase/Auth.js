import {auth} from './FirebaseHandler';
import {
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
  } from "firebase/auth";

import { getFirestore, doc, setDoc } from "firebase/firestore"
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

    return result;
};

export const doSignOut = () => {
    return auth.signOut(auth);
};

