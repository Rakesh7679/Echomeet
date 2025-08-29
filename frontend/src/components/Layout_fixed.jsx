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
    <div className="min-h-screen bg-base-100 text-base-content">
      <div className="flex h-screen">
        {showSidebar && <Sidebar isMobileMenuOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />}

        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar showSidebar={showSidebar} toggleMobileMenu={toggleMobileMenu} />

          <main className="flex-1 overflow-y-auto pb-16 lg:pb-0 bg-base-100">{children}</main>
          
          {showSidebar && <MobileBottomNav />}
        </div>
      </div>
    </div>
  );
};
export default Layout;
