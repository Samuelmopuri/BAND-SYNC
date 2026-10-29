import ngrok from '@ngrok/ngrok';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server/.env or root .env
dotenv.config({ path: path.resolve(__dirname, 'server/.env') });
dotenv.config();

const authtoken = process.env.NGROK_AUTHTOKEN || process.argv[2];

if (!authtoken) {
  console.log('\n======================================================');
  console.log('⚠️  NGROK AUTHTOKEN NEEDED');
  console.log('======================================================');
  console.log('👉 1. Get your free token: https://dashboard.ngrok.com/get-started/your-authtoken');
  console.log('👉 2. Run: npm run ngrok -- YOUR_TOKEN_HERE');
  console.log('======================================================\n');
  process.exit(1);
}

// Auto-save authtoken to .env files so user doesn't have to pass it next time
try {
  const envPath = path.resolve(__dirname, 'server/.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (!envContent.includes('NGROK_AUTHTOKEN')) {
    fs.appendFileSync(envPath, `\nNGROK_AUTHTOKEN=${authtoken.trim()}\n`);
    fs.appendFileSync(path.resolve(__dirname, '.env'), `\nNGROK_AUTHTOKEN=${authtoken.trim()}\n`);
  }
} catch (e) {
  // Ignore silent error
}

async function start() {
  try {
    const listener = await ngrok.forward({
      addr: 5173,
      authtoken: authtoken.trim(),
    });

    console.log('\n======================================================');
    console.log('🎵 Music Band Collaboration Portal');
    console.log('🚀 Ngrok Public Tunnel is LIVE and ONLINE!');
    console.log(`🌐 Public URL: ${listener.url()}`);
    console.log('📱 Works on Mobile, Laptop, and Tablets anywhere!');
    console.log('⚠️  IMPORTANT: Keep this PowerShell window open to keep the link online.');
    console.log('======================================================\n');

    // Keep process alive indefinitely until user presses Ctrl+C
    const keepAlive = setInterval(() => {}, 1000 * 60 * 60);

    process.on('SIGINT', async () => {
      console.log('\nStopping Ngrok tunnel...');
      clearInterval(keepAlive);
      process.exit(0);
    });
  } catch (error) {
    console.error('\n❌ Ngrok error:', error.message);
  }
}

start();
