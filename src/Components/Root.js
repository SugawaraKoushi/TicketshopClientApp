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
            if (response.data === '' && location.pathname !== "/registration") {
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

    const handleLogoutButtonClick = async () => {
        try {
            await axios.get("http://localhost:8080/user/logout").then(() => {
                setRole("");
                navigate("/login")
            });
        } catch (e) {
            console.log(e);
        }
    }

    const getAvailabeTabsForRole = (role) => {
        let tabs = [];
        if (role === "ROLE_ADMIN") {
            tabs.push(<Tab label="Главная" value={routes[0]} component={Link} to={routes[0]} />);
            tabs.push(<Tab label="Рейсы" value={routes[1]} component={Link} to={routes[1]} />);
            tabs.push(<Tab label="Транспорт" value={routes[2]} component={Link} to={routes[2]} />);
            tabs.push(<Tab label="Категории" value={routes[3]} component={Link} to={routes[3]} />)
            tabs.push(<Tab label="Билеты" value={routes[4]} component={Link} to={routes[4]} />)
            tabs.push(<Tab label="Города" value={routes[5]} component={Link} to={routes[5]} />);
            tabs.push(<Tab label="Аэропорты" value={routes[6]} component={Link} to={routes[6]} />);
        } else if (role === "ROLE_USER") {
            tabs.push(<Tab label="Главная" value={routes[0]} component={Link} to={routes[0]} />);
            tabs.push(<Tab label="Купить" value={routes[7]} component={Link} to={routes[7]} />);
        }

        return tabs;
    };

    const getAvailableTabsCountForRole = (role) => {
        return role === "ROLE_ADMIN" ? 7 : 2;
    };

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
                        <Grid item xs={getAvailableTabsCountForRole(role)}>
                            <Tabs
                                textColor="inherit"
                                value={
                                    ((location.pathname !== "/buyTicket" || location.pathname !== "/" || location.pathname !== "/login" || location.pathname !== "/registration"))
                                        ? location.pathname
                                        : false
                                }
                            >
                                {getAvailabeTabsForRole(role)}
                            </Tabs>
                        </Grid>
                    </Grid>
                    <Button id="logout-button" style={{ color: "white" }} onClick={handleLogoutButtonClick}>Выход</Button>
                </Toolbar>
            </AppBar>
            <Outlet />
        </>
    );
}

export default Root;