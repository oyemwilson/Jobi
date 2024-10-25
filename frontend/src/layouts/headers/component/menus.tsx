import React, { useState } from "react";
import menu_data from "@/data/menu-data";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Assuming you have a login modal component
import LoginModal from "../../../app/components/common/popup/login-modal";

const Menus = () => {
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleDashboardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const userData = localStorage.getItem('userData');
    
    if (userData) {
      const { role } = JSON.parse(userData);
      switch (role) {
        case "applicant":
          router.push("/dashboard/candidate-dashboard");
          break;
        case "admin":
          router.push("/dashboard/admin-dashboard");
          break;
        case "employer":
          router.push("/dashboard/employ-dashboard");
          break;
        default:
          alert("Unknown user role");
          break;
      }
    } else {
      alert("Not logged in")
    }
  };

  return (
    <>
      {menu_data.map((menu) => (
        <li key={menu.id} className="nav-item">
          {menu.title === 'Dashboard' ? (
            <a className="nav-link" href="#" onClick={handleDashboardClick}>
              {menu.title}
            </a>
          ) : (
            <Link className="nav-link" href={menu.link} role="button">
              {menu.title}
            </Link>
          )}
        </li>
      ))}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </>
  );
};

export default Menus;