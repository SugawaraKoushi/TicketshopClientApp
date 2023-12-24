import React from "react";
import { AppBar, Toolbar, Grid, Tabs, Tab, Typography } from "@mui/material";
import { Link, Outlet, useLocation } from "react-router-dom";
import AirlinesIcon from '@mui/icons-material/Airlines';
import style from "./style";

const Root = () => {
    const routes = ["/home", "/flights", "/vehicles", "/categories", "/tickets", "/cities", "/airports", "/buyTicket"];
    const location = useLocation();

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
                        <Grid item xs={7}>
                            <Tabs
                                textColor="inherit"
                                value={
                                    (location.pathname !== "/buyTicket" || location.pathname !== "/")
                                    ? location.pathname
                                    : false
                                }
                            >
                                <Tab label="Главная" value={routes[0]} component={Link} to={routes[0]}/>
                                <Tab label="Рейсы" value={routes[1]} component={Link} to={routes[1]} />
                                <Tab label="Транспорт" value={routes[2]} component={Link} to={routes[2]} />
                                <Tab label="Категории" value={routes[3]} component={Link} to={routes[3]} />
                                <Tab label="Билеты" value={routes[4]} component={Link} to={routes[4]} />
                                <Tab label="Города" value={routes[5]} component={Link} to={routes[5]} />
                                <Tab label="Аэропорты" value={routes[6]} component={Link} to={routes[6]} />
                                <Tab label="Купить" value={routes[7]} component={Link} to={routes[7]} />
                            </Tabs>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <Outlet />
        </>
    );

}

export default Root;