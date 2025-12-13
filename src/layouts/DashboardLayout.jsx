import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col"> {/* Use flex-col to stack Header and content vertically */}
        <Header />
        <div className="flex-1 px-6 py-4 mt-0"> {/* Apply padding here and let it take remaining height */}
          {children}
        </div>
      </div>
    </div>
  );
}
