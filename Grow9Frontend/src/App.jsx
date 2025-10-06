import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./Pages/Home";
import About from "./Pages/AboutUS";
import Faq from "./Pages/FAQ";
import Login from "./Pages/Login";
import Admin from "./Pages/Admin";
import Sponser from "./Pages/Sponser";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          {/* Default landing page */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Admin" element={<Admin />} />
          <Route path="/sponser" element={<Sponser />} />
        </Route>
      </Routes>
    </Router>
  );
}
