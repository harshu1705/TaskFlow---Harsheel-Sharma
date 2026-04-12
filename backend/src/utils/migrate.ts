import fs from 'fs';
import path from 'path';
import { pool } from './db';

const MIGRATIONS_DIR = path.join(__dirname, '../../migrations');

async function runMigrations() {
    console.log('🔄 Starting Database Migration & Seeding Pipeline...');
    try {
        // 1. Ensure migrations tracking table exists
        await pool.query(`
            CREATE TABLE IF NOT EXISTS schema_migrations (
                id SERIAL PRIMARY KEY,
                version VARCHAR(255) UNIQUE NOT NULL,
                applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 2. Read all files in migrations directory
        const files = fs.readdirSync(MIGRATIONS_DIR).sort();
        const sqlFiles = files.filter(f => f.endsWith('.sql'));

        for (const file of sqlFiles) {
            // Only run up/seed scripts 
            if (file.includes('_down')) continue;

            const { rows } = await pool.query('SELECT version FROM schema_migrations WHERE version = $1', [file]);
            
            if (rows.length === 0) {
                console.log(`📦 Applying migration: ${file}...`);
                const filePath = path.join(MIGRATIONS_DIR, file);
                const sql = fs.readFileSync(filePath, 'utf8');

                try {
                    await pool.query('BEGIN');
                    await pool.query(sql);
                    await pool.query('INSERT INTO schema_migrations (version) VALUES ($1)', [file]);
                    await pool.query('COMMIT');
                    console.log(`✅ Successfully applied: ${file}`);
                } catch (err) {
                    await pool.query('ROLLBACK');
                    console.error(`❌ Migration failed at ${file}:`, err);
                    process.exit(1);
                }
            } else {
                console.log(`⏭️  Skipping previously applied migration: ${file}`);
            }
        }
        console.log('🎉 All Database migrations applied successfully!');
        process.exit(0);
    } catch (error) {
        console.error('💥 Fatal error during migrations:', error);
        process.exit(1);
    }
}

runMigrations();
