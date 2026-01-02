import React, { useState } from "react";
import "./Dashboard.css";


const mockPersonnel = [
  { id: 1, name: "Arun Kumar", role: "Paramedic", skill: "Emergency Care", status: "Ready", zone: "Velachery Main Road", lastCheckIn: "15:45" },
  { id: 2, name: "Priya", role: "Rescue Diver", skill: "Swift Water Rescue", status: "Assigned", zone: "Taramani Link Road", lastCheckIn: "15:20" },
  { id: 3, name: "Suresh", role: "Pilot", skill: "Drone Surveillance", status: "Standby", zone: "Raj Bhavan Area", lastCheckIn: "15:10" },
  { id: 4, name: "Vignesh", role: "Engineer", skill: "Bridge Inspection", status: "Assigned", zone: "Guindy Industrial Estate", lastCheckIn: "14:55" },
  { id: 5, name: "Divya", role: "Medical Officer", skill: "Trauma Response", status: "Ready", zone: "Velachery MRTS Zone", lastCheckIn: "15:30" },
];


const mockSafePlaces = [
  { id: 1, name: "Guru Nanak College Auditorium", site: "Velachery Main Road", capacity: 300, occupancy: 180, food: 600, water: 400, medicalKits: 25, boats: 3, vehicles: 4, medicalStaff: 6, waterLevel: "High" },
  { id: 2, name: "Phoenix Mall Basement Shelter", site: "Velachery Phoenix Zone", capacity: 200, occupancy: 150, food: 350, water: 250, medicalKits: 10, boats: 2, vehicles: 3, medicalStaff: 4, waterLevel: "Moderate" },
  { id: 3, name: "Government School Ground", site: "Taramani Link Road", capacity: 250, occupancy: 220, food: 300, water: 180, medicalKits: 8, boats: 1, vehicles: 2, medicalStaff: 2, waterLevel: "Critical" },
  { id: 4, name: "Community Hall", site: "Guindy Estate", capacity: 150, occupancy: 90, food: 200, water: 150, medicalKits: 5, boats: 0, vehicles: 1, medicalStaff: 1, waterLevel: "Low" },
];


const mockAlerts = [
  { id: 1, type: "Critical", message: "🚨 Heavy flooding reported near Taramani Link Road. Rescue teams deployed." },
  { id: 2, type: "High", message: "⚠️ Rising water near Velachery MRTS and Phoenix Mall areas." },
  { id: 3, type: "Moderate", message: "🌧️ Continuous rainfall expected in Guindy and Raj Bhavan zones." },
  { id: 4, type: "Low", message: "✅ Situation under control in Guindy Industrial Estate." },
];

