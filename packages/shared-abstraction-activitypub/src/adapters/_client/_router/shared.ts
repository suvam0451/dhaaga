import { LibraryResponse } from './_types.js';
import { InstanceApi_SoftwareInfoDTO } from './instance.js';
import { ActivitypubHelper } from '../../../index.js';

export async function getSoftwareInfoShared(
	urlLike: string,
): Promise<LibraryResponse<InstanceApi_SoftwareInfoDTO>> {
	const { data, error } = await ActivitypubHelper.getInstanceSoftware(urlLike);
	if (error) return { error };
	return { data };
}
