export interface Log {
	collectionId?: string;
	collectionName?: string;
	created?: string;
	id?: string;
	updated?: string;
	date: string;
	exercise: string;
	reps: number;
	sets: number;
	user: string;
	weight: number;
	remarks: string;
}

export interface BodyPart {
	collectionId?: string;
	collectionName?: string;
	created?: string;
	updated?: string;
	id?: string;
	name: string;
	color: string;
}

export interface Exercise {
	body_part: string;
	collectionId?: string;
	collectionName?: string;
	created?: string;
	id?: string;
	name: string;
	updated?: string;
}

export interface PersonalRecord {
	collectionId: string;
	collectionName?: string;
	created?: string;
	updated?: string;
	id?: string;
	date: string;
	exercise: string;
	reps: number;
	user: string;
	weight: number;
}
