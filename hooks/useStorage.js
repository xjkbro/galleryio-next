import { useState, useEffect, useContext } from "react";
import {
    auth,
    projectStorage,
    projectFirestore,
    timestamp,
} from "../firebase/config";
import { UserContext } from "../providers/UserContext";
import { useAuthState } from "react-firebase-hooks/auth";

const useStorage = (file, caption) => {
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [url, setUrl] = useState(null);
    const [user, loading] = useAuthState(auth);
    const { userData, setUserData } = useContext(UserContext);

    useEffect(() => {
        // references
        const storageRef = projectStorage.ref(file.name);
        const collectionRef = projectFirestore.collection("images");
        const userImageCollectionRef = projectFirestore
            .doc(`users/${user.uid}`)
            .collection("images");

        storageRef.put(file).on(
            "state_changed",
            (snap) => {
                let percent = (snap.bytesTransferred / snap.totalBytes) * 100;
                setProgress(percent);
            },
            (err) => {
                setError(err);
            },
            async () => {
                const url = await storageRef.getDownloadURL();
                const createdAt = timestamp();
                console.log(userData);
                collectionRef.add({
                    url,
                    createdAt,
                    caption,
                    userData: userData.user,
                });
                userImageCollectionRef.add({
                    url,
                    createdAt,
                    caption,
                    userData: userData.user,
                });
                setUrl(url);
            }
        );
    }, [file]);
    return { progress, error, url };
};
export default useStorage;
