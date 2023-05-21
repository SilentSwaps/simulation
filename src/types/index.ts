import { Person } from "../classes/person";

export type GeoPoint = {
	latitude: number,
	longtitude: number
}

export interface IPerson {
	getName: () => string,
	getLocation: () => GeoPoint
	getSpeed: () => number
	move: () => Person
	newQuestion: (question: Question) => void
	hasCompleted: () => boolean
	getRemainingQuestions: () => string[]
}

export type Question = {
	id: string,
	hash: string;
} & GeoPoint;
