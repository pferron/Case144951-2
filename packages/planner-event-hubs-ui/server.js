(async function startServer() {
  const nextConfig = (await import('./next.config.mjs')).default;
  const { start } = await import('@cvent/nextjs/server');
  start(await nextConfig());
})();
