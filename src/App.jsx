import React, {useContext} from "react";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import {AuthContext} from "./context/AuthContext";
import {
  Home,
  Login,
  NotFound,
  Project,
  Projects,
  Register,
  Labels,
  Label,
} from "./pages";

export const App = () => {
  const {currentUser} = useContext(AuthContext);

  const RequireAuth = ({children}) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  const GuestAuth = ({children}) => {
    return currentUser ? <Navigate to="/" /> : children;
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route
              index
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              }
            />
            <Route
              path="login"
              element={
                <GuestAuth>
                  <Login />
                </GuestAuth>
              }
            />
            <Route
              path="register"
              element={
                <GuestAuth>
                  <Register />
                </GuestAuth>
              }
            />
            <Route path="labels">
              <Route
                index
                element={
                  <RequireAuth>
                    <Labels />
                  </RequireAuth>
                }
              />
              <Route
                path=":labelId"
                element={
                  <RequireAuth>
                    <Label />
                  </RequireAuth>
                }
              />
            </Route>
            <Route path="projects">
              <Route
                index
                element={
                  <RequireAuth>
                    <Projects />
                  </RequireAuth>
                }
              />
              <Route
                path=":projectId"
                element={
                  <RequireAuth>
                    <Project />
                  </RequireAuth>
                }
              />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};
