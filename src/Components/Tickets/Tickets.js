import React, { useState, useMemo, useRef } from "react";
import axios from "axios";
import EditToolBar from "../EditToolBar";
import { DataGrid, GridActionsCellItem, GridRowModes, GridRowEditStopReasons } from "@mui/x-data-grid";
import { useLoaderData } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import style from "../style";

export const loadRows = async () => {
    const urls = ["http://localhost:8080/ticket/get", "http://localhost:8080/flight/get", "http://localhost:8080/category/get"];
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
}

const Tickets = () => {
    const response = useLoaderData();
    const [rows, setRows] = useState(response[0].data);
    const [rowModesModel, setRowModesModel] = useState({});
    const flights = useRef(response[1].data);
    const categories = useRef(response[2].data);

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleDeleteClick = (id) => () => {
        deleteRow(id);
        setRows(rows.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow.isNew) {
            setRows(rows.filter((row) => row.id !== id));
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
        {
            field: "actions", headerName: "Действия", type: "actions",
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
        { field: "id", headerName: "ID", width: "25" },
        { field: "name", headerName: "ФИО", width: "200", type: "string", editable: "true" },
        {
            field: "departureDate", headerName: "Дата отправления", width: "200", type: "dateTime", editable: "true",
            valueGetter: (params) => {
                return new Date(params.value);
            }
        },
        {
            field: "purchaseDate", headerName: "Дата покупки", width: "200", type: "dateTime", editable: "true",
            valueGetter: (params) => {
                return new Date(params.value);
            }
        },
        {
            field: "bookingDate", headerName: "Дата бронирования", width: "200", type: "dateTime", editable: "true",
            valueGetter: (params) => {
                return new Date(params.value);
            }
        },
        { field: "price", headerName: "Стоимость", width: "200", type: "number", editable: "true" },
        {
            field: "flight", headerName: "Рейс", width: "200", type: "singleSelect", editable: "true",
            valueGetter: (option) => {
                const value = option?.value?.id === undefined ? '' : option?.value?.id;
                return value;
            },
            valueOptions: () => {
                const options = [];
                for (let i = 0; i < flights.current.length; i++) {
                    options.push({ value: flights.current[i].id, label: flights.current[i].num });
                }
                return options;
            },
        },
        {
            field: "category", headerName: "Категория", width: "200", type: "singleSelect", editable: "true",
            valueGetter: (option) => {
                const value = option?.value?.id === undefined ? '' : option?.value?.id;
                return value;
            },
            valueOptions: (param) => {
                const options = [];
                let flight = param.row.flight;

                if (flight === undefined || flight === "") {
                    return [];
                }

                flight = flights.current.find((f) => flight === f.id);
                for (let i = 0; i < categories.current.length; i++) {
                    if (categories.current[i].vehicle.id === flight.vehicle.id) {
                        options.push({ value: categories.current[i].id, label: categories.current[i].type });
                    }
                }
                return options;
            },
        },

    ];

    const columnVisibilityModel = useMemo(() => {
        return {
            id: false,
        }
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
                    }
                }}
                pageSizeOptions={[10]}
                checkboxSelection={false}
                slots={{ toolbar: EditToolBar }}
                columnVisibilityModel={columnVisibilityModel}
                slotProps={{
                    toolbar: { setRows, setRowModesModel },
                    //columnsPanel: { getTogglableColumns },
                }}
            />

        </>
    );
}

export default Tickets;