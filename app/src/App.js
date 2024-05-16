import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./view/Home";
import MyLoginPage from "./view/MyLoginPage";
import MyRegister from "./view/MyRegister";
import YummyGame from "./view/YamsGame";
import MyChoosePat from "./view/MyChoosePat";
import Winners from "./view/Winners";
import MyHeader from "./view/MyHeader";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/connexion" element={<MyLoginPage />} />
            <Route path="/inscription" element={<MyRegister />} />
            <Route path="/yummy-game" element={<YummyGame />} />
            <Route path="/patisserie_selection" element={<MyChoosePat />} />
            <Route path="/liste_des_gagnants" element={<Winners />} />
        </Routes>
    );
};

const App = () => {
    return (
        <>
            <MyHeader />
            
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </>
    );
};

export default App;
