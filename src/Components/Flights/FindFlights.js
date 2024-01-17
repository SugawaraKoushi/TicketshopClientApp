import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import style from "../style";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useLoaderData } from "react-router-dom";
import { ruRU } from "@mui/x-date-pickers";
import ru from "dayjs/locale/ru";
export const loadRows = async () => {
    const response = await axios.get("http://localhost:8080/airport/get");
    return response.data;
};

const FindFlights = () => {
    const airports = useRef(useLoaderData());
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [when, setWhen] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        getCurrentUser();
    }, []);

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

    const handleChangeAirportFrom = (event) => {
        setFrom(event.target.value);
    };

    const handleChangeAirportTo = (event) => {
        setTo(event.target.value);
    };

    const handleChangeDateWhen = (event) => {
        setWhen(event);
    };

    const handleSubmit = async () => {
        const params = {
            from: from,
            to: to,
            when: when,
        };
        navigate("/foundFlights", { state: params });
    }

    return (
        <>
            <div style={style.ticketForm}>
                <LocalizationProvider adapterLocale={ru} dateAdapter={AdapterDayjs} localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}>
                    <FormControl>
                        <InputLabel id="select-airport-from-label">Откуда</InputLabel>
                        <Select name="from"
                            id='outlined-required'
                            required="true"
                            labelId="select-airport-from-label"
                            label="Откуда"
                            value={from}
                            onChange={handleChangeAirportFrom}
                        >
                            <MenuItem value="">Не выбрано</MenuItem>
                            {airports.current.map((airport) => (
                                <MenuItem key={airport.id} value={airport.id}>{airport.name} ({airport.abbreviation})</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel id="select-airport-from-label">Куда</InputLabel>
                        <Select name="to"
                            id='outlined-required'
                            required="true" labelId="select-airport-from-label"
                            label="Куда"
                            value={to}
                            onChange={handleChangeAirportTo}
                        >
                            <MenuItem value="">Не выбрано</MenuItem>
                            {airports.current.map((airport) => (
                                <MenuItem key={airport.id} value={airport.id}>{airport.name} ({airport.abbreviation})</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <DatePicker
                        name="when" id="outlined-required"
                        required="true"
                        label="Когда"
                        onChange={handleChangeDateWhen}
                        format="DD.MM.YYYY"
                    />
                    <Button type="submit" onClick={handleSubmit}>Найти билеты</Button>
                </LocalizationProvider>
            </div >
        </>
    );
}

export default FindFlights;