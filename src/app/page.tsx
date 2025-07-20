"use client";

import { useEffect, useState } from "react";
import TableRow from "./components/TableRow";
import { Advocate } from "@/types/advocate";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const fetchAdvocates = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/advocates?page=${currentPage}&search=${debouncedSearchTerm}`);
        
        if (!response.ok) {
          throw new Error(`status: ${response.status}`);
        }
        
        const jsonResponse = await response.json();
        setAdvocates(jsonResponse.data);
        setPagination(jsonResponse.pagination);
      } catch (err) {
        console.error("Error fetching advocates:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch advocates");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdvocates();
  }, [currentPage, debouncedSearchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value.toLowerCase();
    setSearchTerm(newSearchTerm);
  };

  const filteredAdvocates = advocates;

  const onClick = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const renderPaginationControls = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (pagination.hasPrev) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-1 rounded-md bg-white text-black border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#274239] focus:ring-opacity-50"
        >
          Previous
        </button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
            i === currentPage 
              ? 'bg-[#274239] text-white focus:ring-white' 
              : 'bg-white text-black border border-gray-300 hover:bg-gray-50 focus:ring-[#274239]'
          }`}
        >
          {i}
        </button>
      );
    }

    if (pagination.hasNext) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-1 rounded-md bg-white text-black border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-[#274239] focus:ring-opacity-50"
        >
          Next
        </button>
      );
    }

    return pages;
  };

  const renderTable = () => {
    if (isLoading) {
      return (
          <div className="flex justify-center items-center h-40 text-lg">
            Loading advocates...
          </div>
      );
    }
    if (error) {
      return (
          <div className="text-[#274239] p-4 border w-1/2 border-[#274239] rounded-md m-4 flex flex-col items-center">
            <h3>Error loading advocates</h3>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 mt-3 bg-[#274239] text-white rounded-md cursor-pointer hover:bg-[#1a2d26] focus:ring-2 focus:ring-[#274239] focus:ring-opacity-50"
            >
              Try Again
            </button>
          </div>
      );
    }
    return (
      <div className="m-4 flex flex-col items-center">
        <form>
          <input 
            type="search"
            placeholder="Search advocates..."
            value={searchTerm}
            onChange={onChange} 
            className="border-b border-t-0 border-l-0 border-r-0 border-black mr-4 focus:outline-none focus:border-[#274239] focus:border-b-2 transition-all px-2 py-1"
          />
          <button 
            type="button"
            className="text-sm text-white bg-[#274239] rounded-md px-2 py-1 border border-[#274239] hover:bg-[#1a2d26] focus:ring-2 focus:ring-[#274239] focus:ring-opacity-50" 
            onClick={onClick}
          >
            Reset Search
          </button>
        </form>
        <br />
        <br />
        {filteredAdvocates.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            No advocates found matching your search criteria.
          </div>
        ) : (
          <>
            <table className="table-auto border-collapse border border-gray-300 table-bordered">
              <thead className="bg-[#274239] text-white">
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>City</th>
                  <th>Degree</th>
                  <th>Specialties</th>
                  <th>Years of Experience</th>
                  <th>Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdvocates.map((advocate, index) => (
                  <TableRow key={index} advocate={advocate} />
                ))}
              </tbody>
            </table>
            
            <div className="flex justify-center items-center py-4 gap-4">
              <div className="text-sm text-[#666]">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total records)
              </div>
              <div className="flex items-center">
                {renderPaginationControls()}
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <main className="flex flex-col items-center">
      <h1 className="text-2xl font-bold text-white py-4 mb-[2em] flex justify-center items-center bg-[#274239] w-full h-[100px]">
        Solace Advocates
      </h1>
      {renderTable()}
    </main>
    );
}
