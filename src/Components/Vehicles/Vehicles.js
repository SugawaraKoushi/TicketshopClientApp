import React, { useState, useMemo } from "react";
import axios from "axios";
import { DataGrid, GridToolbarContainer, GridRowModes, GridToolbar } from "@mui/x-data-grid";
import { useLoaderData } from "react-router-dom";
import { Button } from "@mui/material";
import Edit from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { v4 } from "uuid";
import style from "../style";

export const loader = async () => {
    let response = await axios.get("http://localhost:8080/vehicle/get");
    let data = response.data;
    return data;
};


const EditToolBar = (props) => {
    const { setRows, setRowModesModel } = props;
    const [editMode, setEditMode] = useState(false);

    const handleClick = () => {
        const id = v4();
        setRows((oldRows) => [...oldRows, { id, type: "", sits: null }]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: "type" }
        }));
    };

    const editButtonClickHandler = () => {
        setEditMode(!editMode);
    }

    return (
        <>
            <GridToolbarContainer>
                <Button style={style.editButton} startIcon={<Edit />} onClick={editButtonClickHandler}>
                    Редактировать
                </Button>
                {editMode && <Button color="primary" startIcon={<AddIcon />} onClick={handleClick} />}
            </GridToolbarContainer>
        </>
    );
}

const getTogglableColumns = (columns) => {
    return columns
        .filter((column) => column.field !== "id")
        .map((column) => column.field);
};

const Vehicles = () => {
    const [rows, setRows] = useState(useLoaderData());
    const [rowModesModel, setRowModesModel] = useState();
    //const vehicles = useLoaderData();
    const columns = [
        { field: "id", headerName: "ID", width: "300" },
        { field: "type", headerName: "Тип", width: "300" },
        { field: "sits", headerName: "Общее количество мест", width: "300" }
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
                columns={columns}
                rows={rows}
                editMode="row"
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