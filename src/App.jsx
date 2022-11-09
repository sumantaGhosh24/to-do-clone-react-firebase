import React, {useContext} from "react";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import {AuthContext} from "./context/AuthContext";
import {
  Home,
  Login,
  NewProject,
  NewSub,
  NewTask,
  NotFound,
  Project,
  Projects,
  Register,
  Sub,
  Subs,
  Task,
  Tasks,
  UpdateProject,
  UpdateSub,
  UpdateTask,
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
              <Route
                path="new"
                element={
                  <RequireAuth>
                    <NewProject />
                  </RequireAuth>
                }
              />
              <Route
                path="update/:projectId"
                element={
                  <RequireAuth>
                    <UpdateProject />
                  </RequireAuth>
                }
              />
            </Route>
            <Route path="tasks">
              <Route
                index
                element={
                  <RequireAuth>
                    <Tasks />
                  </RequireAuth>
                }
              />
              <Route
                path=":taskId"
                element={
                  <RequireAuth>
                    <Task />
                  </RequireAuth>
                }
              />
              <Route
                path="new"
                element={
                  <RequireAuth>
                    <NewTask />
                  </RequireAuth>
                }
              />
              <Route
                path="update/:taskId"
                element={
                  <RequireAuth>
                    <UpdateTask />
                  </RequireAuth>
                }
              />
            </Route>
            <Route path="subs">
              <Route
                index
                element={
                  <RequireAuth>
                    <Subs />
                  </RequireAuth>
                }
              />
              <Route
                path=":subId"
                element={
                  <RequireAuth>
                    <Sub />
                  </RequireAuth>
                }
              />
              <Route
                path="new"
                element={
                  <RequireAuth>
                    <NewSub />
                  </RequireAuth>
                }
              />
              <Route
                path="update/:subId"
                element={
                  <RequireAuth>
                    <UpdateSub />
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
