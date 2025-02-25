import { BrowserRouter, useRoutes } from "react-router-dom";
import Home from "./pages/Home";
import Test from "./pages/Test";
import Navbar from "./components/Navbar";

const AppRoutes = () => {
  let routes =useRoutes([
    {path: "/", element: <Home />},
    {path: "/test", element: <Test />}
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