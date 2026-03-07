import { Link } from 'react-router-dom';

export default function GuestDashboard() {
  return (
    <div className="max-w-2xl mx-auto py-16 px-6 text-center">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Welcome! 🎉
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Your account is pending role assignment by an administrator. 
        Once approved, you'll gain access to your personalized dashboard.
      </p>
      
      <div className="space-y-4">
        <Link 
          to="/"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white 
                   px-6 py-3 rounded-lg font-medium transition"
        >
          Browse Courses
        </Link>
        
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Questions? Contact support@yourplatform.com
        </p>
      </div>
    </div>
  );
}