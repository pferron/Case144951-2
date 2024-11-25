import { authOptions, connectToApiAsPlanner } from '@helpers/connectToApiAsPlanner';
import { getAccountSnapshot, getCodeSnippets } from '@helpers/snapshotFunctions';
import { skipDescribeIfProdEnvironment } from '@utils/commonUtils';

let client = null;

beforeAll(async () => {
  client = await connectToApiAsPlanner(authOptions);
}, 10000);

// For negative test scenarios
skipDescribeIfProdEnvironment()('Snapshots GQL IT: should return exception', () => {
  it('should return not found for an account id', async () => {
    const options = { ...authOptions };
    options.authorization.metadata.AccountId = 12345;
    const clientWithArbitaryAccounId = await connectToApiAsPlanner(options);
    await expect(async () => getCodeSnippets(clientWithArbitaryAccounId)).rejects.toThrow('Not Found');
  });
});

describe('Snapshots GQL IT: should return data', () => {
  it('should return snapshot for a account id', async () => {
    const snapshot = await getCodeSnippets(client);
    // sufficient to test that a response is returned. Account may or may not have code snippets configured
    expect(snapshot).toBeTruthy();
  });

  it('Should return account snapshot', async () => {
    const accountSnapshot = await getAccountSnapshot(client);
    // sufficient to test that a response is returned. Account may or may not have other things configured
    expect(accountSnapshot).toBeTruthy();
    expect(accountSnapshot.id).toBeTruthy();
    expect(accountSnapshot.name).toBeTruthy();
    expect(accountSnapshot.accountStub).toBeTruthy();
  });
});

skipDescribeIfProdEnvironment()('Should return custom fonts in account snapshot when configured', () => {
  it('Should return custom fonts', async () => {
    const accountSnapshot = await getAccountSnapshot(client);
    expect(accountSnapshot).toBeTruthy();
    expect(accountSnapshot.customFonts).toBeTruthy();
    expect(accountSnapshot.customFonts?.length).toBeGreaterThanOrEqual(1);
    expect(accountSnapshot.customFonts[0]?.id).toBeTruthy();
    expect(accountSnapshot.customFonts[0]?.fontFamily).toBeTruthy();
    expect(accountSnapshot.customFonts[0]?.fallbackFontId).toBeTruthy();
  });
});
