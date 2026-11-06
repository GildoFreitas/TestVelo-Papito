import { Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'
import type { Database } from './schema'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
    throw new Error('DATABASE_URL não definida. Configure-a no arquivo .env (veja .env.example).')
}

export const db = new Kysely<Database>({
    dialect: new PostgresDialect({
        pool: new Pool({
            connectionString,
            ssl: { rejectUnauthorized: false },
            max: 2,
        }),
    }),
})

export async function closeDb(): Promise<void> {
    await db.destroy()
}
