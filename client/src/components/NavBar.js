import { NavLink } from "react-router-dom";

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
      isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-100"
    }`;

  return (
    <nav className="flex gap-4 items-center p-4 bg-gray-100 shadow">
      <NavLink to="/" className={linkClass} end>
        Home
      </NavLink>
      <NavLink to="/products" className={linkClass}>
        Products
      </NavLink>
      <NavLink to="/sales" className={linkClass}>
        Sales
      </NavLink>
      <NavLink to="/dashboard" className={linkClass}>
        Dashboard
      </NavLink>
      <NavLink to="/mohajons" className={linkClass}>
        Mohajons
      </NavLink>
    </nav>
  );
};

export default Navbar;