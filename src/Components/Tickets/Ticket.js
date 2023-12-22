import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import style from "../style";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const Ticket = () => {
    const [flights, setFlights] = useState({});

    return (
        <>
            <div style={style.ticketForm}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker id="outlined-required" required label="Дата отправления" />
                    <TextField id="outlined-required" required label="Откуда" />
                    <TextField id="outlined-required" required label="Куда" />
                    <Button id="outlined">Найти билеты</Button>
                </LocalizationProvider>
            </div>
        </>
    );
}

export default Ticket;