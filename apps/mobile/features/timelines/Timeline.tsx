import WithPostTimelineCtx from './contexts/PostTimelineCtx';
import TimelineInteractor from './interactors/TimelineInteractor';

function Timeline() {
	return (
		<WithPostTimelineCtx>
			<TimelineInteractor />
		</WithPostTimelineCtx>
	);
}

export default Timeline;
