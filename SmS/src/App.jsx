import { useEffect, useState } from "react";
import axios from "axios";
import config from "./config";
import "./App.css";

const api = axios.create({
  baseURL: config.apiBaseUrl,
  headers: { "Content-Type": "application/json" },
});

function App() {
  const [vehicles, setVehicles] = useState([]);
  const [newVehicle, setNewVehicle] = useState({ brand: "", model: "", year: "", color: "" });
  const [editingVehicle, setEditingVehicle] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await api.get("/vehicles");
      setVehicles(response.data);
    } catch (error) {
      console.error("Fetch error:", error.message);
    }
  };

  const addVehicle = async () => {
    try {
      await api.post("/vehicles", newVehicle);
      setNewVehicle({ brand: "", model: "", year: "", color: "" });
      fetchVehicles();
    } catch (error) {
      console.error("Add error:", error.message);
    }
  };

  const updateVehicle = async () => {
    try {
      await api.put(`/vehicles/${editingVehicle.id}`, editingVehicle);
      setEditingVehicle(null);
      fetchVehicles();
    } catch (error) {
      console.error("Update error:", error.message);
    }
  };

  const deleteVehicle = async (id) => {
    try {
      await api.delete(`/vehicles/${id}`);
      fetchVehicles();
    } catch (error) {
      console.error("Delete error:", error.message);
    }
  };

  return (
    <div className="App">
      <h1>🚗 Vehicle Management</h1>

      <div className="form">
        <input
          type="text"
          placeholder="Brand"
          value={newVehicle.brand}
          onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
        />
        <input
          type="text"
          placeholder="Model"
          value={newVehicle.model}
          onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
        />
        <input
          type="number"
          placeholder="Year"
          value={newVehicle.year}
          onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
        />
        <input
          type="text"
          placeholder="Color"
          value={newVehicle.color}
          onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })}
        />
        <button onClick={addVehicle}>Add Vehicle</button>
      </div>

      {editingVehicle && (
        <div className="form edit-form">
          <h2>Edit Vehicle</h2>
          <input
            type="text"
            value={editingVehicle.brand}
            onChange={(e) => setEditingVehicle({ ...editingVehicle, brand: e.target.value })}
          />
          <input
            type="text"
            value={editingVehicle.model}
            onChange={(e) => setEditingVehicle({ ...editingVehicle, model: e.target.value })}
          />
          <input
            type="number"
            value={editingVehicle.year}
            onChange={(e) => setEditingVehicle({ ...editingVehicle, year: e.target.value })}
          />
          <input
            type="text"
            value={editingVehicle.color}
            onChange={(e) => setEditingVehicle({ ...editingVehicle, color: e.target.value })}
          />
          <button onClick={updateVehicle}>Update</button>
          <button onClick={() => setEditingVehicle(null)}>Cancel</button>
        </div>
      )}

      <ul className="vehicle-list">
        {vehicles.map((vehicle) => (
          <li key={vehicle.id}>
            <span>
              {vehicle.brand} {vehicle.model} ({vehicle.year}) - {vehicle.color}
            </span>
            <div>
              <button onClick={() => setEditingVehicle(vehicle)}>Edit</button>
              <button onClick={() => deleteVehicle(vehicle.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
