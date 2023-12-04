import React from "react";
import { useRouteError } from "react-router-dom";
import style from "./style";

const ErrorPage = () => {
    const error = useRouteError;
    console.log(error);

    return (
        <div id="error-page" style={style.errorPage}>
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </div>
    );
}

export default ErrorPage;