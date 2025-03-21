import { BrowserRouter, useRoutes } from "react-router-dom";
import "./styles/app.css";

import Home from "./pages/index";
import Protegida from "./pages/protegida";
import Login from "./pages/login";
import SignIn from "./pages/signin";
import Navbar from "./components/Navbar"

const AppRoutes = () => {
  let routes =useRoutes([
    {path: "/", element: <Home />},
    {path: "/login", element: <Login />},
    {path: "/sign-in", element: <SignIn />},
    {path: "/protegida", element: <Protegida />}
  ]);

  return routes;
};

function App() {
  return(
    <BrowserRouter>
      <Navbar></Navbar>
      <AppRoutes></AppRoutes>
    </BrowserRouter>
  )
}

export default App;