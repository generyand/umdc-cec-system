import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const navigate = useNavigate();

  // Auto-redirect after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="px-4 mx-auto max-w-lg text-center">
        {/* Animated 404 */}
        <h1 className="text-9xl font-bold text-gray-800 animate-bounce dark:text-gray-100">
          404
        </h1>

        <h2 className="mt-4 text-4xl font-semibold text-gray-600 dark:text-gray-300">
          Oops! Page Not Found
        </h2>

        <p className="mt-4 mb-8 text-gray-500 dark:text-gray-400">
          The page you're looking for doesn't exist or has been moved. You'll be
          automatically redirected to the homepage in 10 seconds.
        </p>

        <div className="space-y-4">
          {/* Primary action */}
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-indigo-600 rounded-md shadow-md transition-all duration-200 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 hover:scale-105 hover:shadow-lg"
          >
            Return Home
          </Link>

          {/* Secondary action */}
          {/* <button
            onClick={() => navigate(-1)}
            className="block mt-2 w-full text-indigo-600 transition-colors duration-200 hover:text-indigo-800"
          >
            ← Go Back
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
