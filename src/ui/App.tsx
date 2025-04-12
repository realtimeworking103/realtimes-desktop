import { HashRouter, Route, Routes } from "react-router";
import Dashboard from "./app/(main)/dashboard/page";
import LineManagement from "./app/(main)/line-management/page";
import Login from "./app/login/page";
import RootLayout from "./app/layout";
import { ProtectedRoute } from "./components/protected-route";
import Layout from "./app/(main)/layout";
import { routes } from "./routes";

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
              path={routes.lineManagement}
              element={
                <ProtectedRoute>
                  <LineManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path={"/ldplayer-management"}
              element={
                <ProtectedRoute>
                  <LineManagement />
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
