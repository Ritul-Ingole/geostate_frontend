import { useEffect } from "react";

function App() {
  useEffect(() => {
    fetch("http://localhost:8000/api/properties")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched properties:", data);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      });
  }, []);

  return <h1>GeoEstate Frontend</h1>;
}

export default App;