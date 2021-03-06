import { useState, useEffect, useContext } from "react";
import {
    auth,
    projectStorage,
    projectFirestore,
    timestamp,
} from "../firebase/config";
import { UserContext } from "../providers/UserContext";
import { useAuthState } from "react-firebase-hooks/auth";

const useStorage = (file, tags, caption, exifInfo) => {
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [url, setUrl] = useState(null);
    const [user, loading] = useAuthState(auth);
    const { userData, setUserData } = useContext(UserContext);

    useEffect(() => {
        // References
        // Reference to file
        const storageRef = projectStorage.ref(file.name);
        const collectionRef = projectFirestore.collection("images");
        const userImageCollectionRef = projectFirestore
            .doc(`users/${user.uid}`)
            .collection("images");
        projectFirestore.doc(`users/${user.uid}`);
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
                let insert = {
                    url,
                    createdAt,
                    caption,
                    tags,
                    exif: exifInfo,
                    userData: userData.user,
                    comments: [],
                    likes: [],
                    likeCount: 0,
                };
                const imgRef = await collectionRef.add(insert);
                userImageCollectionRef.add({ imageRef: imgRef });
                setUrl(url);
            }
        );
    }, [file]);
    return { progress, error, url };
};
export default useStorage;
