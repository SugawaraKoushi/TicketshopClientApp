import { Box, Button, Container, FormControlLabel, Grid, InputLabel, Switch } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';

const FoundFlights = () => {
    const { state } = useLocation();
    const [flights, setFlights] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        await axios("http://localhost:8080/flight/getWhenDate", { params: state }).then((response) => { setFlights(response.data) });
    };

    const calculateTimeDifference = (departure, arriving) => {
        const date1 = new Date(departure);
        const date2 = new Date(arriving);
        const diffInMs = Math.abs(date2 - date1);
        const diffInHours = diffInMs / (1000 * 60 * 60);
        return diffInHours;
    };

    return (
        <>
            {flights.map((flight) => (
                <Container fluid sx={{ margin: "auto", width: "45%", padding: "20px" }}>
                    <Box sx={{ display: "flex", width: "100%", border: "1px solid", borderColor: "rgb(217, 217, 217)", borderRadius: "15px" }} id="flight-side-content">
                        <Box sx={{ padding: "5px", display: "flex", flexDirection: "column", alignContent: "space-between", width: "25%", height: "150px", borderRight: "1px solid", borderColor: "rgb(217, 217, 217)" }}>
                            <InputLabel id="price-label" sx={{ textAlign: "center", fontSize: "18pt" }}>6000 ₽</InputLabel>
                            <FormControlLabel
                                sx={{ margin: "auto", width: "80%", border: "1px solid", borderColor: "rgb(217, 217, 217)", borderRadius: "5px" }}
                                control={<Switch defaultChecked />}
                                label="Багаж +2500"
                                labelPlacement="start"
                            />
                            <Button variant="outlined" sx={{ width: "80%", margin: "auto" }}>Выбрать</Button>
                        </Box>
                        <Grid container sx={{ width: "75%", padding: "5px", alignContent: "center" }}>
                            <Grid item xs={2}>
                                <InputLabel sx={{ fontSize: "18pt", textAlign: "center" }}>{new Date(flight.departureDate).getHours()}:{new Date(flight.departureDate).getMinutes()}</InputLabel>
                                <InputLabel sx={{ fontSize: "8pt", textAlign: "left" }}>{flight.from.city.name}<br />1 янв, пн</InputLabel>
                            </Grid>
                            <Grid item xs={8} sx={{ borderBottom: "solid", borderColor: "rgb(217, 217, 217)", height: "25%" }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <FlightTakeoffIcon color="disabled" />
                                    <InputLabel sx={{ color: "rgb(217, 217, 217)" }}>В пути {calculateTimeDifference(flight.departureDate, flight.arrivingDate)} часа</InputLabel>
                                    <FlightLandIcon color="disabled" />
                                </Box>
                            </Grid>
                            <Grid item xs={2}>
                                <InputLabel sx={{ fontSize: "18pt", textAlign: "center" }}>{new Date(flight.arrivingDate).getHours()}:{new Date(flight.arrivingDate).getMinutes()}</InputLabel>
                                <InputLabel sx={{ fontSize: "8pt", textAlign: "right" }}>{flight.to.city.name}<br />1 янв, пн</InputLabel>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            ))}
        </>
    );
}

export default FoundFlights;