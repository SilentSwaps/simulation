import {
	uniqueNamesGenerator, Config, names,
} from "unique-names-generator";
import {
	GeoPoint, IPerson, Question,
} from "../types";
import { movePointTowards } from "../util";
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
		this.location = { latitude:  52.799357, longtitude: 6.115400 };
		this.speed = 150;
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
		console.log("here", newQuestion);
		this.question = newQuestion;
		this.completedQuestion = false;
	}
}
