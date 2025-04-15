// Check if required environment variables are set
const requiredEnvVars = [
  'NEXT_PUBLIC_TMDB_API_KEY',
  'NEXT_PUBLIC_OMDB_API_KEY'
];

let missingVars = [];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    missingVars.push(envVar);
  }
}

if (missingVars.length > 0) {
  console.error('\x1b[31m%s\x1b[0m', 'Error: The following environment variables are required but missing:');
  missingVars.forEach(variable => {
    console.error(`  - ${variable}`);
  });
  console.error('\nPlease add them to your .env.local file or environment.');
  console.error('Example .env.local:');
  console.error('NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key');
  console.error('NEXT_PUBLIC_OMDB_API_KEY=your_omdb_api_key\n');
  process.exit(1);
}

console.log('\x1b[32m%s\x1b[0m', '✅ All required environment variables are set. Proceeding with build...'); 