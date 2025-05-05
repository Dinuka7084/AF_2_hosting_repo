import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function CountryList() {
  const { user } = useAuth();
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [favourites, setFavourites] = useState([]);
  const countriesPerPage = 12;

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      try {
        let url = "";

        if (searchTerm) {
          url = `https://restcountries.com/v3.1/name/${searchTerm}`;
        } else if (selectedRegion) {
          url = `https://restcountries.com/v3.1/region/${selectedRegion}`;
        } else {
          url = `https://restcountries.com/v3.1/all`;
        }

        const response = await axios.get(url);
        let data = response.data;

        // Filter by language (client-side)
        if (selectedLanguage) {
          data = data.filter(
            (country) =>
              country.languages &&
              Object.values(country.languages).includes(selectedLanguage)
          );
        }

        setCountries(data);
      } catch (error) {
        console.error("Error fetching data", error);
        toast.error("Failed to load countries.");
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, [searchTerm, selectedRegion, selectedLanguage]);

  useEffect(() => {
    if (user) {
      axios
        .get("/api/getFav")
        .then((res) => setFavourites(res.data.favourites))
        .catch(() => toast.error("Failed to load favourites"));
    }
  }, [user]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRegion, selectedLanguage]);

  const regions = [...new Set(countries.map((c) => c.region).filter(Boolean))];
  const allLanguages = countries.flatMap((country) =>
    country.languages ? Object.values(country.languages) : []
  );
  const languages = [...new Set(allLanguages)].sort();

  const filteredCountries = countries;

  const indexOfLastCountry = currentPage * countriesPerPage;
  const indexOfFirstCountry = indexOfLastCountry - countriesPerPage;
  const currentCountries = filteredCountries.slice(
    indexOfFirstCountry,
    indexOfLastCountry
  );
  const totalPages = Math.ceil(filteredCountries.length / countriesPerPage);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const goToPage = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  const isFavourite = (countryCode) => favourites.includes(countryCode);

  const toggleFavourite = async (countryCode) => {
    try {
      if (isFavourite(countryCode)) {
        await axios.delete(`/api/removeFav/${countryCode}`);
        setFavourites((prev) => prev.filter((code) => code !== countryCode));
        toast.success("Removed from favourites");
      } else {
        await axios.post("/api/addFav", { countryCode });
        setFavourites((prev) => [...prev, countryCode]);
        toast.success("Added to favourites");
      }
    } catch {
      toast.error("Failed to update favourites");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explore Countries</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover information about countries around the world. Search, filter, and add your favorites.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search for a country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 px-4 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
              />
            </div>

            <div className="relative">
              <label htmlFor="region" className="sr-only">Region</label>
              <select
                id="region"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="block w-full rounded-lg border-gray-300 bg-gray-50 py-3 px-4 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
              >
                <option value="">All Regions</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <div className="relative">
              <label htmlFor="language" className="sr-only">Language</label>
              <select
                id="language"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="block w-full rounded-lg border-gray-300 bg-gray-50 py-3 px-4 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
              >
                <option value="">All Languages</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            <p className="ml-3 text-lg font-medium text-gray-700">Loading countries...</p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-700">
                Showing <span className="font-medium">{indexOfFirstCountry + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastCountry, filteredCountries.length)}
                </span>{" "}
                of <span className="font-medium">{filteredCountries.length}</span> countries
              </p>
              
              {user && (
                <div className="text-gray-700">
                  <span className="font-medium">{favourites.length}</span> countries in your favorites
                </div>
              )}
            </div>

            {/* Country Grid */}
            {filteredCountries.length === 0 ? (
              <div className="text-center py-16">
                <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No countries found</h3>
                <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentCountries.map((country) => (
                  <div key={country.cca3} className="relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                    {user && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavourite(country.cca3);
                        }}
                        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        aria-label={isFavourite(country.cca3) ? "Remove from favorites" : "Add to favorites"}
                      >
                        {isFavourite(country.cca3) ? (
                          <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="h-6 w-6 text-gray-400 hover:text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        )}
                      </button>
                    )}
                    
                    <Link to={`/country/${country.cca3}`} className="flex flex-col h-full">
                      <div className="h-40 overflow-hidden bg-gray-100">
                        <img
                          src={country.flags.svg}
                          alt={`Flag of ${country.name.common}`}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      
                      <div className="p-5 flex-grow">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">{country.name.common}</h2>
                        
                        <div className="space-y-2 text-gray-700">
                          <div className="flex items-start">
                            <span className="font-medium w-24 text-gray-500">Capital:</span>
                            <span>{country.capital?.[0] || "N/A"}</span>
                          </div>
                          
                          <div className="flex items-start">
                            <span className="font-medium w-24 text-gray-500">Region:</span>
                            <span>{country.region}</span>
                          </div>
                          
                          <div className="flex items-start">
                            <span className="font-medium w-24 text-gray-500">Population:</span>
                            <span>{country.population.toLocaleString()}</span>
                          </div>
                          
                          <div className="flex items-start">
                            <span className="font-medium w-24 text-gray-500">Languages:</span>
                            <span className="truncate">
                              {country.languages
                                ? Object.values(country.languages).join(", ")
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                        <div className="text-indigo-600 font-medium flex items-center">
                          <span>View details</span>
                          <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <nav className="flex justify-center space-x-1">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {(() => {
                    const pagesToShow = [];
                    for (let i = 1; i <= totalPages; i++) {
                      if (
                        i === 1 ||
                        i === totalPages ||
                        Math.abs(i - currentPage) <= 1
                      ) {
                        pagesToShow.push(i);
                      }
                    }
                    const deduped = [...new Set(pagesToShow)].sort((a, b) => a - b);
                    return deduped.reduce((acc, page, idx, arr) => {
                      if (idx > 0 && page - arr[idx - 1] > 1) {
                        acc.push(
                          <span key={`ellipsis-${idx}`} className="px-4 py-2 text-sm text-gray-700">
                            ...
                          </span>
                        );
                      }
                      acc.push(
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`px-4 py-2 text-sm font-medium rounded-md ${
                            currentPage === page
                              ? "bg-indigo-600 text-white hover:bg-indigo-700"
                              : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                      return acc;
                    }, []);
                  })()}
                  
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CountryList;
