import { ServiceFactory } from '../factories/serviceFactory';
import { IdentityService } from '../services/identityService';
import { IOTA_NODE_URL, DEVNET } from '../config';
import type { IdentityConfig } from '../models/types/identity';

const config: IdentityConfig = {
	node: IOTA_NODE_URL,
	network: DEVNET ? 'dev' : 'main',
};

export default () => {
    ServiceFactory.register('identity', () => new IdentityService(config));  
}
