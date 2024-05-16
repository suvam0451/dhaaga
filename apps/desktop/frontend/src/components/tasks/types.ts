import { ProviderAuthItem } from "../../lib/redux/slices/authSlice";

export type TaskExecutionComponentCreateDTO = {
	uuid: string;
	loginAs?: ProviderAuthItem;
	taskDetails: Record<string, string>;
};
