import { useState, useEffect } from "react";
import "./App.css";

// Import Leaflet CSS and components
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";

// Fix default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker icons based on severity
const getMarkerIcon = (severity) => {
  const color = severity === "Critical" ? "#e63950" : 
                severity === "High" ? "#e89a27" : "#467de8";
  
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      background: ${color};
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 0 20px ${color};
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 11px;
    ">${severity === "Critical" ? "!" : severity === "High" ? "H" : "M"}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Mock data with realistic Andhra Pradesh coordinates
const mockForecasts = [
  {
    id: 1,
    rank: 1,
    location: "Vijayawada",
    district: "NTR",
    state: "Andhra Pradesh",
    scamType: "UPI Fraud",
    bank: "SBI",
    score: 94,
    time: "18:00 - 20:00",
    amount: "₹85,000",
    severity: "Critical",
    lat: 16.5062,
    lng: 80.6480,
  },
  {
    id: 2,
    rank: 2,
    location: "Guntur",
    district: "Guntur",
    state: "Andhra Pradesh",
    scamType: "Phishing",
    bank: "HDFC",
    score: 87,
    time: "20:00 - 22:00",
    amount: "₹62,000",
    severity: "High",
    lat: 16.3067,
    lng: 80.4365,
  },
  {
    id: 3,
    rank: 3,
    location: "Amaravati",
    district: "Guntur",
    state: "Andhra Pradesh",
    scamType: "Investment Fraud",
    bank: "ICICI",
    score: 79,
    time: "17:00 - 19:00",
    amount: "₹45,000",
    severity: "Medium",
    lat: 16.5732,
    lng: 80.3654,
  },
  {
    id: 4,
    rank: 4,
    location: "Tenali",
    district: "Guntur",
    state: "Andhra Pradesh",
    scamType: "UPI Fraud",
    bank: "SBI",
    score: 72,
    time: "19:00 - 21:00",
    amount: "₹38,000",
    severity: "Medium",
    lat: 16.2430,
    lng: 80.6484,
  },
  {
    id: 5,
    rank: 5,
    location: "Eluru",
    district: "Eluru",
    state: "Andhra Pradesh",
    scamType: "Phishing",
    bank: "Axis",
    score: 68,
    time: "21:00 - 23:00",
    amount: "₹29,000",
    severity: "Medium",
    lat: 16.7111,
    lng: 81.1030,
  },
  {
    id: 6,
    rank: 6,
    location: "Rajahmundry",
    district: "East Godavari",
    state: "Andhra Pradesh",
    scamType: "Investment Fraud",
    bank: "SBI",
    score: 65,
    time: "16:00 - 18:00",
    amount: "₹25,000",
    severity: "Medium",
    lat: 16.9936,
    lng: 81.7670,
  },
  {
    id: 7,
    rank: 7,
    location: "Kakinada",
    district: "East Godavari",
    state: "Andhra Pradesh",
    scamType: "UPI Fraud",
    bank: "HDFC",
    score: 58,
    time: "18:30 - 20:30",
    amount: "₹18,000",
    severity: "Low",
    lat: 16.9891,
    lng: 82.2475,
  },
  {
    id: 8,
    rank: 8,
    location: "Visakhapatnam",
    district: "Visakhapatnam",
    state: "Andhra Pradesh",
    scamType: "Phishing",
    bank: "ICICI",
    score: 55,
    time: "19:00 - 21:00",
    amount: "₹15,000",
    severity: "Low",
    lat: 17.6868,
    lng: 83.2185,
  },
];

function App() {
  // State variables
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [severity, setSeverity] = useState("All");
  const [stateFilter, setStateFilter] = useState("All");
  const [districtFilter, setDistrictFilter] = useState("All");
  const [scamFilter, setScamFilter] = useState("All");
  const [bankFilter, setBankFilter] = useState("All");

  // Simulate fetching data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      try {
        // Simulate API success (90% success rate)
        const success = Math.random() > 0.1;
        
        if (success) {
          setForecasts(mockForecasts);
        } else {
          throw new Error("Failed to fetch forecast data. Please try again.");
        }
      } catch (err) {
        setError(err.message);
        setForecasts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter logic
  const filteredForecasts = forecasts.filter((item) => {
    const matchState = stateFilter === "All" || item.state === stateFilter;
    const matchDistrict = districtFilter === "All" || item.district === districtFilter;
    const matchScam = scamFilter === "All" || item.scamType === scamFilter;
    const matchBank = bankFilter === "All" || item.bank === bankFilter;
    const matchSeverity = severity === "All" || item.severity === severity;
    return matchState && matchDistrict && matchScam && matchBank && matchSeverity;
  });

  // Helper function for popup colors
  const getMarkerColor = (severity) => {
    switch(severity) {
      case "Critical": return "#e63950";
      case "High": return "#e89a27";
      case "Medium": return "#467de8";
      case "Low": return "#6c8cff";
      default: return "gray";
    }
  };

  // Calculate KPI values
  const activeCases = 42; // Static for demo
  const criticalForecasts = forecasts.filter(f => f.severity === "Critical").length;
  const highRiskAccounts = 15; // Static for demo
  const expectedLoss = "₹12.5L"; // Static for demo

  // Get unique values for filters
  const states = [...new Set(forecasts.map(f => f.state))];
  const districts = [...new Set(forecasts.map(f => f.district))];
  const scamTypes = [...new Set(forecasts.map(f => f.scamType))];
  const banks = [...new Set(forecasts.map(f => f.bank))];
  const severities = ["Critical", "High", "Medium", "Low"];

  // Render loading state
  if (loading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading risk data...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="app">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Unable to load forecast data</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">

      <header className="header">
        <div>
          <h1>SCAMLENS NEXUS</h1>
          <p>Cyber-Financial Intelligence Platform</p>
        </div>
        <div className="header-status">
          <span className="status-dot"></span>
          System Online
        </div>
      </header>

      <main className="dashboard">

        {/* KPI CARDS */}
        <section className="kpi-grid">
          <div className="kpi-card">
            <p>ACTIVE CASES</p>
            <h2>{activeCases}</h2>
            <span>Current cases</span>
          </div>
          <div className="kpi-card critical">
            <p>CRITICAL FORECASTS</p>
            <h2>{criticalForecasts}</h2>
            <span>Require attention</span>
          </div>
          <div className="kpi-card warning">
            <p>HIGH-RISK ACCOUNTS</p>
            <h2>{highRiskAccounts}</h2>
            <span>Under monitoring</span>
          </div>
          <div className="kpi-card loss">
            <p>EXPECTED LOSS</p>
            <h2>{expectedLoss}</h2>
            <span>Estimated exposure</span>
          </div>
        </section>

        {/* FILTERS */}
        <section className="panel">
          <div className="panel-title">
            <div>
              <h2>Risk Filters</h2>
              <span>Filter forecast results</span>
            </div>
            <span className="forecast-count">{filteredForecasts.length} results</span>
          </div>
          <div className="filters">
            <select 
              value={stateFilter} 
              onChange={(e) => setStateFilter(e.target.value)}
            >
              <option value="All">All States</option>
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            <select 
              value={districtFilter} 
              onChange={(e) => setDistrictFilter(e.target.value)}
            >
              <option value="All">All Districts</option>
              {districts.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
            <select 
              value={scamFilter} 
              onChange={(e) => setScamFilter(e.target.value)}
            >
              <option value="All">All Scam Types</option>
              {scamTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select 
              value={bankFilter} 
              onChange={(e) => setBankFilter(e.target.value)}
            >
              <option value="All">All Banks</option>
              {banks.map(bank => (
                <option key={bank} value={bank}>{bank}</option>
              ))}
            </select>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
            >
              <option value="All">All Severity</option>
              {severities.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </section>

        {/* PREDICTIVE MAP */}
        <section className="map-panel">
          <div className="panel-title">
            <div>
              <h2>Predictive Cash-Out Map</h2>
              <span>Predicted high-risk withdrawal locations</span>
            </div>
            <div className="legend">
              <span><i className="legend-dot critical-dot"></i>Critical</span>
              <span><i className="legend-dot high-dot"></i>High</span>
              <span><i className="legend-dot medium-dot"></i>Medium</span>
              <span><i className="legend-dot low-dot"></i>Low</span>
            </div>
          </div>
          <div className="map">
            {filteredForecasts.length === 0 ? (
              <div className="empty-state">
                <p>No forecasts found for the selected filters.</p>
              </div>
            ) : (
              <MapContainer
                center={[16.5, 80.6]}
                zoom={8}
                style={{ height: "100%", width: "100%" }}
                zoomControl={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <MarkerClusterGroup
                  chunkedLoading
                  maxClusterRadius={50}
                  iconCreateFunction={(cluster) => {
                    const count = cluster.getChildCount();
                    return L.divIcon({
                      html: `<div style="background:#1e8cff;color:white;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-weight:bold;border:2px solid white;box-shadow:0 0 20px #1e8cff;">${count}</div>`,
                      className: "custom-marker",
                      iconSize: [36, 36],
                      iconAnchor: [18, 18],
                    });
                  }}
                >
                  {filteredForecasts.map((item) => (
                    <Marker
                      key={item.id}
                      position={[item.lat, item.lng]}
                      icon={getMarkerIcon(item.severity)}
                    >
                      <Popup>
                        <div className="custom-popup">
                          <h3>{item.location}</h3>
                          <p><strong>District:</strong> {item.district}</p>
                          <p><strong>Score:</strong> <span style={{color: getMarkerColor(item.severity)}}>{item.score}%</span></p>
                          <p><strong>Severity:</strong> <span className={`badge ${item.severity.toLowerCase()}`}>{item.severity}</span></p>
                          <p><strong>Time:</strong> {item.time}</p>
                          <p><strong>Amount:</strong> {item.amount}</p>
                          <p><strong>Scam Type:</strong> {item.scamType}</p>
                          <p><strong>Bank:</strong> {item.bank}</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MarkerClusterGroup>
              </MapContainer>
            )}
          </div>
        </section>

        {/* FORECAST TABLE */}
        <section className="panel">
          <div className="panel-title">
            <div>
              <h2>Top Cash-Out Forecasts</h2>
              <span>Ranked predicted locations</span>
            </div>
            <span className="forecast-count">{filteredForecasts.length} forecasts</span>
          </div>
          <div className="table-container">
            {filteredForecasts.length === 0 ? (
              <div className="empty-state-table">
                <p>No forecasts found for the selected filters.</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>RANK</th>
                    <th>LOCATION</th>
                    <th>SCORE</th>
                    <th>TIME WINDOW</th>
                    <th>EXPECTED AMOUNT</th>
                    <th>SEVERITY</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredForecasts.map((forecast) => (
                    <tr key={forecast.id}>
                      <td><strong>#{forecast.rank}</strong></td>
                      <td>
                        <strong>{forecast.location}</strong>
                        <small>{forecast.district}</small>
                      </td>
                      <td>
                        <div className="score">
                          <strong>{forecast.score}%</strong>
                          <div className="score-bar">
                            <div style={{ width: `${forecast.score}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td>{forecast.time}</td>
                      <td>{forecast.amount}</td>
                      <td>
                        <span className={`badge ${forecast.severity.toLowerCase()}`}>
                          {forecast.severity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}

export default App;