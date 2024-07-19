import { CoopCoordinatorSearch } from "../../types/custom";
import prisma from "../../utils/client";
import { CoopCoordinator } from "@prisma/client";


class CoorSearchAction {
    static async execute(page: number, pageSize: number, searchQuery: string, coopId: number) {
        const skip = (page - 1) * pageSize;
        const [coors, total] = await Promise.all([
            prisma.coopCoordinator.findMany({
                where: {
                    OR: [
                        { first_name: { contains: searchQuery, mode: 'insensitive' } },
                        { middle_name: { contains: searchQuery, mode: 'insensitive' } },
                        { last_name: { contains: searchQuery, mode: 'insensitive' } },
                        { email: { contains: searchQuery, mode: 'insensitive' } },
                        { contact_number: { contains: searchQuery, mode: 'insensitive' } },
                        { address: { contains: searchQuery, mode: 'insensitive' } },
                    ],
                    deleted_at: null,
                    coop_id: coopId
                },
                skip,
                take: pageSize,
            }),
            prisma.coopCoordinator.count({
                where: {
                    OR: [
                        { first_name: { contains: searchQuery, mode: 'insensitive' } },
                        { middle_name: { contains: searchQuery, mode: 'insensitive' } },
                        { last_name: { contains: searchQuery, mode: 'insensitive' } },
                        { email: { contains: searchQuery, mode: 'insensitive' } },
                        { contact_number: { contains: searchQuery, mode: 'insensitive' } },
                        { address: { contains: searchQuery, mode: 'insensitive' } },
                    ],
                    deleted_at: null,
                    coop_id: coopId
                },
            })
        ])
        return { coors, total }
    }
}

export default CoorSearchAction;