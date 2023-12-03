const style = {
    appbar: {
        //background: "rgb(34,191,195)",
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
    editButton: {
        color: "primary",
        "&.MuiFocused": {
            color: "warning",
        },
    }
}

export default style;