import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-blue-500">404</h1>
      <p className="mt-4 text-xl text-gray-700">Page Not Found</p>
      <Link
        to="/"
        className="mt-6 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
