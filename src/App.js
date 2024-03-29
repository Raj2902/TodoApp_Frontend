import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import SignUp from "./pages/signUp";
import Dashboard from "./pages/dashboard";
import Notfound from "./pages/notfound";
import ChangePassword from "./pages/changePassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/change-password/:code" element={<ChangePassword />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
