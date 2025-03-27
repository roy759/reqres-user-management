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
    <div style={styles.container}>
      <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      <h2 style={styles.title}>User List</h2>
      <div style={styles.userContainer}>
        {users.map(user => (
          <div key={user.id} style={styles.userCard}>
            <img src={user.avatar} alt="Avatar" style={styles.avatar} />
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
      <div style={styles.pagination}>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
        <span>Page {page}</span>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}

const styles = {
    container: {
      textAlign: "center",
      padding: "20px",
      position: "relative",
    },
    logoutButton: {
      position: "absolute",
      top: "10px",
      right: "20px",
      padding: "10px 15px",
      fontSize: "16px",
      backgroundColor: "#f44336",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    title: {
      fontSize: "50px",
      marginBottom: "20px",
    },
    userContainer: {
        display: "flex",
        justifyContent: "center", // Center horizontally
        alignItems: "center", // Center vertically
        flexWrap: "wrap",
        gap: "20px",
        marginTop: "150px", 
      },
    userCard: {
      width: "250px",
      padding: "15px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      textAlign: "center",
      backgroundColor: "#f9f9f9",
    },
    avatar: {
      borderRadius: "50%",
      width: "90px",
      height: "90px",
    },
    pagination: {
      marginTop: "30px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "15px",
    },
    pageButton: {
      padding: "10px 15px",
      fontSize: "18px",
      cursor: "pointer",
      backgroundColor: "#007BFF",
      color: "white",
      border: "none",
      borderRadius: "5px",
    },
    pageText: {
      fontSize: "20px",
      fontWeight: "bold",
    },
  };

export default UserList;
