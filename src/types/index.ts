/*
	Latitude = equator, around the eath
	Longtitude = around, north to south pole
*/

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
	getCurrentQuestion: () => Question
}

export type Question = {
	id: string,
	hash: string;
} & GeoPoint;

export type HeatMapData = [number, number, number][]
export type LineGraph = {
	tick: number,
	leastBusy: number,
	leastBusyAndClosest: number
	leastBusyRemaining: number
}

