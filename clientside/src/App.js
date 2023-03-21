import { Route, Routes } from "react-router-dom";
import ForgotPassword from "./components/forgotPassword";
import Login from "./components/login";
import Navbar from "./components/navbar";
import SignUp from "./components/signUp";


function App() {
  return (
    <div className="App">
       <Navbar/>
      <Routes>
        <Route path = "/login" element={<Login/>}/>
        <Route path = "/signUp" element={<SignUp/>}/>
        <Route path = "/forgotPassword" element={<ForgotPassword/>}/>
      </Routes>
    </div>
  );
}

export default App;
