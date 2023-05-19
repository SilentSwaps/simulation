import React, { Dispatch, SetStateAction } from "react";
import { IPerson, Question } from "../types";
import { Person } from "../classes/person";

interface SimulationContext {
	addPerson: () => void;
	getInstances: () => IPerson[]
	movePeople: () => void;
	people: IPerson[]
	questions: Question[]
}

export const SimulationContext = React.createContext<SimulationContext>({} as SimulationContext);
