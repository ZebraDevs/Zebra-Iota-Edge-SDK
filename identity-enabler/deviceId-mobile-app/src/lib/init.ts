import { ServiceFactory } from "../factories/serviceFactory";
import { IdentityService } from "../services/identityService";
import { IOTA_NODE_URL, DEVNET, IOTA_PERMANODE_URL } from "../config";
import { ServiceFactory } from "../factories/serviceFactory";
import type { IdentityConfig } from "../models/types/identity";
import { IdentityService } from "../services/identityService";

const config: IdentityConfig = {
    node: IOTA_NODE_URL,
    network: DEVNET ? "dev" : "main",
    ...(IOTA_PERMANODE_URL && { permanode: IOTA_PERMANODE_URL })
};

export default () => {
    ServiceFactory.register("identity", () => new IdentityService(config));
};
