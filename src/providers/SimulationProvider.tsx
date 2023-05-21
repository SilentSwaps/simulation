import React, {
	useState, useEffect, PropsWithChildren,
} from "react";
import { SimulationContext } from "../context/SimulationContext";
import { Person } from "../classes/person";
import { IPerson, Question } from "../types";
import { getCollections } from "../data/actions";
import { collections } from "../data/firebase";

/*
	// Map question Ids
	Give each person these ids
	Person gets a question => updated questionData array
	Person walks there until question is completed
	Person sets boolean completedQuestion to true and removes the question id from array

*/

type QuestionData = {
	id: string,
	amount: number
}

export const SimulationProvider = ({ children }: PropsWithChildren) => {
	const [ people, setPeople ] = useState<IPerson[]>([]);
	const [ questions, setQuestions ] = useState<Question[]>([]);
	const [ questionIds, setQuestionIds ] = useState<string[]>([]);
	const [ questionData, setQuestionData ] = useState<QuestionData[]>([]);

	const addPerson = () => {
		// Change this with input field, loop over all people and add their initial question
		setPeople([ ...people, new Person(questions[0], questionIds) ]);
	};

	const getInstances = (): IPerson[] => {
		return people;
	};

	const movePeople = () => {
		setPeople((prev) => {
			return prev.map((p) => {
				if ( p.hasCompleted() ){
					// Get the remaining questions of a person.
					const remainingQuestions = p.getRemainingQuestions();
					if (remainingQuestions.length === 0) return p;
					// Generate a random number between 0 and it's length
					const r = Math.floor(Math.random() * remainingQuestions.length );
					const possibleQuestions = questions.filter(q => remainingQuestions.includes(q.id));
					console.log(r);
					p.newQuestion(possibleQuestions[r]);
				}
				return p.move();
			});
		});
	};

	useEffect(() => {
		getCollections(collections.questions)
			.then((q) => {
				setQuestions(q);
				setQuestionIds(q.map(o => o.id));
			})
			.catch((e) => {
				console.log(e);
			});
	}, []);

	return (
		<SimulationContext.Provider value={{
			addPerson, getInstances, movePeople, people, questions,
		}}
		>
			{children}
		</SimulationContext.Provider>
	);
};
