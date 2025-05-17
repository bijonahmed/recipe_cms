//This Global Pagination
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Pagination = ({ totalPages, apiUrl, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1); // Set initial page to 1
  const [loading, setLoading] = useState(false); // To track if the API request is loading
  const [data, setData] = useState([]); // Store data from API


  // Fetch data for the current page
  const fetchData = async (page) => {
    setLoading(true);
    try {
      // Use the dynamic API URL passed as a prop
      const response = await axios.get(`${apiUrl}?page=${page}`);
      setData(response.data.data); // Assuming the API returns the data in the 'data' property
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle page change when a user clicks a page number
  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      onPageChange(page); // Trigger the parent component's callback
      fetchData(page); // Fetch new data based on the selected page
    }
  };


  // Helper function to render pagination buttons
  const renderPagination = () => {
    const pages = [];
    const maxPagesToShow = 3; // Set how many page numbers to show at once

    if (totalPages <= maxPagesToShow) {
      // If the total pages are less than or equal to max pages to show, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            className={`btn btn-sm ${i === currentPage ? 'btn-primary' : 'btn-light'} mt-2`}
            onClick={() => handlePageChange(i)}
            disabled={i === currentPage} // Disable button if it's the current page
          >
            {i}
          </button>
        );
      }
    } else {
      // Show the first page, last page, and a range of pages around the current page
      pages.push(
        <button
          key={1}
          className={`btn btn-sm ${1 === currentPage ? 'btn-primary' : 'btn-light'} mt-2`}
          onClick={() => handlePageChange(1)}
          disabled={1 === currentPage}
        >
          1
        </button>
      );

      if (currentPage > maxPagesToShow + 1) {
        pages.push(
          <button key="ellipsis-start" className="btn btn-sm btn-light mt-2" disabled>
            ...
          </button>
        );
      }

      const startPage = Math.max(currentPage - maxPagesToShow, 2);
      const endPage = Math.min(currentPage + maxPagesToShow, totalPages - 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <button
            key={i}
            className={`btn btn-sm ${i === currentPage ? 'btn-primary' : 'btn-light'} mt-2`}
            onClick={() => handlePageChange(i)}
            disabled={i === currentPage}
          >
            {i}
          </button>
        );
      }

      if (currentPage < totalPages - maxPagesToShow) {
        pages.push(
          <button key="ellipsis-end" className="btn btn-sm btn-light mt-2" disabled>
            ...
          </button>
        );
      }

      pages.push(
        <button
          key={totalPages}
          className={`btn btn-sm ${totalPages === currentPage ? 'btn-primary' : 'btn-light'} mt-2`}
          onClick={() => handlePageChange(totalPages)}
          disabled={totalPages === currentPage}
        >
          {totalPages}
        </button>
      );
    }
    return pages;
  };

  useEffect(() => {
    // Initial data fetch when the component mounts
    fetchData(currentPage);
  }, []); // Empty array ensures this runs only once when the component mounts

  return (
    <div>
    
      <div className="d-flex justify-content-center mt-3 gap-1">
        {renderPagination()}
      </div>
    </div>
  );
};

export default Pagination;