export default function Dashboard({ user }) {
  const [personnel] = useState(mockPersonnel);
  const [safePlaces] = useState(mockSafePlaces);
  const [alerts] = useState(mockAlerts);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filteredPersonnel = personnel.filter(p =>
    p.zone.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredSafePlaces = safePlaces.filter(s =>
    s.site.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusColor = (status) => {
    switch(status) {
      case "Ready": return "#4CAF50";
      case "Assigned": return "#FF9800";
      case "Standby": return "#9E9E9E";
      default: return "#9E9E9E";
    }
  };

  const waterColor = (level) => {
    switch(level) {
      case "Low": return "#4CAF50";
      case "Moderate": return "#FFEB3B";
      case "High": return "#FF9800";
      case "Critical": return "#f44336";
      default: return "#9E9E9E";
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">🌊 Velachery Flood Rescue Dashboard</h1>
      <p className="dashboard-welcome">Welcome, {user || "Guest"}!</p>

      {/* SUMMARY CARDS */}
      <div className="summary-container">
        <div className="summary-card">
          <h3>Total Personnel</h3>
          <p>{personnel.length}</p>
        </div>
        <div className="summary-card">
          <h3>Active Alerts</h3>
          <p>{alerts.length}</p>
        </div>
        <div className="summary-card">
          <h3>Safe Centers</h3>
          <p>{safePlaces.length}</p>
        </div>
        <div className="summary-card">
          <h3>Flooded Zones</h3>
          <p>{safePlaces.filter(s => s.waterLevel === "High" || s.waterLevel === "Critical").length}</p>
        </div>
      </div>

      <input
        type="text"
        placeholder="🔍 Search by area or zone..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />

      {/* ALERTS PANEL */}
      <section className="panel alerts-panel">
        <h2 className="panel-title">🚨 Live Flood Alerts</h2>
        <div className="alerts-container">
          {alerts.map(a => (
            <div key={a.id} className={`alert-box alert-${a.type.toLowerCase()}`}>
              {a.message}
            </div>
          ))}
        </div>
      </section>

      {/* PERSONNEL PANEL */}
      <section className="panel">
        <h2 className="panel-title">🧑‍🚒 Rescue Personnel</h2>
        <div className="cards-container">
          {filteredPersonnel.map(p => (
            <div key={p.id} className="card">
              <p className="card-name">{p.name} <span className="card-role">({p.role})</span></p>
              <p className="card-site">Zone: {p.zone}</p>
              <p className="card-resource">Skill: {p.skill}</p>
              <p className="card-resource">Last Check-In: {p.lastCheckIn}</p>
              <p
                className="card-status"
                style={{
                  backgroundColor: statusColor(p.status),
                  padding: "5px 12px",
                  borderRadius: "12px",
                  color: "#fff",
                  textAlign: "center",
                  fontWeight: "600",
                  display: "inline-block",
                  minWidth: "80px"
                }}
              >
                {p.status}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SAFE PLACES PANEL */}
      <section className="panel">
        <h2 className="panel-title">🏥 Relief Centers / Safe Places</h2>
        <div className="cards-container">
          {filteredSafePlaces.map(s => {
            const capacityPercent = Math.round((s.occupancy / s.capacity) * 100);
            return (
              <div key={s.id} className="card">
                <p className="card-name">{s.name}</p>
                <p className="card-site">Site: {s.site}</p>
                <p className="card-waterlevel" style={{color: waterColor(s.waterLevel)}}>🌊 Water Level: {s.waterLevel}</p>
                <div className="capacity-bar">
                  <div
                    className="capacity-fill"
                    style={{
                      width: `${capacityPercent}%`,
                      backgroundColor: capacityPercent > 90 ? "#f44336" : "#4caf50"
                    }}
                  ></div>
                </div>
                <p className="card-resource">Occupancy: {s.occupancy} / {s.capacity}</p>
                <p className="card-resource">Boats: {s.boats} | Vehicles: {s.vehicles}</p>
                <p className="card-resource">Medical Staff: {s.medicalStaff}</p>
                <p className="card-resource">Food: {s.food} | Water: {s.water} | Kits: {s.medicalKits}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* MAP PANEL */}
      <section className="panel">
        <h2 className="panel-title">🗺️ Flood Impact Map – Velachery</h2>
        <div className="map-container">
       <iframe
  title="Velachery Flood Map"
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15549.957632661075!2d80.209804706509!3d12.972504626154567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267107b301b3b%3A0x10b784a9e144a6c!2sVelachery%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1716384000000!5m2!1sen!2sin"
  width="100%"
  height="400"
  style={{ border: 0, borderRadius: "12px" }}
  allowFullScreen=""
  loading="lazy"
></iframe>
        </div>
      </section>

      {/* RESCUE SUMMARY */}
      <section className="panel">
        <h2 className="panel-title">📋 Rescue Summary</h2>
        <div className="summary-box">
          <p>🧭 <strong>5 rescue teams</strong> deployed across Velachery and Taramani zones.</p>
          <p>👥 <strong>120 people</strong> evacuated successfully today.</p>
          <p>🏥 <strong>4 relief centers</strong> operational with food and medical supplies.</p>
          <p>🌧️ Continuous rainfall expected over the next 6 hours. Teams on alert.</p>
        </div>
      </section>
    </div>
  );
}
