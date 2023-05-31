import React from "react";
import {
	HeatMapData, IPerson, LineGraph, Question,
} from "../types";

interface SimulationContext {
	addPerson: (amount: number) => void;
	getInstances: () => IPerson[]
	movePeople: () => void;
	people: IPerson[]
	questions: Question[]
	heatmapData: HeatMapData[]
	lineGraphData: LineGraph[]
}

export const SimulationContext = React.createContext<SimulationContext>({} as SimulationContext);
