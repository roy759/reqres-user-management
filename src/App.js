import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import UserList from "./pages/UserList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/users" element={<ProtectedRoute component={<UserList />} />} />
      </Routes>
    </Router>
  );
}

// Protected Route to prevent unauthorized access
const ProtectedRoute = ({ component }) => {
  const isLoggedIn = localStorage.getItem("token");
  return isLoggedIn ? component : <Navigate to="/" />;
};

export default App;