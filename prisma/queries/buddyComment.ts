import { prisma } from "@/clients/prisma";

export async function count(diveLogId: number): Promise<number> {
  return await prisma.$queryRaw`
select
	count(*)
from
	buddy_comments bc
left join buddies b
      	on
	b.id = bc.buddy_id
where
	b.id = ${diveLogId}
  `;
}
