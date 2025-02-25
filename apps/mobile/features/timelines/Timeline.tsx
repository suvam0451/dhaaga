import TimelineInteractor from './interactors/TimelineInteractor';
import { PostTimelineCtx } from '@dhaaga/core';

function Timeline() {
	return (
		<PostTimelineCtx>
			<TimelineInteractor />
		</PostTimelineCtx>
	);
}

export default Timeline;
