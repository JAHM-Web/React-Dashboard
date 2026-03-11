import { useState } from "react";

export default function Weather() {
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [windspeed, setWindspeed] = useState(null);
  const [resultCity, setResultCity] = useState("");
  const [resultState, setResultState] = useState("");

  const getWeather = async () => {
    // reset previous results while fetching
    setTemperature(null);
    setHumidity(null);
    setWindspeed(null);

  const geoRes = await fetch(
  `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&country=US`
);

const geoData = await geoRes.json();

if (!geoData.results) {
  alert("Location not found");
  return;
}

// find the correct state
const locationResult = geoData.results.find(
  place => place.admin1.toLowerCase() === state.toLowerCase()
);

// wrong state
if (!locationResult) {
  alert("City found but not in that state");
  return;
}

const lat = locationResult.latitude;
const lon = locationResult.longitude;

  const weatherRes = await fetch(
  `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit&hourly=relativehumidity_2m`
  );

  const weatherData = await weatherRes.json();

  setTemperature(weatherData.current_weather.temperature);
  setWindspeed(weatherData.current_weather.windspeed);
  // take first hourly value for humidity
  if (weatherData.hourly && weatherData.hourly.relativehumidity_2m && weatherData.hourly.relativehumidity_2m.length) {
    setHumidity(weatherData.hourly.relativehumidity_2m[0]);
  } else {
    setHumidity(null);
  }
  // store location used for result box
  setResultCity(city);
  setResultState(state);
  };

  return (
    <>
      <div className="weather-box">
        <h2>Where are You?</h2>

        <input
          type="text"
          placeholder="City (ex: Lansing)"
          onChange={(e) => setCity(e.target.value)}
        />

        <input
          type="text"
          placeholder="State (ex: Michigan)"
          onChange={(e) => setState(e.target.value)}
        />

        <button onClick={getWeather}>Get Weather</button>
      </div>

      {temperature && (
        <div className="weather-box weather-result-box">
          <h3>{resultCity}, {resultState}</h3>
          <p className="temperature-readout">{temperature}<span className="degree-symbol">°F</span></p>
          <div className="weather-details">
            {humidity !== null && (
              <div className="detail-box">
                <div className="detail-label">Humidity</div>
                <div className="detail-value">{humidity}%</div>
              </div>
            )}
            {windspeed !== null && (
              <div className="detail-box">
                <div className="detail-label">Wind Speed</div>
                <div className="detail-value">{windspeed} mph</div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}