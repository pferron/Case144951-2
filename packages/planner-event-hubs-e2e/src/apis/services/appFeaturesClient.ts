import fs from 'fs';
import logger from '@wdio/logger';
import baseAppFeatures from '../../appFeatures';
import { getAppFeatures } from '../../getAppFeatures';

const LOG = logger('appFeaturesClient');
const filepath = 'appFeatures.json';
const encoding = 'utf8';

export const writeAppFeatures = async (): Promise<void> => {
  const { getAuthOptions, connectToApiAsPlanner } = await import('../../utils/authUtils');
  const options = await getAuthOptions();
  LOG.trace('Start: writeAppFeatures() with planner options', options);
  const client = await connectToApiAsPlanner(options);
  const appFeatures = await getAppFeatures(client, baseAppFeatures);
  const baseKeys = Object.keys(baseAppFeatures);
  const receivedKeys = Object.keys(appFeatures);
  if (baseKeys.length !== receivedKeys.length) {
    LOG.error(
      'CATASTROPHIC FAILURE - Received appFeatures does not have same number of entries as baseAppFeatures, Tests may not pass'
    );
  }
  fs.writeFileSync(filepath, JSON.stringify(appFeatures, null, '\t'), {
    encoding
  });
  LOG.debug(`Wrote app features to ${filepath}`);
};

export const readAppFeatures = (): Record<string, unknown> => {
  try {
    const data = fs.readFileSync(filepath, { encoding });
    const appFeatureArray = JSON.parse(data);
    const appFeatures = {};
    appFeatureArray.forEach(element => {
      appFeatures[element.name] = element.enabled;
    });
    return appFeatures;
  } catch (error) {
    // File hasn't been written yet, this is fine during initialization
    return {};
  }
};
