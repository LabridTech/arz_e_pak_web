import { signOut } from "next-auth/react";
import { FiLogOut } from "react-icons/fi"; // Import logout icon

const LogoutButton = () => {

  const handleLogout = () => {
    signOut({
      redirect : false,
    });
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all"
    >
      <FiLogOut size={20} /> {/* Icon for logout */}
      <span>Logout</span>
    </button>
  );
};

export default LogoutButton;

