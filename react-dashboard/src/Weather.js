import { useState } from "react";

export default function Weather() {
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [temperature, setTemperature] = useState(null);

  const getWeather = async () => {

  const location = `${city}, ${state}, USA`;

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
  `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit`
  );

  const weatherData = await weatherRes.json();

  setTemperature(weatherData.current_weather.temperature);
  };

  return (
    <div>
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

      {temperature && (
        <p>Current Temperature: {temperature}°F</p>
      )}
    </div>
  );
}