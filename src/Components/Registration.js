import React, { useState } from "react";
import style from "./style";
import { Button, TextField } from "@mui/material";
import { v4 } from "uuid";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Registration = () => {
    const [username, setUsername] = useState("");
    const [lastname, setLastname] = useState("");
    const [firstname, setFirstname] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [passwordValid, setPasswordValid] = useState(true);
    const navigate = useNavigate();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleLastnameChange = (event) => {
        setLastname(event.target.value);
    };

    const handleFirstrnameChange = (event) => {
        setFirstname(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleRepeatPasswordChange = (event) => {
        setRepeatPassword(event.target.value);
        setPasswordValid(event.target.value === password);
    };

    const handleSubmit = async () => {
        const params = {
            id: v4(),
            firstname: firstname,
            lastname: lastname,
            username: username,
            password: password,
        };

        try {
            axios.post("http://localhost:8080/user/create", params)
                .then(() => { navigate("/login") });
        } catch (e) {
            console.log(e.message);
        }
    };

    return (
        <>
            <div style={style.registrationForm}>
                <h1>Заполните данные</h1>
                <TextField id="username" required label="Логин" variant="outlined" onChange={handleUsernameChange} />
                <TextField id="lastname" required label="Фамилия" variant="outlined" onChange={handleLastnameChange} />
                <TextField id="firstname" required label="Имя" variant="outlined" onChange={handleFirstrnameChange} />
                <TextField id="password" required label="Пароль" variant="outlined" type="password" onChange={handlePasswordChange} />
                <TextField error={!passwordValid} id="password-repeat" required label="Повторите пароль" variant="outlined" type="password" onChange={handleRepeatPasswordChange} />
                <Button variant="outlined" type="submit" onClick={handleSubmit}>Зарегистрироваться</Button>
            </div>
        </>
    )
}

export default Registration;