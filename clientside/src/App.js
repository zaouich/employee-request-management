import { Route, Routes } from "react-router-dom";
import Login from "./components/login";
import Navbar from "./components/navbar";


function App() {
  return (
    <div className="App">
       <Navbar/>
      <Routes>
        <Route path = "/login" element={<Login/>}/>
      </Routes>
    </div>
  );
}

export default App;
