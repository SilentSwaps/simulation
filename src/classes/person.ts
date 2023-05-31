import {
	uniqueNamesGenerator, Config, names,
} from "unique-names-generator";
import {
	GeoPoint, IPerson, Question,
} from "../types";
import { RandomLocation, movePointTowards } from "../util";
import * as geofire from "geofire-common";

const config: Config = {
	dictionaries: [names],
	length: 1,
};

export class Person implements IPerson {
	private name: string;
	private location: GeoPoint;
	private speed: number;
	private question: Question;
	private remainingQuestions: string[];
	private completedQuestion: boolean;

	constructor(question: Question, questionIds: string[]) {
		this.name = uniqueNamesGenerator(config);
		this.location = {
			latitude:  RandomLocation(52.801186, 52.800356, 6),
			longtitude: RandomLocation(6.096956, 6.112663, 6),
		};
		this.speed = Math.floor(Math.random() * (50 - 25 + 1)) + 25;
		this.question = question;
		this.remainingQuestions = questionIds;
		this.completedQuestion = false;
	}

	getName() {
		return this.name;
	}

	getLocation() {
		return this.location;
	}

	getSpeed(){
		return this.speed;
	}

	hasCompleted(){
		return this.completedQuestion;
	}

	getRemainingQuestions(){
		return this.remainingQuestions;
	}

	getCurrentQuestion() {
		return this.question;
	}

	move(): Person{
		const distanceBetween = geofire.distanceBetween(
			[ this.location.latitude, this.location.longtitude ],
			[ this.question.latitude, this.question.longtitude ]) * 1000;

		// If the distance is smaller than it's speed. It arrives at the question
		if (distanceBetween < this.speed) {
			this.completedQuestion = true;
			// Filter the array to everything but the question
			this.remainingQuestions = this.remainingQuestions.filter(o => o !== this.question.id);
			this.location = { latitude: this.question.latitude, longtitude: this.question.longtitude };
			return this;
		}

		// Move current location towards the question
		this.location = movePointTowards(
			this.location,
			{ latitude:  this.question.latitude, longtitude: this.question.longtitude },
			this.speed
		);
		return this;
	}

	// Sets a new question and completed to false
	newQuestion(newQuestion: Question){
		this.question = newQuestion;
		this.completedQuestion = false;
	}
}
