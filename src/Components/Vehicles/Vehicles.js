import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import EditToolBar from "../EditToolBar";
import { DataGrid, GridActionsCellItem, GridRowModes, GridRowEditStopReasons } from "@mui/x-data-grid";
import { useLoaderData, useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import style from "../style";

export const loadRows = async () => {
    const response = await axios.get("http://localhost:8080/vehicle/get");
    const data = response.data;
    return data;
};

const saveRow = async (row) => {
    await axios.post("http://localhost:8080/vehicle/create", row);
};

const updateRow = async (row) => {
    await axios.put(`http://localhost:8080/vehicle/update/${row.id}`, row);
};

const deleteRow = async (id) => {
    await axios.delete(`http://localhost:8080/vehicle/delete/${id}`);
}

const Vehicles = () => {
    const [rows, setRows] = useState(useLoaderData());
    const [rowModesModel, setRowModesModel] = useState({});
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
        { field: "id", headerName: "ID", width: "300" },
        { field: "type", headerName: "Тип", width: "300", editable: "false" },
        {
            field: "sits", headerName: "Общее количество мест", width: "300", editable: "false", type: "number",
            preProcessEditCellProps: (params) => {
                const hasError = params.props.value < 1;
                return {...params.props, error: hasError };
            }
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

export default Vehicles;