import React, { useState } from "react";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useLoaderData } from "react-router-dom";

export const loader = async () => {
    let response = await axios.get("http://localhost:8080/vehicle/get");
    let data = response.data;
    console.log(data);
    return data;
};

const Vehicles = () => {
    const vehicles = useLoaderData();
    const columns = [
        { field: "type", headerName: "Тип", width: "300" },
        { field: "sits", headerName: "Общее количество мест", width: "300" }
    ];

    return (
        <>
            <DataGrid
                columns={columns}
                rows={vehicles}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    }
                }}
                pageSizeOptions={[10]}
                //checkboxSelection
                slots={{toolbar: GridToolbar}} />
        </>
    );
}

export default Vehicles;