import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, MenuIcon, ShipWheelIcon, SearchIcon, XIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";
import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchFriends } from "../lib/api";

const Navbar = ({ showSidebar = false, toggleMobileMenu }) => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const navigate = useNavigate();
  const isChatPage = location.pathname?.startsWith("/chat");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  const { logoutMutation } = useLogout();

  // Search friends query
  const { data: searchResults = [], isLoading: isSearching } = useQuery({
    queryKey: ["searchFriends", searchQuery],
    queryFn: () => {
      console.log(`Searching for: "${searchQuery}"`);
      return searchFriends(searchQuery);
    },
    enabled: searchQuery.length >= 2, // Minimum 2 characters
    onSuccess: (data) => {
      console.log(`Search results:`, data);
    },
    onError: (error) => {
      console.error('Search error:', error);
    }
  });

  // Handle search result click
  const handleResultClick = (friendId) => {
    navigate(`/chat/${friendId}`);
    setSearchQuery("");
    setShowResults(false);
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Show results when search query changes
  useEffect(() => {
    setShowResults(searchQuery.length >= 2);
  }, [searchQuery]);

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full">
          {/* Mobile Menu Button - Only show when sidebar is present and on mobile */}
          {showSidebar && (
            <button
              onClick={toggleMobileMenu}
              className="btn btn-ghost btn-circle lg:hidden"
              aria-label="Open mobile menu"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          )}

          {/* LOGO - ONLY IN THE CHAT PAGE OR WHEN NO SIDEBAR */}
          {(isChatPage || !showSidebar) && (
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2.5">
                <ShipWheelIcon className="size-6 sm:size-9 text-primary" />
                <span className="text-xl sm:text-2xl lg:text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
                  ECHOMEET
                </span>
              </Link>
            </div>
          )}

          {/* Search Bar - Center */}
          <div className="flex-1 max-w-md mx-4 relative" ref={searchRef}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search friends and users..."
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setShowResults(false);
                  }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <XIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {showResults && (
              <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {searchQuery.length < 2 ? (
                  <div className="p-4 text-center text-gray-500">
                    Type at least 2 characters to search...
                  </div>
                ) : isSearching ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="loading loading-spinner loading-sm"></div>
                    <span className="ml-2">Searching...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  <ul className="py-1">
                    {searchResults.map((friend) => (
                      <li key={friend._id}>
                        <button
                          onClick={() => handleResultClick(friend._id)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3"
                        >
                          <div className="avatar">
                            <div className="w-8 h-8 rounded-full">
                              <img
                                src={friend.profilePic || '/default-avatar.png'}
                                alt={friend.fullName}
                                onError={(e) => {
                                  e.target.src = '/default-avatar.png';
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {friend.fullName}
                            </div>
                            {friend.location && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {friend.location}
                              </div>
                            )}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    <div>No users found matching "{searchQuery}"</div>
                    <div className="text-xs mt-1">Try searching for friends or other users</div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <Link to={"/notifications"}>
              <button className="btn btn-ghost btn-circle btn-sm sm:btn-md">
                <BellIcon className="h-4 w-4 sm:h-6 sm:w-6 text-base-content opacity-70" />
              </button>
            </Link>

            <ThemeSelector />

            <div className="avatar">
              <div className="w-7 sm:w-9 rounded-full">
                <img 
                  src={authUser?.profilePic || '/default-avatar.svg'} 
                  alt="User Avatar" 
                  rel="noreferrer" 
                  onError={(e) => {
                    e.target.src = '/default-avatar.svg';
                  }}
                />
              </div>
            </div>

            {/* Logout button */}
            <button className="btn btn-ghost btn-circle btn-sm sm:btn-md" onClick={logoutMutation}>
              <LogOutIcon className="h-4 w-4 sm:h-6 sm:w-6 text-base-content opacity-70" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
