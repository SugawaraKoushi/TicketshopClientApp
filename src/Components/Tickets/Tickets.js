import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import {
    DataGrid,
    GridRowEditStopReasons,
} from "@mui/x-data-grid";
import { useLoaderData, useNavigate } from "react-router-dom";
import style from "../style";

export const loadRows = async () => {
    const urls = [
        "http://localhost:8080/ticket/get",
        "http://localhost:8080/flight/get",
        "http://localhost:8080/category/get",
    ];
    const responses = Promise.all(urls.map((url) => axios.get(url)));
    return responses;
};

const saveRow = async (row) => {
    await axios.post("http://localhost:8080/ticket/create", row);
};

const updateRow = async (row) => {
    await axios.put(`http://localhost:8080/ticket/update/${row.id}`, row);
};

const deleteRow = async (id) => {
    await axios.delete(`http://localhost:8080/ticket/delete/${id}`);
};

const Tickets = () => {
    const response = useLoaderData();
    const [rows, setRows] = useState(response[0].data);
    const [rowModesModel, setRowModesModel] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        getCurrentUser();
    }, []);

    const getCurrentUser = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/user/get-current"
            );
            if (response.data === "") {
                navigate("/login");
            }
        } catch (e) {
            console.log(e.message);
        }
    };

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const processRowUpdate = (newRow) => {
        if (newRow.isNew === undefined || !newRow.isNew) {
            updateRow(newRow);
        } else {
            saveRow(newRow);
        }

        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns = [
        { field: "id", headerName: "ID", width: "25" },
        {
            field: "name",
            headerName: "ФИО",
            width: "200",
            type: "string",
            editable: "true",
        },
        {
            field: "departureDate",
            headerName: "Дата отправления",
            width: "200",
            type: "dateTime",
            editable: "true",
            valueGetter: (params) => {
                return new Date(params.value);
            },
        },
        {
            field: "purchaseDate",
            headerName: "Дата покупки",
            width: "200",
            type: "dateTime",
            editable: "true",
            valueGetter: (params) => {
                return new Date(params.value);
            },
        },
        {
            field: "bookingDate",
            headerName: "Дата бронирования",
            width: "200",
            type: "dateTime",
            editable: "true",
            valueGetter: (params) => {
                return new Date(params.value);
            },
        },
        {
            field: "price",
            headerName: "Стоимость",
            width: "200",
            type: "number",
            editable: "true",
        },
        {
            field: "flight",
            headerName: "Рейс",
            width: "200",
            type: "number",
            editable: "false",
            valueGetter: (params) => {
                return params.value.num;
            },
        },
        {
            field: "category",
            headerName: "Категория",
            width: "200",
            type: "string",
            valueGetter: (params) => {
                return params.value?.type;
            },
        },
        
    ];

    const columnVisibilityModel = useMemo(() => {
        return {
            id: false,
        };
    }, []);

    return (
        <>
            <DataGrid
                style={style.dataGrid}
                rows={rows}
                columns={columns}
                showCellVerticalBorder={true}
                showColumnVerticalBorder={true}
                editMode="row"
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                experimentalFeatures={{ newEditingApi: true }}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                }}
                pageSizeOptions={[10]}
                checkboxSelection={false}
                columnVisibilityModel={columnVisibilityModel}
                slotProps={{
                    toolbar: { setRows, setRowModesModel },
                }}
            />
        </>
    );
};

export default Tickets;