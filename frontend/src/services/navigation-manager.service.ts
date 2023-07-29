import { COLUMNS } from "../components/utils/constansts";
import { ColumnItem } from "../lib/redux/slices/latestTabRenderer";

export class NavigationManager {
	/**
	 * Am I allowed to append this column type to
	 * the current stack ?
	 */
	static canAppendColumn(stack: ColumnItem[], requestedColumn: string) {
		switch (requestedColumn) {
			case COLUMNS.MASTADON_V1_STATUS: {
				const existingStatusPage = stack.find(
					(item) => item.type === COLUMNS.MASTADON_V1_STATUS
				);
				if (existingStatusPage) {
					return true;
				}
				return true;
			}
		}
	}
}
