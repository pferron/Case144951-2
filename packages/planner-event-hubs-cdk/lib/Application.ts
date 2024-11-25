import { InfraApp } from '@cvent/cdk-applications/apps';
import type { InfrastructureProps } from '@cvent/cdk-applications/types';

export class Application extends InfraApp {
  constructor(infrastructure: InfrastructureProps) {
    super(infrastructure);
    if (this.hasEdgeStack()) {
      this.edgeStack.useAdditionalDomainAsPrimary(infrastructure);
    }
  }
}
