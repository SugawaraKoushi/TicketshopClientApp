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
    const urls = ["http://localhost:8080/flight/get", "http://localhost:8080/vehicle/get", "http://localhost:8080/airport/get"];
    const responses = Promise.all(urls.map((url) => axios.get(url)));
    return responses;
};

export const saveRow = async (row) => {
    await axios.post("http://localhost:8080/flight/create", row);
};

export const updateRow = async (row) => {
    await axios.put(`http://localhost:8080/flight/update/${row.id}`, row);
};

export const deleteRow = async (id) => {
    await axios.delete(`http://localhost:8080/flight/delete/${id}`);
}

const Flights = () => {
    const response = useLoaderData();
    const [rows, setRows] = useState(response[0].data);
    const [rowModesModel, setRowModesModel] = useState({});
    const vehicles = useRef(response[1].data);
    const airports = useRef(response[2].data);

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
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View, ignoreModifications: true }, });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow) => {
        const vehicle = vehicles.current.find((v) => v.id === newRow.vehicle);
        const airportFrom = airports.current.find((a) => a.id === newRow.from);
        const airportTo = airports.current.find((a) => a.id === newRow.to);
        newRow.vehicle = vehicle;
        newRow.from = airportFrom;
        newRow.to = airportTo;

        if (newRow.isNew === undefined || !newRow.isNew) {
            updateRow(newRow);
        } else {
            saveRow(newRow);
        }

        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleProcessRowUpdateError = () => {
        alert("error");
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
        { field: "id", headerName: "ID", width: "25", editable: "true", },
        {
            field: "num", headerName: "Номер", width: "100", type: "number", editable: "true",
            preProcessEditCellProps: (params) => {
                const hasError = params.props.value === undefined || params.props.value === "";
                return { ...params.props, error: hasError };
            }
        },
        {
            field: "from", headerName: "Место отправления", width: "200", type: "singleSelect", editable: "true",
            valueGetter: (option) => {
                const value = option?.value?.id === undefined ? "" : option?.value?.id;
                return value;
            },
            valueOptions: () => {
                const options = [];
                for (let i = 0; i < airports.current.length; i++) {
                    options.push({ value: airports.current[i].id, label: `${airports.current[i].name} (${airports.current[i].abbreviation})` })
                }
                return options;
            },
            preProcessEditCellProps: (params) => {
                const to = params.otherFieldsProps.to.value;
                const hasError = params.props.value === to || params.props.value === undefined;
                return { ...params.props, error: hasError };
            },
        },
        {
            field: "to", headerName: "Место прибытия", width: "200", type: "singleSelect", editable: "true",
            valueGetter: (option) => {
                const value = option?.value?.id === undefined ? "" : option?.value?.id;
                return value;
            },
            valueOptions: () => {
                const options = [];
                for (let i = 0; i < airports.current.length; i++) {
                    options.push({ value: airports.current[i].id, label: `${airports.current[i].name} (${airports.current[i].abbreviation})` })
                }
                return options;
            },
            preProcessEditCellProps: (params) => {
                const from = params.otherFieldsProps.from.value;
                const hasError = params.props.value === from;
                return { ...params.props, error: hasError };
            },
        },
        {
            field: "departureDate", headerName: "Дата отправления", width: "200", type: "dateTime", editable: "true",
            valueGetter: (params) => {
                return new Date(params.value);
            },
        },
        {
            field: "arrivingDate", headerName: "Дата прибытия", width: "200", type: "dateTime", editable: "true",
            valueGetter: (params) => {
                return new Date(params.value);
            }
        },
        {
            field: "vehicle", headerName: "ТС", width: "200", type: "singleSelect", editable: "true",
            valueGetter: (option) => {
                const value = option?.value?.id === undefined ? '' : option?.value?.id;
                return value;
            },
            valueOptions: () => {
                const options = [];
                for (let i = 0; i < vehicles.current.length; i++) {
                    options.push({ value: vehicles.current[i].id, label: vehicles.current[i].type });
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
                editMode="row"
                showCellVerticalBorder={true}
                showColumnVerticalBorder={true}
                rowModesModel={rowModesModel}
                onRowModesModelChange={handleRowModesModelChange}
                experimentalFeatures={{ newEditingApi: true }}
                onRowEditStop={handleRowEditStop}
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={handleProcessRowUpdateError}
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

export default Flights;