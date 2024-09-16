import { account, account_Relations } from './entities/account';
import {
	accountHashtag_Relations,
	accountHashtags,
} from './entities/account-hashtag';
import {
	accountMetadata,
	accountMetadata_Relations,
} from './entities/account-metadata';
import { accountSettings } from './entities/account-setting';
import { appSettings } from './entities/app_setting';

export const DATABASE_NAME = 'app.db';

export {
	account,
	account_Relations,
	accountHashtags,
	accountHashtag_Relations,
	accountMetadata,
	accountMetadata_Relations,
	accountSettings,
	appSettings,
};
