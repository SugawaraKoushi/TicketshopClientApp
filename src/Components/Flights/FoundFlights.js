import { Container, InputLabel } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";



const FoundFlights = () => {
    const { state } = useLocation();
    const [flights, setFlights] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        await axios("http://localhost:8080/flight/getWhenDate", { params: state }).then((response) => { setFlights(response.data) });
    }

    return (
        <>
            <Container>
                <div>
                    <InputLabel>{flights[0]?.id}</InputLabel>
                </div>
            </Container>
        </>
    );
}

export default FoundFlights;