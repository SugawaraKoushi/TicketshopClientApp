import {
    Box,
    Button,
    Container,
    FormControlLabel,
    Grid,
    InputLabel,
    Switch,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";

const FoundFlights = () => {
    const { state } = useLocation();
    const [flights, setFlights] = useState([]);
    const [prices, setPrices] = useState([]);
    const [luggagePrices, setLuggagePrices] = useState([]);
    const [luggageSwitches, setLuggageSwitches] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/flight/getWhenDate",
                { params: state }
            );
            const data = response.data;
            setFlights(data);
            generatePrice(data.length);
            generateLuggagePrice(data.length);
        } catch (err) {
            alert(err.message);
        }
    };

    const getHoursDeclination = (diffInHours) => {
        if (diffInHours % 10 > 4 || diffInHours % 10 === 0) {
            return "часов";
        }

        if (diffInHours % 10 === 1) {
            return "час";
        }

        return "часа";
    }

    const calculateTimeDifference = (departure, arriving) => {
        const date1 = new Date(departure);
        const date2 = new Date(arriving);
        const diffInMs = Math.abs(date2 - date1);
        const diffInHours = diffInMs / (1000 * 60 * 60);
        const diffInMinutes = (diffInMs % (1000 * 60 * 60)) / (1000 * 60);
        return `${diffInHours.toFixed(0)} ${getHoursDeclination(diffInHours)} ${diffInMinutes.toFixed(0)} минуты`;
    };

    const generatePrice = (size) => {
        const min = 2500;
        const max = 10000;
        let prices = [];
        for (let i = 0; i < size; i++) {
            const price = Math.random() * (max - min) + min;
            prices.push(price.toFixed(0));
        }
        setPrices(prices);
    };

    const generateLuggagePrice = (size) => {
        const min = 500;
        const max = 2500;
        let prices = [];
        for (let i = 0; i < size; i++) {
            const price = Math.random() * (max - min) + min;
            prices.push(price.toFixed(0));
        }
        setLuggagePrices(prices);
    };

    const getLuggageLabel = (i) => {
        return `Багаж +${luggagePrices[i]}`;
    };

    const handleLuggageSwitchChange = (event) => {
        const ticketPrices = prices;
        const luggageTicketPrices = luggagePrices;
        const pos = event.target.name;
        if (event.target.checked) {
            ticketPrices[pos] = Number(ticketPrices[pos]) + Number(luggageTicketPrices[pos]);
        } else {
            ticketPrices[pos] = Number(ticketPrices[pos]) - Number(luggageTicketPrices[pos]);
        }
        setLuggageSwitches({ [event.target.name]: event.target.checked });
        setPrices(ticketPrices);
    };

    const getDate = (date) => {
        const d = new Date(date);
        const days = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
        const months = ["янв", "февр", "апр", "авг", "сент", "окт", "нояб", "дек"];
        return `${d.getDate()} ${months[d.getMonth()]}, ${days[d.getDay()]}`;
    }

    return (
        <>
            {flights.map((flight, i) => (
                <Container
                    fluid
                    sx={{ margin: "auto", width: "45%", padding: "20px" }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            width: "100%",
                            border: "1px solid",
                            borderColor: "rgb(217, 217, 217)",
                            borderRadius: "15px",
                        }}
                        id="flight-side-content"
                    >
                        <Box
                            sx={{
                                padding: "5px",
                                display: "flex",
                                flexDirection: "column",
                                alignContent: "space-between",
                                width: "25%",
                                height: "150px",
                                borderRight: "1px solid",
                                borderColor: "rgb(217, 217, 217)",
                            }}
                        >
                            <InputLabel
                                id="price-label"
                                sx={{ textAlign: "center", fontSize: "18pt" }}
                            >
                                {prices[i]} ₽
                            </InputLabel>
                            <FormControlLabel
                                sx={{
                                    margin: "auto",
                                    width: "80%",
                                    border: "1px solid",
                                    borderColor: "rgb(217, 217, 217)",
                                    borderRadius: "5px",
                                }}
                                control={
                                    <Switch
                                        checked={luggageSwitches[i]}
                                        defaultChecked={false}
                                        onChange={handleLuggageSwitchChange}
                                        inputProps={{
                                            "aria-label": "controlled",
                                        }}
                                        name={i}
                                    />
                                }
                                label={getLuggageLabel(i)}
                                labelPlacement="start"
                            />
                            <Button
                                variant="outlined"
                                sx={{ width: "80%", margin: "auto" }}
                            >
                                Выбрать
                            </Button>
                        </Box>
                        <Grid
                            container
                            sx={{
                                width: "75%",
                                padding: "5px",
                                alignContent: "center",
                            }}
                        >
                            <Grid item xs={2}>
                                <InputLabel
                                    sx={{
                                        fontSize: "18pt",
                                        textAlign: "center",
                                    }}
                                >
                                    {new Date(flight.departureDate).getHours()}:
                                    {new Date(
                                        flight.departureDate
                                    ).getMinutes()}
                                </InputLabel>
                                <InputLabel
                                    sx={{ fontSize: "8pt", textAlign: "left" }}
                                >
                                    {flight.from.city.name}
                                    <br />{getDate(flight.arrivingDate)}
                                </InputLabel>
                            </Grid>
                            <Grid
                                item
                                xs={8}
                                sx={{
                                    borderBottom: "solid",
                                    borderColor: "rgb(217, 217, 217)",
                                    height: "25%",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <FlightTakeoffIcon color="disabled" />
                                    <InputLabel
                                        sx={{ color: "rgb(217, 217, 217)" }}
                                    >
                                        В пути{" "}
                                        {calculateTimeDifference(
                                            flight.departureDate,
                                            flight.arrivingDate
                                        )}
                                    </InputLabel>
                                    <FlightLandIcon color="disabled" />
                                </Box>
                            </Grid>
                            <Grid item xs={2}>
                                <InputLabel
                                    sx={{
                                        fontSize: "18pt",
                                        textAlign: "center",
                                    }}
                                >
                                    {new Date(flight.arrivingDate).getHours()}:
                                    {new Date(flight.arrivingDate).getMinutes()}
                                </InputLabel>
                                <InputLabel
                                    sx={{ fontSize: "8pt", textAlign: "right" }}
                                >
                                    {flight.to.city.name}
                                    <br />{getDate(flight.arrivingDate)}
                                </InputLabel>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            ))}
        </>
    );
};

export default FoundFlights;