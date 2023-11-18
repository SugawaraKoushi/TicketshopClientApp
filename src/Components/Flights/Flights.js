import React from "react";
import { DataGrid } from "@mui/x-data-grid";

const Flights = () => {
    const columns = [
        { field: "id", headerName: "ID", width: "25" },
        { field: "num", headerName: "Номер", width: "100" },
        { field: "from", headerName: "Место отправления", width: "200" },
        { field: "to", headerName: "Место прибытия", width: "200" },
        { field: "departureDate", headerName: "Дата отправления", width: "200", type: "dateTime" },
        { field: "arrivingDate", headerName: "Дата прибытия", width: "200", type: "dateTime" },
    ];

    const rows = [
        { id: 1, num: 1, from: "DME", to: "MMK", departureDate: new Date(), arrivingDate: new Date() },
    ];

    return (
        <>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    }
                }}
                pageSizeOptions={[10]}
                checkboxSelection />
        </>
    );
}

export default Flights;