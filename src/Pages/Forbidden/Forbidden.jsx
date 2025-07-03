import React from 'react';
import { Link } from 'react-router';
import { MdLockOutline } from "react-icons/md";

const Forbidden = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-50 px-4">
      <MdLockOutline className="text-6xl text-red-500 mb-4" />
      <h1 className="text-4xl font-bold text-red-600 mb-2">403 - Forbidden</h1>
      <p className="text-gray-600 mb-6">
        You do not have permission to access this page.
      </p>
      <Link
        to="/"
        className="btn btn-primary"
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default Forbidden;
