import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

function CountryDetails() {
  const { code } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`https://restcountries.com/v3.1/alpha/${code}`)
      .then((res) => {
        setCountry(res.data[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch country details", err);
        setError("Failed to load country details");
        setLoading(false);
      });
  }, [code]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading country details...</p>
        </div>
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="text-center max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Country Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find details for the requested country.</p>
          <Link
            to="/"
            className="inline-flex items-center px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Return to Country List
          </Link>
        </div>
      </div>
    );
  }

  const {
    name,
    flags,
    capital,
    region,
    subregion,
    population,
    area,
    languages,
    currencies,
    borders,
    timezones,
    maps,
  } = country;

  // Format numbers with commas
  const formatNumber = (num) => num.toLocaleString();

  // Format list of items
  const formatList = (items) => {
    if (!items || Object.keys(items).length === 0) return "N/A";
    return Object.values(items).join(", ");
  };

  // Format currencies
  const formatCurrencies = (currencies) => {
    if (!currencies) return "N/A";
    return Object.entries(currencies)
      .map(([code, curr]) => `${curr.name} (${curr.symbol || code})`)
      .join(", ");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Country List
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header with flag and name */}
          <div className="relative h-48 md:h-64 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center p-4">
            <img
              src={flags.svg}
              alt={`Flag of ${name.common}`}
              className="h-32 md:h-40 object-contain shadow-lg rounded"
            />
          </div>

          <div className="p-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{name.common}</h1>
              <p className="text-gray-600 text-lg mt-1">{name.official}</p>
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500 uppercase tracking-wide">Population</p>
                <p className="text-xl font-semibold mt-1">{formatNumber(population)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500 uppercase tracking-wide">Area</p>
                <p className="text-xl font-semibold mt-1">{formatNumber(area)} km²</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500 uppercase tracking-wide">Region</p>
                <p className="text-xl font-semibold mt-1">{region}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500 uppercase tracking-wide">Capital</p>
                <p className="text-xl font-semibold mt-1">{capital?.[0] || "N/A"}</p>
              </div>
            </div>

            {/* Detailed information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-2">Location</h2>
                  <p><span className="font-medium">Region:</span> {region}</p>
                  <p><span className="font-medium">Subregion:</span> {subregion || "N/A"}</p>
                  {borders && borders.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium mb-1">Borders:</p>
                      <div className="flex flex-wrap gap-2">
                        {borders.map((border) => (
                          <span key={border} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                            {border}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-2">Languages & Currency</h2>
                  <p><span className="font-medium">Languages:</span> {formatList(languages)}</p>
                  <p><span className="font-medium">Currencies:</span> {formatCurrencies(currencies)}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-2">Time</h2>
                  <div className="max-h-24 overflow-y-auto">
                    <p><span className="font-medium">Timezones:</span></p>
                    <ul className="mt-1 space-y-1">
                      {timezones?.map((zone, index) => (
                        <li key={index} className="text-gray-700">{zone}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {maps && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-2">Maps</h2>
                    <div className="flex flex-col sm:flex-row gap-3">
                      {maps.googleMaps && (
                        <a
                          href={maps.googleMaps}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                          </svg>
                          Google Maps
                        </a>
                      )}
                      {maps.openStreetMaps && (
                        <a
                          href={maps.openStreetMaps}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          OpenStreetMap
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 text-gray-500 text-sm">
          Data provided by <a href="https://restcountries.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">REST Countries API</a>
        </div>
      </div>
    </div>
  );
}

export default CountryDetails;