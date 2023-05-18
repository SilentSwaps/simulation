import {
	uniqueNamesGenerator, Config, names,
} from "unique-names-generator";
import { GeoPoint, IPerson } from "../types";
import { RandomLocation, movePointTowards } from "../util";

const config: Config = {
	dictionaries: [names],
	length: 1,
};

export class Person implements IPerson {
	private name: string;
	private location: GeoPoint;
	private speed: number;
	constructor() {
		this.name = uniqueNamesGenerator(config);
		this.location = { latitude:  RandomLocation(-90, 90, 8), longtitude: RandomLocation(-180, 180, 8) };
		this.speed = 10;
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

	move(): Person{
		this.location = movePointTowards(
			this.location,
			{ latitude:  RandomLocation(-90, 90, 8), longtitude: RandomLocation(-180, 180, 8) },
			10
		);
		return this;
	}
}
