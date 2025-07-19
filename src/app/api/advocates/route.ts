import db from "../../../db";
import { advocates } from "../../../db/schema";
// import { advocateData } from "../../../db/seed/advocates";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  console.log('searchParams: ', searchParams);
  const page = parseInt(searchParams.get('page') || '1');
  const offset = (page - 1) * 5;

  const allData = await db.select().from(advocates);
  
  const data = allData.slice(offset, offset + 5);
  const total = allData.length;

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
