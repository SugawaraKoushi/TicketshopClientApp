import React, { useCallback, useState, useMemo, useRef, useEffect } from "react";
import axios from "axios";
import EditToolBar from "../EditToolBar";
import {
    DataGrid,
    GridActionsCellItem,
    GridRowModes,
    GridRowEditStopReasons,
} from "@mui/x-data-grid";
import { useLoaderData, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import style from "../style";
import { Alert, Snackbar } from "@mui/material";

export const loadRows = async () => {
    const urls = [
        "http://localhost:8080/category/get",
        "http://localhost:8080/vehicle/get",
    ];
    const responses = Promise.all(urls.map((url) => axios.get(url)));
    return responses;
};

const saveRow = async (row) => {
    return await axios.post("http://localhost:8080/category/create", row);
};

const updateRow = async (row) => {
    await axios.put(`http://localhost:8080/category/update/${row.id}`, row);
};

const deleteRow = async (id) => {
    await axios.delete(`http://localhost:8080/category/delete/${id}`);
};

const Categories = () => {
    const response = useLoaderData();
    const [rows, setRows] = useState(response[0].data);
    const [rowModesModel, setRowModesModel] = useState({});
    const [snackbar, setSnackbar] = useState(null);
    const vehicles = useRef(response[1].data);
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

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.Edit },
        });
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View },
        });
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

    const processRowUpdate = useCallback(
        async (newRow) => {
            const vehicle = vehicles.current.find((v) => v.id === newRow.vehicle);
            newRow.vehicle = vehicle;

            try {
                if (newRow.isNew === undefined || !newRow.isNew) {
                    await updateRow(newRow);
                } else {
                    await saveRow(newRow);
                }
            } catch (err) {
                throw new Error(err.response.data);
            }

            const updatedRow = { ...newRow, isNew: false };
            setRows(
                rows.map((row) => (row.id === newRow.id ? updatedRow : row))
            );
            return updatedRow;
        },
        [rows]
    );

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const handleProcessRowUpdateError = React.useCallback((error) => {
        console.log(error);
        setSnackbar({ children: error.message, severity: "error" });
    }, []);

    const handleCloseSnackbar = () => setSnackbar(null);

    const columns = [
        {
            field: "actions",
            headerName: "Действия",
            type: "actions",
            getActions: ({ id }) => {
                const isInEditMode =
                    rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: "primary.main",
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
        {
            field: "type",
            headerName: "Тип",
            width: "200",
            type: "string",
            editable: "true",
        },
        {
            field: "sits",
            headerName: "Количество мест",
            width: "200",
            type: "number",
            editable: "true",
        },
        {
            field: "vehicle",
            headerName: "ТС",
            width: "200",
            type: "singleSelect",
            editable: "true",
            valueGetter: (option) => {
                const value =
                    option?.value?.id === undefined ? "" : option?.value?.id;
                return value;
            },
            valueOptions: () => {
                const options = [];
                for (let i = 0; i < vehicles.current.length; i++) {
                    options.push({
                        value: vehicles.current[i].id,
                        label: vehicles.current[i].type,
                    });
                }
                return options;
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
                onProcessRowUpdateError={handleProcessRowUpdateError}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                }}
                pageSizeOptions={[10]}
                checkboxSelection={false}
                slots={{ toolbar: EditToolBar }}
                columnVisibilityModel={columnVisibilityModel}
                slotProps={{
                    toolbar: { setRows, setRowModesModel },
                }}
            />
            {!!snackbar && (
                <Snackbar
                    open
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    onClose={handleCloseSnackbar}
                    autoHideDuration={6000}
                >
                    <Alert {...snackbar} onClose={handleCloseSnackbar} />
                </Snackbar>
            )}
        </>
    );
};

export default Categories;
