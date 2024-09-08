const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
    try {
        // Read the SQL migration file
        const sqlPath = path.join(__dirname, 'prisma', 'migrations', '0001_initial_schema.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Split the SQL into individual commands
        const commands = sql.split(';').filter(command => command.trim() !== '');

        // Execute each command separately
        for (const command of commands) {
            await prisma.$executeRawUnsafe(command + ';');
        }

        console.log('Database schema created successfully');
    } catch (error) {
        console.error('Error creating database schema:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();