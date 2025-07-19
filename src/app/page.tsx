"use client";

import { useEffect, useState, useMemo } from "react";
import TableRow from "./components/TableRow";
import { Advocate } from "@/types/advocate";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdvocates = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch("/api/advocates?page=1");
        
        if (!response.ok) {
          throw new Error(`status: ${response.status}`);
        }
        
        const jsonResponse = await response.json();
        setAdvocates(jsonResponse.data);
      } catch (err) {
        console.error("Error fetching advocates:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch advocates");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdvocates();
  }, []);

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

  if (isLoading) {
    return (
      <main style={{ margin: "24px" }}>
        <h1>Solace Advocates</h1>
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          height: "200px",
          fontSize: "18px"
        }}>
          Loading advocates...
        </div>
      </main>
    );
  }
  if (error) {
    return (
      <main style={{ margin: "24px" }}>
        <h1>Solace Advocates</h1>
        <div style={{ 
          color: "red", 
          padding: "20px", 
          border: "1px solid red", 
          borderRadius: "4px",
          margin: "20px 0"
        }}>
          <h3>Error loading advocates:</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ 
              padding: "8px 16px", 
              backgroundColor: "#007bff", 
              color: "white", 
              border: "none", 
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }
console.log('searchTerm: ', searchTerm);
  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <form>
        <p>Search</p>
        <input 
          type="search"
          placeholder="Search advocates..."
          style={{ border: "1px solid black" }} 
          value={searchTerm}
          onChange={onChange} 
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
      )}
    </main>
  );
}
