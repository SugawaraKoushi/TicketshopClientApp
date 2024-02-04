import {
    Box,
    Button,
    Container,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Switch,
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";

const FoundFlights = () => {
    const { state } = useLocation();
    const [flights, setFlights] = useState([]);
    const [prices, setPrices] = useState([]);
    const [luggagePrices, setLuggagePrices] = useState([]);
    const [luggageSwitches, setLuggageSwitches] = useState([]);
    const [categories, setCategories] = useState([]);
    const flightsCategories = useRef();
    const user = useRef();
    const navigate = useNavigate();

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
            flightsCategories.current = await getFlightsCategories(data);

            for (let i = 0; i < data.length; i++) {
                categories.push("");
            }
            setCategories(categories);
        } catch (err) {
            alert(err.message);
        }
    };

    useEffect(() => {
        getCurrentUser();
    });

    const getCurrentUser = async () => {
        try {
            const response = await axios.get("http://localhost:8080/user/get-current");
            if (response.data === '') {
                navigate("/login");
            }
            user.current = response.data;
        } catch (e) {
            console.log(e.message);
        }
    }

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

    const getFlightsCategories = async (flights) => {
        try {
            const params = {
                flights: flights.map(f => f.id).join(","),
            };

            const response = await axios.get(`http://localhost:8080/flight/get-categories`, { params });
            return response.data;
        } catch (e) {
            alert(e.message);
        }
    }

    const getFlightCategories = (flight) => {
        const flightWithCategories = flightsCategories?.current?.find((f) => f.flightId === flight.id);
        return flightWithCategories?.categories;
    }

    const handleLuggageSwitchChange = (event) => {  
        const ticketPrices = prices;
        const luggageTicketPrices = luggagePrices;
        const pos = Number(event.target.name);
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

    const handleBuyButtonClick = async (event) => {
        const pos = Number(event.target.name);
        const departureDate = flights[pos].departureDate;
        const purchaseDate = new Date();
        const bookingDate = purchaseDate;
        const price = prices[pos];
        const params = {
            name: user.current.lastname + " " + user.current.firstname,
            departureDate: departureDate,
            purchaseDate: purchaseDate,
            bookingDate: bookingDate,
            price: Number(price),
            flight: flights[pos]
        }
        try {
            await axios.post("http://localhost:8080/ticket/create", params);
        } catch (e) {
            console.log(e.message);
        }
    };

    const handleCategoryChange = (event) => {
        const pos = Number(event.target.name);
        let categoryList = categories;
        categoryList[pos] = event.target.value ;
        setCategories(categoryList);
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
                                height: "200px",
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
                                        name={i.toString()}
                                    />
                                }
                                label={getLuggageLabel(i)}
                                labelPlacement="start"
                            />
                            <FormControl>
                                <InputLabel id="select-category">Категория</InputLabel>
                                <Select name={i}
                                    id='outlined-required'
                                    required={true}
                                    labelId="select-category"
                                    label="Категория"
                                    value={categories[i]}
                                    onChange={handleCategoryChange}
                                >
                                    <MenuItem value="">Не выбрано</MenuItem>
                                    {
                                        getFlightCategories(flight)?.map(category => (
                                            <MenuItem key={category.id} value={category.id}>{category.type}</MenuItem>
                                        ))
                                    }

                                </Select>
                            </FormControl>
                            <Button
                                variant="outlined"
                                sx={{ width: "80%", margin: "auto" }}
                                name={i.toString()}
                                onClick={handleBuyButtonClick}
                            >
                                Купить билет
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