import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, where } from 'firebase/firestore';
import { auth } from './FirebaseHandler';

const storage = getStorage();
const db = getFirestore();

export const uploadImageToFirebase = async (imageBlob, prompt) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated");

        const imageRef = ref(storage, `generated_images/${user.uid}/${Date.now()}.png`);

        await uploadBytes(imageRef, imageBlob);
        const imageUrl = await getDownloadURL(imageRef);

        await addDoc(collection(db, "images"), {
            userId: user.uid,
            username: user.displayName || "Anonymous",
            imageUrl,
            prompt,
            timestamp: new Date(),
        });

        return imageUrl;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
};

export const fetchAllImagesFromFirestore = async () => {
    try {
        const q = query(collection(db, "images"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Error fetching images:", error);
        return [];
    }
};

export const fetchUserImagesFromFirestore = async (userId) => {
    try {
        const q = query(
            collection(db, "images"),
            where("userId", "==", userId), 
            orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error("Error fetching user images:", error);
        return [];
    }
};
