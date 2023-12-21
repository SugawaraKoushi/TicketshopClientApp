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
    ticketFormLayout: {
        margin: "auto",
        padding: "10px",
        width: "20%",
        '& MUI.TextField': {
            padding: "0px",
        }
    }, 
    ticket: {
        padding: "10px",
    }
}

export default style;