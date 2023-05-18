import React, { Dispatch, SetStateAction } from "react";
import { IPerson } from "../types";
import { Person } from "../classes/person";

interface SimulationContext {
	addPerson: () => void;
	getInstances: () => IPerson[]
	movePeople: () => void;
	people: IPerson[]
}

export const SimulationContext = React.createContext<SimulationContext>({} as SimulationContext);
