"use client";

import { Advocate } from "@/types/advocate";

export default function TableRow({ advocate }: { advocate: Advocate }) {
    const {firstName, lastName, city, degree, specialties, yearsOfExperience, phoneNumber} = advocate;
    return(
        <tr>
            <td>{firstName}</td>
            <td>{lastName}</td>
            <td>{city}</td>
            <td>{degree}</td>
            <td>
                <ul>
                    {specialties.map((s) => (
                        <li key={s}>{s}</li>
                    ))}
                </ul>
            </td>
            <td>{yearsOfExperience}</td>
            <td>{phoneNumber}</td>
        </tr>
    )
}