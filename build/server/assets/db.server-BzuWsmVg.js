import { PrismaClient } from "@prisma/client";
//#region app/db.server.js
if (process.env.NODE_ENV !== "production") {
	if (!global.prismaGlobal) global.prismaGlobal = new PrismaClient();
}
var prisma = global.prismaGlobal ?? new PrismaClient();
//#endregion
export { prisma as t };
