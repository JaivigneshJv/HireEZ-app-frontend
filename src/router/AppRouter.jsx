import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/Auth/Login";
import AuthRoute from "./AuthRoute";
import Register from "../pages/Auth/Register";
import EmailVerification from "../pages/Auth/EmailVerification";
import UserProfileRoute from "./UserProfileRoute";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/verify" element={<EmailVerification />} />
        <Route path="/login/verify" element={<EmailVerification />} />
        <Route path="/dashboard" element={<AuthRoute />} />
        <Route path="/profile" element={<UserProfileRoute />} />
        <Route
          path="*"
          element={
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                fontSize: "2rem",
              }}>
              Page Not Found
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
