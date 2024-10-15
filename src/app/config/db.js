import {Pool} from "pg"
const db = new Pool({
  connectionString: "postgresql://postgres.suqwsvjvaydqjknjppcs:Abdulrehman344@aws-0-ap-south-1.pooler.supabase.com:6543/postgres",
  ssl: {
    rejectUnauthorized: false, 
  },
});

export default db;