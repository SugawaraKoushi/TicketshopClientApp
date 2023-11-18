import React, { Component } from "react";
import { FormControl, Input, InputLabel, Container } from "@mui/material";
import axios from "axios";

class VehicleItem extends Component {
    state = {
        sits: 0,
        type: "",
    };

    onSitsChange = event => (
        this.setState({ sits: event.target.value })
    );

    onTypeChange = event => {
        this.setState({ type: event.target.value })
    };

    onSubmit = event => {
        event.preventDefault();

        let sits = this.state.sits;
        let type = this.state.type;

        axios.post("http://localhost:8080/vehicle/create", { sits, type })
            .then(res => {
                console.log(res);
                console.log(res.data);
            })
    };

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <h1>Create Vehicle</h1>
                <Container fixed sx={{ width: 400 }}>
                    <FormControl variant="standard">
                        <InputLabel htmlFor="component-simple">Количество мест</InputLabel>
                        <Input id="component-simple" type="number" onChange={this.onSitsChange} />
                    </FormControl>
                    <FormControl variant="standard">
                        <InputLabel htmlFor="component-simple">Тип</InputLabel>
                        <Input id="component-simple" onChange={this.onTypeChange} />
                    </FormControl>
                    <br></br>
                    <br></br>
                    <FormControl>
                        <Input type="submit" />
                    </FormControl>
                </Container>
            </form>
        );
    }
}

export default VehicleItem;
