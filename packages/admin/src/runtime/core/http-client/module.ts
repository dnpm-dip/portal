import type { IHTTPClient } from '@dnpm-dip/http-kit';
import type { ConnectionReport } from '../../domains/connection-report';

export class AdminHTTPClient {
    protected client: IHTTPClient;

    constructor(client: IHTTPClient) {
        this.client = client;
    }

    async getConnectionReport() : Promise<ConnectionReport> {
        const response = await this.client.get('admin/connection-report');
        return response.data;
    }
}
