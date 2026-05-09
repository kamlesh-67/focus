import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL!;

const sql = postgres(connectionString, {
  prepare: false, // Required for Supabase / connection pooling
});

export default sql;
