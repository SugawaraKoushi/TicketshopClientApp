import { styled } from "@mui/material/styles"

const style = {
    appbar: {
        background: "linear-gradient(0deg, rgba(34,191,195,1) 0%, rgba(46,159,189,1) 100%)",
        position: "sticky",
    },
    grid: {
        placeItems: "center",
    },
    dataGrid: {
        margin: "auto",
        width: "80%",
    },
    errorPage: {
        position: "absolute",
        left: "40%",
        bottom: "50%",
    },
    ticketForm: {
        display: "grid",
        gridAutoFlow: "row",
        gridRowGap: "15px",
        margin: "2% auto",
        width: "20%",
        height: "100%",
        padding: "10px 0",
    },
    registrationForm: {
        display: "grid",
        gridAutoFlow: "row",
        gridRowGap: "15px",
        margin: "2% auto",
        width: "20%",
        height: "100%",
        padding: "10px 0",
    },
}

export default style;