import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Root from "./Components/Root";
import ErrorPage from "./Components/ErrorPage";
import Home from "./Components/Home";
import Flights from "./Components/Flights/Flights";
import Vehicles from "./Components/Vehicles/Vehicles";
import Categories from './Components/Categories/Categories';
import Tickets from './Components/Tickets/Tickets';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/flights",
        element: <Flights />,
      },
      {
        path: "/vehicles",
        element: <Vehicles />,
      },
      {
        path: "/categories",
        element: <Categories />,
      },
      {
        path: "/tickets",
        element: <Tickets />,
      },
    ],
  },
  
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);