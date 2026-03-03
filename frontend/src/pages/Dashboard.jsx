import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const Dashboard = () => {
  const attendanceChartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const ctx = attendanceChartRef.current;

    if (ctx) {
      // Destroy previous chart instance if exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      chartInstanceRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: "Attendance",
              data: [8, 7, 6, 8, 7, 5, 8],
              fill: false,
              borderColor: "#6366F1", // Indigo
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
        },
      });
    }

    // Cleanup on unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <main className="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card title="Total Employee" value="47" change="↗ +2.1%" icon="users" color="blue" />
        <Card title="Total Applicant" value="32" change="↗ 15%" icon="user-check" color="green" />
        <Card title="Total Attendance" value="8" change="↗ 1%" icon="calendar-x" color="orange" />
        <Card title="Total Absent" value="12" change="↗ 2%" icon="moon" color="purple" />
      </div>

      {/* Attendance Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Weekly Attendance</h3>
            <select className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent font-body focus:outline-none">
              <option>This Week</option>
              <option>Last Week</option>
              <option>This Month</option>
            </select>
          </div>
          <canvas ref={attendanceChartRef} className="w-full h-20"></canvas>
        </div>

        {/* Schedule / Calendar */}
        <div className="col-span-1 md:col-span-1 lg:col-span-1 bg-white dark:bg-gray-800 p-5 rounded-xl shadow w-full">
          <h3 className="font-semibold mb-4 text-xl">My Schedule</h3>
          <div className="flex items-center justify-between mb-2">
            <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">‹</button>
            <h4 className="font-semibold">June 2024</h4>
            <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">›</button>
          </div>
          <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
            <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
          </div>
          <div id="calendarDays" className="grid grid-cols-7 gap-1 text-center mb-4"></div>
          <div className="border-t border-gray-200 dark:border-gray-700 flex justify-between pt-3">
            <p className="text-sm text-gray-500 my-2">Wednesday, 06 June 2024</p>
            <button className="px-6 py-2 bg-purple-600 hover:bg-purple-800 text-white rounded-lg transition-colors">
              Show Event
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-premium border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-xl font-display font-semibold text-gray-800 dark:text-white">Attendance</h3>
          <select className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm font-body bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none">
            <option value="Today">Today</option>
            <option value="Tomorrow">Tomorrow</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left p-4 font-medium text-gray-700 dark:text-gray-300 font-body">Employee Name</th>
                <th className="text-left p-4 font-medium text-gray-700 dark:text-gray-300 font-body">Designation</th>
                <th className="text-left p-4 font-medium text-gray-700 dark:text-gray-300 font-body">Type</th>
                <th className="text-left p-4 font-medium text-gray-700 dark:text-gray-300 font-body">Check In Time</th>
                <th className="text-left p-4 font-medium text-gray-700 dark:text-gray-300 font-body">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <AttendanceRow name="Leasie Watson" avatar="https://i.pravatar.cc/40?img=1" designation="Team Lead - Design" type="Office" time="10:15 AM" status="Late" color="red"/>
              <AttendanceRow name="Leasie Watson" avatar="https://i.pravatar.cc/40?img=1" designation="Team Lead - Design" type="Office" time="10:15 AM" status="On Time" color="green"/>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

// Reusable Components (unchanged)
const Card = ({ title, value, change, icon, color }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover-lift`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{value}</p>
        <p className={`text-${color}-600 dark:text-${color}-400 text-sm mt-2`}>{change}</p>
      </div>
      <div className={`w-12 h-12 bg-${color}-100 dark:bg-${color}-900/30 rounded-xl flex items-center justify-center`}>
        <i data-lucide={icon} className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`}></i>
      </div>
    </div>
  </div>
);

const AttendanceRow = ({ name, avatar, designation, type, time, status, color }) => (
  <tr className="invoice-row hover:bg-gray-50 dark:hover:bg-gray-700">
    <td className="p-4 flex items-center space-x-2 font-medium text-gray-800 dark:text-white font-body">
      <img src={avatar} className="w-8 h-8 rounded-full" />
      <span>{name}</span>
    </td>
    <td className="p-4 text-gray-600 dark:text-gray-400 font-body">{designation}</td>
    <td className="p-4 text-gray-600 dark:text-white font-display">{type}</td>
    <td className="p-4 text-gray-600 dark:text-gray-400 font-body">{time}</td>
    <td><span className={`px-2 py-1 bg-${color}-100 text-${color}-600 rounded text-xs`}>{status}</span></td>
  </tr>
);

export default Dashboard;