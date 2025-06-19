import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

const LogoutButton = () => {

  const handleLogout = () => {
    signOut({
      redirect : false,
    });
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all duration-200 font-medium text-sm"
    >
      <LogOut size={16} />
      <span>Logout</span>
    </button>
  );
};

export default LogoutButton;

