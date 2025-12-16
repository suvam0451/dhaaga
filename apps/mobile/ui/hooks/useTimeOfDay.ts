enum TIME_OF_DAY {
	UNKNOWN = 'Unknown',
	MORNING = 'Morning',
	AFTERNOON = 'Afternoon',
	EVENING = 'Evening',
	NIGHT = 'Night',
}

function useTimeOfDay() {
	const currentHours = new Date().getHours();
	let timeOfDay: TIME_OF_DAY;
	if (currentHours >= 21 || (currentHours >= 0 && currentHours < 6)) {
		timeOfDay = TIME_OF_DAY.NIGHT;
	} else if (currentHours >= 6 && currentHours < 12) {
		timeOfDay = TIME_OF_DAY.MORNING;
	} else if (currentHours >= 12 && currentHours < 17) {
		timeOfDay = TIME_OF_DAY.AFTERNOON;
	} else {
		timeOfDay = TIME_OF_DAY.EVENING;
	}

	return timeOfDay;
}

export default useTimeOfDay;
