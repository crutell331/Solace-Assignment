import db from "../../../db";
import { advocates } from "../../../db/schema";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  console.log('searchParams: ', searchParams);
  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const offset = (page - 1) * 5;

  const allData = await db.select().from(advocates);
  
  let filteredData = allData;
  if (search) {
    const searchLower = search.toLowerCase();
    filteredData = allData.filter((advocate) => {
      return (
        advocate.firstName.toLowerCase().includes(searchLower) ||
        advocate.lastName.toLowerCase().includes(searchLower) ||
        advocate.city.toLowerCase().includes(searchLower) ||
        advocate.degree.toLowerCase().includes(searchLower) ||
        advocate.yearsOfExperience.toString().includes(searchLower) ||
        (advocate.specialties as string[]).some((specialty: string) => 
          specialty.toLowerCase().includes(searchLower)
        )
      );
    });
  }
  
  const data = filteredData.slice(offset, offset + 5);
  const total = filteredData.length;

  return Response.json({ 
    data,
    pagination: {
      page: page,
      limit: 5,
      total,
      totalPages: Math.ceil(total / 5),
      hasNext: page < Math.ceil(total / 5),
      hasPrev: page > 1
    }
  });
}
