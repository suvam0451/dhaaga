import EmptyFileSvg from '#/components/svgs/topaz-empty-state/EmptyFile';
import ErrorPageBuilder from '#/ui/ErrorPageBuilder';

function EmptyNotificationsView() {
	return (
		<ErrorPageBuilder
			stickerArt={<EmptyFileSvg />}
			errorMessage={'Notification List Empty'}
			errorDescription={
				"You don't have any notifications under this category yet."
			}
		/>
	);
}

export default EmptyNotificationsView;
