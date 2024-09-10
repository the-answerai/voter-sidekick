import { PrismaClient } from "@prisma/client";
import Link from "next/link";
const prisma = new PrismaClient();
import Homepage from "@/components/Homepage";

export default async function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Homepage />
    </div>
  );
}
