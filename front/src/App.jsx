import { BrowserRouter, Route, Routes } from "react-router-dom";
import Hero from "./components/Hero";
import Header from "./components/Header";
import Uknownfaces from "./components/Uknownfaces";
import "./App.css";
import About from "./components/About"
import Login from "./components/Login";
import Camera from "./components/Camera";
import AddUser from "./components/AddUser";
function App() {

  return (
    <>
    <BrowserRouter>
      <div className="dark:bg-dPrimary dark:text-primaryC ">
        <Header />
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/Uknownfaces" element={<Uknownfaces />} />
            <Route path="/About" element={<About />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/LiveCams" element={<Camera />} />
            <Route path="/adduser" element={<AddUser />} />

          </Routes>
        </div>
    </BrowserRouter>
    </>
  );
}

export default App;
