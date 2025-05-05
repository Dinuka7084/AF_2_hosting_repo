import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function Favourites() {
  const { user } = useAuth();
  const [countries, setCountries] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allCountriesRes, favRes] = await Promise.all([
          axios.get("https://restcountries.com/v3.1/all"),
          axios.get("/api/getFav"),
        ]);

        setCountries(allCountriesRes.data);
        setFavourites(favRes.data.favourites);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load favourites");
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [user]);

  const favouriteCountries = countries.filter((country) =>
    favourites.includes(country.cca3)
  );

  if (!user) {
    return <p className="text-center mt-10 text-red-500">You must be logged in to view favourites.</p>;
  }

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Loading favourites...</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Favourite Countries</h2>

      {favouriteCountries.length === 0 ? (
        <p className="text-center text-gray-500">No favourites added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favouriteCountries.map((country) => (
            <div
              key={country.cca3}
              className="border p-4 rounded shadow hover:shadow-lg transition"
            >
              <img
                src={country.flags.svg}
                alt={country.name.common}
                className="pb-5 w-full h-40 object-cover"
              />
              <h2 className="text-xl font-semibold">{country.name.common}</h2>
              <p><strong>Capital:</strong> {country.capital?.[0] || "N/A"}</p>
              <p><strong>Region:</strong> {country.region}</p>
              <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
              <p>
                <strong>Languages:</strong>{" "}
                {country.languages
                  ? Object.values(country.languages).join(", ")
                  : "N/A"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favourites;
