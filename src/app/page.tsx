"use client";

import { useEffect, useState } from "react";
import TableRow from "./components/TableRow";

type Advocate = {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: string;
}

export default function Home() {
  const [advocates, setAdvocates] = useState([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState([]);

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();

    console.log("filtering advocates...", searchTerm);
    const filteredAdvocates = advocates.filter((advocate: Advocate) => {
      console.log(advocate.yearsOfExperience.toString().includes(searchTerm));
      return (
        advocate.firstName.toLowerCase().includes(searchTerm) ||
        advocate.lastName.toLowerCase().includes(searchTerm) ||
        advocate.city.toLowerCase().includes(searchTerm) ||
        advocate.degree.toLowerCase().includes(searchTerm) ||
        advocate.yearsOfExperience.toString().includes(searchTerm) ||
        advocate.specialties.some((specialty) => specialty.toLowerCase().includes(searchTerm))
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    setFilteredAdvocates(advocates);
  };

  const onClick = () => {
    console.log(advocates);
    setFilteredAdvocates(advocates);
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <form onSubmit={onSubmit}>
        <p>Search</p>
        <input 
          type="search"
          placeholder="Search advocates..."
          style={{ border: "1px solid black" }} 
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
