import React, { Dispatch, SetStateAction } from "react";
import {
	HeatMapData, IPerson, LineGraph, Question,
} from "../types";
import { Person } from "../classes/person";

interface SimulationContext {
	addPerson: () => void;
	getInstances: () => IPerson[]
	movePeople: () => void;
	people: IPerson[]
	questions: Question[]
	heatmapData: HeatMapData[]
	lineGraphData: LineGraph[]
}

export const SimulationContext = React.createContext<SimulationContext>({} as SimulationContext);
