import "../styles/globals.css";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, generateUserDocument } from "../firebase/config";
import { UserContext } from "../providers/UserContext";
import { ThemeProvider } from "styled-components";
import styled from "styled-components";
const theme = {
    colors: {
        primary: "#89b0ae",
        secondary: "#555b6e",
        overlay: "#ffd6ba",
        error: "#ff4a4a",
        dark: "#253335",
    },
};

const Line = styled.div`
    width: 100vw;
    height: 10px;
    animation: animateBg 7s linear infinite;
    background-image: linear-gradient(
        205deg,
        #b0ae89,
        #89b0ae,
        #ad89b0,
        #b0ae89,
        #89b0ae,
        #ad89b0,
        #b0ae89
    );
    background-size: 1000% 1000%;
    @keyframes animateBg {
        0% {
            background-position: 0% 0%;
        }
        100% {
            background-position: 100% 100%;
        }
    }
`;
function MyApp({ Component, pageProps }) {
    const [userData, setUserData] = useState({ user: null });
    const [bgColor, setBGColor] = useState();
    const [textColor, setTextColor] = useState("#253335");
    const [nightMode, setNightMode] = useState();

    useEffect(async () => {
        auth.onAuthStateChanged(async (userAuth) => {
            const user = await generateUserDocument(userAuth);
            setUserData({ user });
        });
    }, []);
    useEffect(() => {
        if (nightMode == "true") {
            setBGColor("#253335");
            setTextColor("#fff");
        }
        if (nightMode == "false") {
            setBGColor("#fff");
            setTextColor("#253335");
        }
    }, [nightMode, setNightMode]);

    useEffect(() => {
        // On Component Mount, set Night Mode from localStorage
        if (localStorage.getItem("nightMode") == null)
            localStorage.setItem("nightMode", false);

        setNightMode(localStorage.getItem("nightMode"));
    }, []);

    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            <ThemeProvider theme={theme}>
                <Line />
                <Component
                    {...pageProps}
                    bgColor={bgColor}
                    nightMode={nightMode}
                    setNightMode={setNightMode}
                />
            </ThemeProvider>
        </UserContext.Provider>
    );
}

export default MyApp;
