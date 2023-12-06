import React from "react";
import { GridRowModes, GridToolbarContainer } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { v4 } from "uuid";

const EditToolBar = (props) => {
    const { setRows, setRowModesModel } = props;

    const handleAddClick = () => {
        const id = v4();
        setRows((oldRows) => [{ id, type: "", sits: 0, isNew: true }, ...oldRows]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: "type" }
        }));
    };

    return (
        <>
            <GridToolbarContainer>
                <Button color="primary" startIcon={<AddIcon />} onClick={handleAddClick}>
                    Добавить запись
                </Button>
            </GridToolbarContainer>
        </>
    );
}

export default EditToolBar;