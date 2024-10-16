import React from 'react';

const HeaderWithSearch = () => {
  return (
    <div className="flex items-center justify-between bg-white p-4 shadow-md">
      {/* Search bar */}
      <div className="w-full max-w-lg">
        <input
          type="text"
          className="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500"
          placeholder="Type a command or search..."
        />
      </div>

      {/* Buttons */}
      <div className="flex space-x-4">
        <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 focus:outline-none">
          Rent & Sell
        </button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none">
          + New Customer
        </button>
      </div>
    </div>
  );
};

export default HeaderWithSearch;
