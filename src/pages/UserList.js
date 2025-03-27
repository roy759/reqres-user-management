import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserList() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [editedData, setEditedData] = useState({ first_name: "", last_name: "", email: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const fetchUsers = (pageNumber) => {
    axios.get(`https://reqres.in/api/users?page=${pageNumber}`)
      .then((response) => setUsers(response.data.data))
      .catch((error) => console.error("Error fetching users:", error));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleDelete = (id) => {
    axios.delete(`https://reqres.in/api/users/${id}`)
      .then(() => {
        setUsers(users.filter(user => user.id !== id)); // Remove user from UI
      })
      .catch(error => console.error("Error deleting user:", error));
  };

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setEditedData({ first_name: user.first_name, last_name: user.last_name, email: user.email });
  };

  const handleSave = (id) => {
    axios.put(`https://reqres.in/api/users/${id}`, editedData)
      .then(() => {
        setUsers(users.map(user => (user.id === id ? { ...user, ...editedData } : user)));
        setEditingUser(null);
      })
      .catch(error => console.error("Error updating user:", error));
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>User List</h2>
      <button onClick={handleLogout} style={{ marginBottom: "20px" }}>Logout</button>
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
        {users.map(user => (
          <div key={user.id} style={{ border: "1px solid #ddd", padding: "10px", margin: "10px", borderRadius: "5px", width: "250px" }}>
            <img src={user.avatar} alt="Avatar" width="80" height="80" style={{ borderRadius: "50%" }} />
            {editingUser === user.id ? (
              <>
                <input type="text" value={editedData.first_name} onChange={(e) => setEditedData({ ...editedData, first_name: e.target.value })} />
                <input type="text" value={editedData.last_name} onChange={(e) => setEditedData({ ...editedData, last_name: e.target.value })} />
                <input type="email" value={editedData.email} onChange={(e) => setEditedData({ ...editedData, email: e.target.value })} />
                <button onClick={() => handleSave(user.id)}>Save</button>
                <button onClick={() => setEditingUser(null)}>Cancel</button>
              </>
            ) : (
              <>
                <p><strong>{user.first_name} {user.last_name}</strong></p>
                <p>{user.email}</p>
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
        <span style={{ margin: "0 10px" }}>Page {page}</span>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}

export default UserList;