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
    const urls = ["http://localhost:8080/airport/get", "http://localhost:8080/city/get"];
    const responses = Promise.all(urls.map((url) => axios.get(url)));
    return responses;
};

const saveRow = async (row) => {
    await axios.post("http://localhost:8080/airport/create", row);
};

const updateRow = async (row) => {
    await axios.put(`http://localhost:8080/airport/update/${row.id}`, row);
};

const deleteRow = async (id) => {
    await axios.delete(`http://localhost:8080/airport/delete/${id}`);
}

const Airports = () => {
    const response = useLoaderData();
    const [rows, setRows] = useState(response[0].data);
    const [rowModesModel, setRowModesModel] = useState({});
    const cities = useRef(response[1].data);

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
        const city = cities.current.find((v) => v.id === newRow.city);
        newRow.city = city;

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
        { field: "name", headerName: "Название", width: "300", editable: "true" },
        { field: "abbreviation", headerName: "Код", width: "300", editable: "true" },
        {
            field: "city", headerName: "Город", width: "200", type: "singleSelect", editable: "true",
            valueGetter: (option) => {
                const value = option?.value?.id === undefined ? '' : option?.value?.id;
                return value;
            },
            valueOptions: () => {
                const options = [];
                for (let i = 0; i < cities.current.length; i++) {
                    options.push({ value: cities.current[i].id, label: cities.current[i].name });
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

export default Airports;