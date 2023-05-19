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
}

export type Question = {
	id: string,
	hash: string;
} & GeoPoint;
