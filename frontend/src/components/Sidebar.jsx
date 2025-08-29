import { Link, useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, ShipWheelIcon, UsersIcon, XIcon } from "lucide-react";

const Sidebar = ({ isMobileMenuOpen, toggleMobileMenu }) => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0">
        <div className="p-5 border-b border-base-300">
          <Link to="/" className="flex items-center gap-2.5">
            <ShipWheelIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
              ECHOMEET
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            to="/"
            className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
              currentPath === "/" ? "btn-active" : ""
            }`}
          >
            <HomeIcon className="size-5 text-base-content opacity-70" />
            <span>Home</span>
          </Link>

          <Link
            to="/friends"
            className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
              currentPath === "/friends" ? "btn-active" : ""
            }`}
          >
            <UsersIcon className="size-5 text-base-content opacity-70" />
            <span>Friends</span>
          </Link>

          <Link
            to="/notifications"
            className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
              currentPath === "/notifications" ? "btn-active" : ""
            }`}
          >
            <BellIcon className="size-5 text-base-content opacity-70" />
            <span>Notifications</span>
          </Link>
        </nav>

        {/* USER PROFILE SECTION */}
        <div className="p-4 border-t border-base-300 mt-auto">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-10 rounded-full">
                <img 
                  src={authUser?.profilePic || '/default-avatar.svg'} 
                  alt="User Avatar" 
                  onError={(e) => {
                    e.target.src = '/default-avatar.svg';
                  }}
                />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{authUser?.fullName || 'User'}</p>
              <p className="text-xs text-success flex items-center gap-1">
                <span className="size-2 rounded-full bg-success inline-block" />
                Online
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={toggleMobileMenu} />
          <aside className="fixed left-0 top-0 h-full w-64 bg-base-200 border-r border-base-300 flex flex-col transform translate-x-0 transition-transform">
            <div className="p-5 border-b border-base-300 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2.5" onClick={toggleMobileMenu}>
                <ShipWheelIcon className="size-8 text-primary" />
                <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                  ECHOMEET
                </span>
              </Link>
              <button
                onClick={toggleMobileMenu}
                className="btn btn-ghost btn-sm btn-circle"
              >
                <XIcon className="size-5" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              <Link
                to="/"
                onClick={toggleMobileMenu}
                className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                  currentPath === "/" ? "btn-active" : ""
                }`}
              >
                <HomeIcon className="size-5 text-base-content opacity-70" />
                <span>Home</span>
              </Link>

              <Link
                to="/friends"
                onClick={toggleMobileMenu}
                className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                  currentPath === "/friends" ? "btn-active" : ""
                }`}
              >
                <UsersIcon className="size-5 text-base-content opacity-70" />
                <span>Friends</span>
              </Link>

              <Link
                to="/notifications"
                onClick={toggleMobileMenu}
                className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                  currentPath === "/notifications" ? "btn-active" : ""
                }`}
              >
                <BellIcon className="size-5 text-base-content opacity-70" />
                <span>Notifications</span>
              </Link>
            </nav>

            {/* USER PROFILE SECTION */}
            <div className="p-4 border-t border-base-300 mt-auto">
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="w-10 rounded-full">
                    <img 
                      src={authUser?.profilePic || '/default-avatar.png'} 
                      alt="User Avatar" 
                      onError={(e) => {
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{authUser?.fullName}</p>
                  <p className="text-xs text-success flex items-center gap-1">
                    <span className="size-2 rounded-full bg-success inline-block" />
                    Online
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
export default Sidebar;
