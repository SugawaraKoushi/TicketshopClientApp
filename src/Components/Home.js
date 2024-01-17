import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        getCurrentUser();
    });

    const getCurrentUser = async () => {
        try {
            const response = await axios.get("http://localhost:8080/user/get-current");
            if (response.data === '') {
                navigate("/login");
            }
        } catch (e) {
            console.log(e.message);
        }
    }

    return (
        <>
            <h1>Добро пожаловать!</h1>
        </>
    );
}

export default Home;