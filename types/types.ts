export interface Log {
	collectionId?: string | "";
	collectionName?: string | "";
	created?: string | "";
	id?: string | "";
	updated?: string | "";
	date?: string | "";
	exercise?: string | "";
	reps?: number | 0;
	sets?: number | 0;
	user?: string | "";
	weight?: number | 0;
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
