import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";


function App() {
  return (
    <div className="App">
       <Navbar/>
      <Routes>
        <Route path = "/login" />
      </Routes>
    </div>
  );
}

export default App;
