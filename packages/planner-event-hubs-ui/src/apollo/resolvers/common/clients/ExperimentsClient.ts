import { ExperimentClient } from '@cvent/experiment-client/ExperimentClient';
import { ExperimentVariant } from '@cvent/experiment-client/dist/esm/types';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';

const LOG = LoggerFactory.create('clients/ExperimentsClient');
interface Metadata {
  version: number;
}

export class ExperimentsClient {
  private readonly client: Promise<ExperimentClient>;

  baseUrl: string;

  constructor(baseUrl: string, environment: string) {
    this.baseUrl = baseUrl;
    this.client = ExperimentClient.getClient(this.baseUrl, environment);
  }

  /**
   * The method returns the experiment variant based on the following logic:
   * @param experimentName
   * @param accountNumber
   */
  public async getExperimentVariant(experimentName: string, accountNumber: string): Promise<number> {
    try {
      // Get the singleton instance of the ExperimentClient
      const experimentClient = await this.client;

      // Get an experiment variant specific to a hash
      const experimentVariant: ExperimentVariant = await experimentClient.getExperimentVariant(
        experimentName,
        accountNumber
      );

      if (experimentVariant) {
        const metadata = experimentVariant.metadata as Metadata;
        return (metadata && metadata.version) || experimentVariant.id;
      }
    } catch (error) {
      LOG.warn(error);
    }
    return 0;
  }
}

const experimentsClient = new ExperimentsClient(process.env.EXPERIMENT_SERVICE_URL, process.env.EXPERIMENT_ENVIRONMENT);

export default experimentsClient;
