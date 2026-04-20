import { NavLink, useLocation } from "react-router-dom";
import { useEffect } from "react";
import {
  FaHome,
  FaUsers,
  FaBook,
  FaShoppingCart,
  FaTags,
  FaChartLine,
  FaCalendarAlt,
  
} from "react-icons/fa";
import { Store } from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const navItems = [
    {
      name: "Dashboard",
      icon: <FaHome />,
      path: "/admin/dashboard",
      color: "from-blue-500 to-blue-600",
      activeDot: true,
    },
    {
      name: "Users",
      icon: <FaUsers />,
      path: "/admin/users",
      color: "from-red-500 to-red-600",
      activeDot: true,
    },
    {
      name: "Products",
      icon: <FaBook />,
      path: "/admin/products",
      color: "from-emerald-500 to-emerald-600",
      activeDot: true,
    },
    {
      name: "Appointments",
      icon: (
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
          <FaCalendarAlt className="text-sm" />
        </div>
      ),
      path: "/admin/appointments",
      activeDot: true,
    },
    {
      name: "Orders",
      icon: <FaShoppingCart />,
      path: "/admin/orders",
      color: "from-orange-500 to-orange-600",
      activeDot: true,
    },
    {
      name: "Vouchers",
      icon: <FaTags />,
      path: "/admin/vouchers",
      color: "from-purple-500 to-purple-600",
      activeDot: true,
    },
    {
      name: "Shop Details",
      icon: <Store />,
      path: "/admin/shop-details",
      color: "from-indigo-500 to-blue-600",
      activeDot: true,
    },
  ];

  // ✅ Animation (UNCHANGED)
  useEffect(() => {
    const elements = document.querySelectorAll(".nav-link");

    elements.forEach((el, index) => {
      if (!el) return;

      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";

      requestAnimationFrame(() => {
        setTimeout(() => {
          el.style.transition = "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        }, index * 120);
      });
    });
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed lg:static z-50 w-72 h-window text-white transition-all duration-300
        bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shadow-lg">
              <FaChartLine className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Vegmox Admin</h1>
              <p className="text-xs text-gray-300">Management Portal</p>
            </div>
          </div>

          <button className="lg:hidden text-white" onClick={toggleSidebar}>
            ✖
          </button>
        </div>

        {/* Nav */}
        <nav className="mt-6 px-4 space-y-4">
          {navItems.map((item) => (
            <NavLink key={item.name} to={item.path}>
              {({ isActive }) => {
                // ✅ Dashboard default for "/admin"
                const isDashboardDefault =
                  item.path === "/admin/dashboard" &&
                  location.pathname === "/admin";

                const isRouteActive = isActive || isDashboardDefault;

                return (
                  <div
                    className={`nav-link relative group flex items-center px-4 py-2 my-3 rounded-xl transition-all duration-300
                    ${
                      isRouteActive
                        ? "bg-white/20 scale-[1.02]"
                        : "hover:bg-white/10"
                    }`}
                  >
                    {/* Shine hover */}
                    <span className="absolute inset-0 overflow-hidden rounded-xl">
                      <span className="absolute left-[-100%] top-0 h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:left-[100%] transition-all duration-700"></span>
                    </span>

                    {/* Icon */}
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-lg mr-3 text-white
                      bg-gradient-to-br ${item.color} group-hover:scale-110 transition-transform`}
                    >
                      {item.icon}
                    </div>

                    {/* Text */}
                    <span className="font-medium">{item.name}</span>

                    {/* ✅ Green Dot */}
                    {isRouteActive && item.activeDot && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    )}
                  </div>
                );
              }}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;