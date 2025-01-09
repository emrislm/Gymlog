export const useEventBus = () => {
	const refreshStats = () => {
		const event = new CustomEvent("refresh-stats");
		window.dispatchEvent(event);
	};

	const onRefreshStats = (callback: () => void) => {
		window.addEventListener("refresh-stats", callback);

		// Cleanup function
		return () => {
			window.removeEventListener("refresh-stats", callback);
		};
	};

	return {
		refreshStats,
		onRefreshStats,
	};
};
