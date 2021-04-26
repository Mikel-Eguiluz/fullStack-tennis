import React from "react";

import {
  BrowserRouter as Router,
  Route,
  // Redirect,
  Switch,
} from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";
// import { Auth0Provider } from "@auth0/auth0-react";
import { BookingsProvider } from "./contexts/bookings.context";

import Home from "./pages/Home/Home";
// import AdminMenu from "./pages/AdminMenu/AdminMenu";
import MyBookings from "./pages/MyBookings/MyBookings";
import NotFound from "./pages/404/404";

function App() {
  return (
    <Router>
      <ToastProvider autoDismiss={true}>
        <BookingsProvider>
          <Switch>
            <Route exact path="/" component={Home} />
            {/* TODO: <Route exact path="/admin" component={AdminMenu} /> */}
            <Route exact path={`/mybookings`} component={MyBookings} />
            <Route path="*" component={NotFound} />
          </Switch>
        </BookingsProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
