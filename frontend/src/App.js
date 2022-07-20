
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Logout from "./pages/Logout";
import UpdatePost  from "./pages/UpdatePost";
import AddPost  from "./pages/AddPost";
import DefaultPage  from "./pages/DefaultPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";


function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home  />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/logout" element={<Logout/>} />
        <Route path="/post/update/:id" element={<UpdatePost />} />
        <Route path="/post/add" element={<AddPost />} />
        <Route path="*" element={<DefaultPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
