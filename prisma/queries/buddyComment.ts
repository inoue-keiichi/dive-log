import { prisma } from "@/clients/prisma";

export async function count(diveLogId: number) {
  return await prisma.$queryRaw<{ count: bigint }[]>`
select
	count(*)
from
	buddy_comments bc
left join buddies b
      	on
	b.id = bc.buddy_id
where
	b.dive_log_id = ${diveLogId}
  `;
}
