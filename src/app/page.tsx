import { PrismaClient } from "@prisma/client";
// import Link from "next/link";
const prisma = new PrismaClient();
import Homepage from "@/components/Homepage";

export default async function Home() {
  return (
    <div className="">
      <Homepage />
    </div>
  );
}
