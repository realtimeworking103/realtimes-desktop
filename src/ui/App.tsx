import { HashRouter, Route, Routes } from "react-router";

import RootLayout from "./app/layout";
import Layout from "./app/(main)/layout";

import { ProtectedRoute } from "./components/protected-route";
import Login from "./app/login/page";
import Dashboard from "./app/(main)/dashboard/page";
import LDPlayer from "./app/(main)/ldplayer/page";
import CreateLDPlayer from "./app/(main)/create-ldplayer/page";
import FileManager from "./app/(main)/file-manager/page";
import ProFile from "./app/(main)/profile/page";
import Setting from "./app/(main)/setting/page";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<Layout />}>
            <Route
              index
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path={"/dashboard"}
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path={"/ldplayer"}
              element={
                <ProtectedRoute>
                  <LDPlayer />
                </ProtectedRoute>
              }
            />

            <Route
              path={"/create-ldplayer"}
              element={
                <ProtectedRoute>
                  <CreateLDPlayer />
                </ProtectedRoute>
              }
            />

            <Route
              path={"/file"}
              element={
                <ProtectedRoute>
                  <FileManager />
                </ProtectedRoute>
              }
            />

            <Route
              path={"/profile"}
              element={
                <ProtectedRoute>
                  <ProFile />
                </ProtectedRoute>
              }
            />

            <Route
              path={"/setting"}
              element={
                <ProtectedRoute>
                  <Setting />
                </ProtectedRoute>
              }
            />
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
