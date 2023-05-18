import React, {
	useState, useEffect, PropsWithChildren,
} from "react";
import { SimulationContext } from "../context/SimulationContext";
import { Person } from "../classes/person";
import { IPerson } from "../types";

export const SimulationProvider = ({ children }: PropsWithChildren) => {
	const [ people, setPeople ] = useState<IPerson[]>([]);

	const addPerson = () => {
		setPeople([ ...people, new Person() ]);
	};

	const getInstances = (): IPerson[] => {
		return people;
	};

	const movePeople = () => {
		setPeople((prev) => {
			return prev.map(p => p.move());
		});
	};

	return (
		<SimulationContext.Provider value={{
			addPerson, getInstances, movePeople, people,
		}}
		>
			{children}
		</SimulationContext.Provider>
	);
};
