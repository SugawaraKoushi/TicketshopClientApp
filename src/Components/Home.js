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
            const response = await axios.get(
                "http://localhost:8080/user/get-current"
            );
            if (response.data === "") {
                navigate("/login");
            }
        } catch (e) {
            console.log(e.message);
        }
    };

    return (
        <>
            <div style={{ textAlign: "center" }}>
                <h1>Добро пожаловать!</h1>
            </div>
        </>
    );
};

export default Home;
