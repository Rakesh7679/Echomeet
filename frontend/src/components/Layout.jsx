import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileBottomNav from "./MobileBottomNav";

const Layout = ({ children, showSidebar = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex">
        {showSidebar && <Sidebar isMobileMenuOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />}

        <div className="flex-1 flex flex-col">
          <Navbar showSidebar={showSidebar} toggleMobileMenu={toggleMobileMenu} />

          <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">{children}</main>
          
          {showSidebar && <MobileBottomNav />}
        </div>
      </div>
    </div>
  );
};
export default Layout;
