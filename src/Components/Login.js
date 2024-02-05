import React, { useState } from "react";
import style from "./style";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = () => {
        const params = {
            username: username,
            password: password,
        };
        try {
            axios.get("http://localhost:8080/user/login", { params: params }).then(() => {navigate("/home")});
        } catch (e) {
            console.log(e.message);
        }
    }

    return (
        <>
            <div style={style.registrationForm}>
                <h1>Войдите в систему:</h1>
                <TextField id="username" required label="Логин" variant="outlined" onChange={handleUsernameChange} />
                <TextField id="password" required label="Пароль" variant="outlined" type="password" onChange={handlePasswordChange} />
                <Button variant="outlined" type="submit" onClick={handleSubmit}>Войти</Button>
                <a href="/registration">Или создайте аккаунт</a>
            </div>
        </>
    )
}

export default Login;