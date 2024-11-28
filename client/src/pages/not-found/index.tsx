import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="px-4 text-center">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <h2 className="mt-4 text-4xl font-semibold text-gray-600">
          Page Not Found
        </h2>
        <p className="mt-4 mb-8 text-gray-500">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-indigo-600 rounded-md transition-colors duration-200 hover:bg-indigo-700"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
