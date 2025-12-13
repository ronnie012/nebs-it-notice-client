import { MdNotificationsNone, MdAccountCircle } from "react-icons/md";
import moment from "moment";

export default function Header() {
  // In a real application, the user's name would come from an authentication context or prop.
  // For now, "Asif" is hardcoded as a placeholder.
  const userName = "Asif";
  const todayDate = moment().format('DD MMMM, YYYY');

  return (
    <header className="bg-white shadow-sm p-4 rounded-lg flex items-center justify-between">
      <div className="flex flex-col">
        <h1 className="font-medium text-medium text-gray-800">Good Morning, {userName}</h1>
        <span className="text-sm text-gray-600">{todayDate}</span>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <MdNotificationsNone className="text-2xl text-gray-600 cursor-pointer hover:text-blue-500" />
          {/* Red dot for unread notification */}
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
        </div>
        <div className="h-6 w-px bg-gray-400"></div> {/* Vertical bar */}
        <div className="flex items-center space-x-2">
          <div className="flex flex-col items-end"> {/* Stack vertically, align items to end (right) */}
            <span className="font-medium text-gray-700">Asif Riaj</span>
            <span className="text-sm text-gray-500">HR</span>
          </div>
          <MdAccountCircle className="text-5xl text-gray-600" />
        </div>
      </div>
    </header>
  );
}
