import type { BodyPartStats, ExerciseStats } from "./types";

export function getStartOfWeekDates() {
	const now = new Date();

	// Set the first day of the current week (Monday)
	const currentDay = now.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
	const daysToMonday = (currentDay + 6) % 7; // Calculate days back to Monday
	const mondayThisWeek = new Date(now);
	mondayThisWeek.setDate(now.getDate() - daysToMonday);
	mondayThisWeek.setHours(0, 0, 0, 0); // Set time to midnight

	// Set the first day of next week
	const mondayNextWeek = new Date(mondayThisWeek);
	mondayNextWeek.setDate(mondayThisWeek.getDate() + 7); // Add 7 days to current week's Monday

	return {
		thisWeek: mondayThisWeek.toISOString(),
		nextWeek: mondayNextWeek.toISOString(),
	};
}

export function calculateStatsPerExercise(logs: any[]): ExerciseStats[] {
	const stats: Record<string, ExerciseStats> = {}; // Explicitly typed object

	logs.forEach((log) => {
		const id = log.expand.exercise.id;
		const exerciseName = log.expand.exercise.name;
		const bodyPart = log.expand.exercise.expand.body_part.name;
		const bodyPartColor = log.expand.exercise.expand.body_part.color;
		const weight = log.weight;
		const sets = log.sets;
		const reps = log.reps;

		if (!stats[exerciseName]) {
			stats[exerciseName] = {
				id,
				bodyPart,
				totalSets: 0,
				totalReps: 0,
				weights: [],
				increaseInWeight: 0,
				bodyPartColor,
			};
		}

		stats[exerciseName].totalSets += sets;
		stats[exerciseName].totalReps += reps;
		stats[exerciseName].weights.push(weight);
	});

	// Calculate the weight increase percentage
	return Object.entries(stats).map(([exercise, details]) => {
		const { weights } = details;
		const minWeight = Math.min(...weights);
		const maxWeight = Math.max(...weights);

		return {
			exercise,
			...details,
			increaseInWeight: minWeight === maxWeight ? 0 : ((maxWeight - minWeight) / minWeight) * 100,
		};
	});
}

export function calculateStatsPerBodyPart(logs: any[]): BodyPartStats[] {
	// Create a map to store aggregated data for each body part
	const bodyPartMap = new Map<string, BodyPartStats>();

	logs.forEach((log) => {
		const bodyPart = log.expand.exercise.expand.body_part;
		const bodyPartId = bodyPart.id;

		// Initialize the body part data if it doesn't exist in the map
		if (!bodyPartMap.has(bodyPartId)) {
			bodyPartMap.set(bodyPartId, {
				id: bodyPartId,
				bodyPart: bodyPart.name,
				color: bodyPart.color,
				totalSets: 0,
			});
		}

		// Update the body part data
		const bodyPartData = bodyPartMap.get(bodyPartId)!;
		bodyPartData.totalSets += log.sets;
	});

	// Convert the map values to an array
	return Array.from(bodyPartMap.values());
}
