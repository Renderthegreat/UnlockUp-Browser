npm run dev:$1;

echo 'Running...';

export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true;
export PUPPETEER_EXECUTABLE_PATH=`which chromium`;
node dist/server/index.js;