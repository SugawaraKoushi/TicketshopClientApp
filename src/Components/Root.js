import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Grid, Tabs, Tab, Typography, Button } from "@mui/material";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import AirlinesIcon from '@mui/icons-material/Airlines';
import style from "./style";
import axios from "axios";



const Root = () => {
    const routes = ["/home", "/flights", "/vehicles", "/categories", "/tickets", "/cities", "/airports", "/buyTicket"];
    const location = useLocation();
    const navigate = useNavigate();
    const [role, setRole] = useState("");

    useEffect(() => {
        getCurrentUser();
    }, []);

    useEffect(() => {
        getCurrentUserRole();
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

    const getCurrentUserRole = async () => {
        try {
            const response = await axios.get("http://localhost:8080/user/role");
            const data = response.data;
            setRole(data.name);
        } catch (e) {
            console.log(e.message);
        }
    }

    const onLogoutButtonClick = async () => {
        try {
            await axios.get("http://localhost:8080/user/logout").then(() => {
                setRole("");
                navigate("/login")
            });
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            <AppBar style={style.appbar}>
                <Toolbar>
                    <Grid container style={style.grid}>
                        <Grid item xs={1}>
                            <Typography>
                                <AirlinesIcon />
                            </Typography>
                        </Grid>
                        {role === "ROLE_ADMIN" && (
                            <Grid item xs={7}>
                                <Tabs
                                    textColor="inherit"
                                    value={
                                        ((location.pathname !== "/buyTicket" || location.pathname !== "/" || location.pathname !== "/login" || location.pathname !== "/registration"))
                                            ? location.pathname
                                            : false
                                    }
                                >
                                    <Tab label="Главная" value={routes[0]} component={Link} to={routes[0]} />
                                    <Tab label="Рейсы" value={routes[1]} component={Link} to={routes[1]} />
                                    <Tab label="Транспорт" value={routes[2]} component={Link} to={routes[2]} />
                                    <Tab label="Категории" value={routes[3]} component={Link} to={routes[3]} />
                                    <Tab label="Билеты" value={routes[4]} component={Link} to={routes[4]} />
                                    <Tab label="Города" value={routes[5]} component={Link} to={routes[5]} />
                                    <Tab label="Аэропорты" value={routes[6]} component={Link} to={routes[6]} />
                                    <Tab label="Купить" value={routes[7]} component={Link} to={routes[7]} />
                                </Tabs>
                            </Grid>
                        )}

                    </Grid>
                    <Button id="logout-button" style={{ color: "white" }} onClick={onLogoutButtonClick}>Выход</Button>
                </Toolbar>
            </AppBar>
            <Outlet />
        </>
    );

}

export default Root;