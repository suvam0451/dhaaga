import { InstanceApi_SoftwareInfoDTO } from './routes/instance.js';
import { ActivitypubHelper } from '../../../index.js';
import { LibraryResponse } from '../../../types/result.types.js';

export async function getSoftwareInfoShared(
	urlLike: string,
): Promise<LibraryResponse<InstanceApi_SoftwareInfoDTO>> {
	const { data, error } = await ActivitypubHelper.getInstanceSoftware(urlLike);
	if (error) return { error };
	return { data };
}
