describe('env vars validation', () => {
  it('should validate that the env vars are loaded', async () => {
    expect(process.env.APP_BASE_URL).toBeTruthy();
  });
});
