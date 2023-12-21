import React from "react";
import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import style from "../style";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";


const Ticket = () => {
    return (
        <>
            <div style={style.ticketFormLayout}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TextField id="outlined-required" required label="ФИО" />
                    <DatePicker id="outlined=required" label="Дата отправления" />
                </LocalizationProvider>
            </div>
        </>
    );
}

export default Ticket;