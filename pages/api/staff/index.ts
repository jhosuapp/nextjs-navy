import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/config/lib/prisma"
import { withRateLimit } from "@/config/lib/rateLimit";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    try {
        const staff = await prisma.staff.findMany({
            orderBy: {
              staff_role_weight: 'desc',
            },
        });
        
        // Agrupar por staff_role_name
        const groupedStaff = staff.reduce((acc, member) => {
        const roleName = member.staff_role_name;
        
        if (!acc[roleName]) {
            acc[roleName] = {
                role_name: roleName,
                role_colour: member.staff_role_colour,
                role_id: member.staff_role_id,
                role_weight: member.staff_role_weight,
                members: []
            };
        }
        
        acc[roleName].members.push(member);
        
        return acc;
        }, {} as Record<string, any>);
        
        // Convertir objeto a array
        const result = Object.values(groupedStaff);
        
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo staff" });
    }
}

export default withRateLimit(handler)