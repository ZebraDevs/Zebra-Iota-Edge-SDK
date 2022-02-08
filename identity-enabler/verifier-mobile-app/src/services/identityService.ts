import * as IotaIdentity from "@iota/identity-wasm/web";
import { IDENTITY_WASM_PATH } from "../config";
import type { IdentityConfig } from "../models/types/identity";

const { Client, Config, Network } = IotaIdentity;

export class IdentityService {
    private client?: IotaIdentity.Client;

    private readonly config: IdentityConfig;

    constructor(config: IdentityConfig) {
        this.config = config;
    }

    /**
     * Get existing or create the IOTA Identity client.
     *
     * @returns The client.
     */
    public getClient(): IotaIdentity.Client {
        // Client singleton
        if (!this.client) {
            const cfg = Config.fromNetwork(Network.try_from_name(this.config.network));
            cfg.setNode(this.config.node);
            if (this.config.permanode) {
                cfg.setPermanode(this.config.permanode);
            }
            this.client = Client.fromConfig(cfg);
        }

        return this.client;
    }

    public async verifyVerifiablePresentation(presentation: string): Promise<boolean> {
        // Initialize the Library - Is cached after first initialization
        await IotaIdentity.init(IDENTITY_WASM_PATH);
        const result = await this.getClient().checkPresentation(presentation);
        return Boolean(result?.verified);
    }
}
