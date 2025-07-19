"use client";

import { useEffect, useState, useMemo } from "react";
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

  useEffect(() => {
    const fetchAdvocates = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/advocates?page=${currentPage}`);
        
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
  }, [currentPage]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value.toLowerCase();
    setSearchTerm(newSearchTerm);
  };

  const filteredAdvocates = useMemo(() => {
    if (!searchTerm) return advocates;
    
    return advocates.filter((advocate: Advocate) => {
      return (
        advocate.firstName.toLowerCase().includes(searchTerm) ||
        advocate.lastName.toLowerCase().includes(searchTerm) ||
        advocate.city.toLowerCase().includes(searchTerm) ||
        advocate.degree.toLowerCase().includes(searchTerm) ||
        advocate.yearsOfExperience.toString().includes(searchTerm) ||
        advocate.specialties.some((specialty) => specialty.toLowerCase().includes(searchTerm))
      );
    });
  }, [advocates, searchTerm]);

  const onClick = () => {
    setSearchTerm("");
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
          className="px-3 py-1 rounded-md bg-white text-black border border-gray-300"
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
          className={`px-3 py-1 rounded-md ${i === currentPage ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
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
          className="px-3 py-1 rounded-md bg-white text-black border border-gray-300"
        >
          Next
        </button>
      );
    }

    return pages;
  };

  if (isLoading) {
    return (
      <main className="m-4">
        <h1>Solace Advocates</h1>
        <div className="flex justify-center items-center h-40 text-lg">
          Loading advocates...
        </div>
      </main>
    );
  }
  if (error) {
    return (
      <main className="m-4">
        <h1>Solace Advocates</h1>
        <div className="text-red-500 p-4 border border-red-500 rounded-md m-4">
          <h3>Error loading advocates:</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="m-4">
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <form>
        <input 
          type="search"
          placeholder="Search advocates..."
          value={searchTerm}
          onChange={onChange} 
          className="border-b border-t-0 border-l-0 border-r-0 border-black mr-4"
        />
        <button type="button" onClick={onClick}>Reset Search</button>
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
          <thead>
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
            <div style={{ fontSize: "14px", color: "#666" }}>
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total records)
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              {renderPaginationControls()}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
