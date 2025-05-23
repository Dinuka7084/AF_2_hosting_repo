import { Routes, Route, Link } from 'react-router-dom';

import CountryList from './components/CountryList'
import './App.css'
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import { useAuth } from './context/AuthContext';
import Favourites from './components/Favourites';
import CountryDetails from './components/CountryDetails';

function App() {
  const { user, logout, checking } = useAuth();

  if (checking) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">Checking session...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600">GlobeExplorer</Link>
            </div>
            
            <nav className="flex items-center space-x-6">
              <Link to="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150">
                Home
              </Link>
              
              {user && (
                <Link to="/favourites" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150">
                  Favourites
                </Link>
              )}
              
              {!user && (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150">
                    Login
                  </Link>
                  <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150">
                    Sign Up
                  </Link>
                </>
              )}
              
              {user && (
                <button 
                  onClick={logout} 
                  className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150 flex items-center"
                >
                  <span>Logout</span>
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="">
        <div className="bg- shadow-sm rounded-lg ">
          <Routes>
            <Route path="/" element={<CountryList />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path='/favourites' element={<Favourites />} />
            <Route path="/country/:code" element={<CountryDetails />} />
          </Routes>
        </div>
      </main>

      <footer className="bg-white mt-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            GlobeExplorer &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;