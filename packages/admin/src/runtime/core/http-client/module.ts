import type { HTTPClient } from '@dnpm-dip/core';
import type { ConnectionReport } from '../../domains/connection-report';

export class AdminHTTPClient {
    protected client: HTTPClient;

    constructor(client: HTTPClient) {
        this.client = client;
    }

    async getConnectionReport() : Promise<ConnectionReport> {
        const response = await this.client.get('admin/connection-report');
        return response.data;
    }
}
