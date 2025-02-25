export interface Log {
	collectionId?: string | "";
	collectionName?: string | "";
	created?: string | "";
	id?: string | "";
	updated?: string | "";
	date?: string | "";
	exercise?: string | "";
	reps?: number | null;
	sets?: number | null;
	user?: string | "";
	weight?: string | null;
	remarks?: string | "";
}

export interface BodyPart {
	collectionId?: string | null;
	collectionName?: string | null;
	created?: string | null;
	updated?: string | null;
	id?: string | null;
	name: string | null;
	color: string | null;
}

export interface Exercise {
	body_part: string | null;
	collectionId?: string | null;
	collectionName?: string | null;
	created?: string | null;
	id?: string | null;
	name: string | null;
	updated?: string | null;
}

export interface PersonalRecord {
	collectionId: string | null;
	collectionName?: string | null;
	created?: string | null;
	updated?: string | null;
	id?: string | null;
	date: string | null;
	exercise: string | null;
	reps: number | 0;
	user: string | null;
	weight: number | 0;
}

export interface ExerciseStats {
	id?: string | "";
	exercise?: string | "";
	bodyPart: string | "";
	bodyPartColor: string | "";
	totalSets: number | 0;
	totalReps: number | 0;
	weights: number[] | [0];
	increaseInWeight: number | 0;
}

export interface BodyPartStats {
	id: string | "";
	bodyPart: string | "";
	color: string | "";
	totalSets: number | 0;
}
