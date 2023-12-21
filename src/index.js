import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Root from "./Components/Root";
import ErrorPage from "./Components/ErrorPage";
import Home from "./Components/Home";
import Flights, { loadRows as flightsLoader } from "./Components/Flights/Flights";
import Vehicles, { loadRows as vehiclesLoader } from "./Components/Vehicles/Vehicles";
import Categories, { loadRows as categoriesLoader } from './Components/Categories/Categories';
import Tickets, { loadRows as ticketsLoader } from './Components/Tickets/Tickets';
import Ticket from './Components/Tickets/Ticket';


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
        loader: flightsLoader,
      },
      {
        path: "/vehicles",
        element: <Vehicles />,
        loader: vehiclesLoader,
      },
      {
        path: "/categories",
        element: <Categories />,
        loader: categoriesLoader,
      },
      {
        path: "/tickets",
        element: <Tickets />,
        loader: ticketsLoader
      },
      {
        path: "/buyTicket",
        element: <Ticket />
      }
    ],
  },
  
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);