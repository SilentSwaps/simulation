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
		this.location = { latitude:  52.799357, longtitude: 6.115400 };
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
			{ latitude:  52.801336, longtitude: 6.104918 },
			10
		);
		return this;
	}
}
