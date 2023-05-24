import React, {
	useState, useEffect, PropsWithChildren,
} from "react";
import { SimulationContext } from "../context/SimulationContext";
import { Person } from "../classes/person";
import { IPerson, Question } from "../types";
import { getCollections } from "../data/actions";
import { collections } from "../data/firebase";
import * as geofire from "geofire-common";

type QuestionData = {
	// The id of the question
	questionId: string,
	// The amount of people going
	amount: number
}

export const SimulationProvider = ({ children }: PropsWithChildren) => {
	const [ people, setPeople ] = useState<IPerson[]>([]);
	const [ questions, setQuestions ] = useState<Question[]>([]);
	const [ questionIds, setQuestionIds ] = useState<string[]>([]);
	const [ questionData, setQuestionData ] = useState<QuestionData[]>([]);

	// Creates a map for quick lookup
	const getAmounts = () =>
		new Map(questionData.map( i => [ i.questionId, i.amount ]));
	/**
	 *
	 * @param r array of ids of the remaining questions
	 */
	const getMergedAndFiltered = (r: string[]) =>
		questions
			.map(q => ({ ...q, amount: getAmounts().get(q.id) as number }))
			.filter(q => r.includes(q.id));

	/**
	 *
	 * @param r array of ids of the remaining questions
	 */
	const getLeastBusyQuestion = (r: string[]) =>
		getMergedAndFiltered(r)
			.reduce((prev, curr) => {
				return prev.amount < curr.amount ? prev : curr;
			});

	/**
	 *
	 * @param r array of ids of the remaining questions
	 * @param clat current latitude
	 * @param clng current longtitude
	 */
	const getClosestQuestion = (r: string[], clat: number, clng: number) =>
		getMergedAndFiltered(r)
			.reduce((prev, curr) => {
				return (
					Math.ceil(geofire.distanceBetween(
						[ clat, clng ],
						[ prev.latitude, prev.longtitude ]
					) * 1000 )
					< Math.ceil(geofire.distanceBetween(
						[ clat, clng ],
						[ curr.latitude, curr.longtitude ]
					) * 1000) ? prev : curr
				);
			});

	const getQuestion = (person: IPerson): Question => {
		// Get the remaining question ids of person
		const remainingQuestions = person.getRemainingQuestions();
		// Get it's current location
		const cQuestion = person.getCurrentQuestion();

		const closestQuestion = getClosestQuestion(remainingQuestions, cQuestion.latitude, cQuestion.longtitude);
		const leastBusyQuestion = getLeastBusyQuestion(remainingQuestions);

		setQuestionData((prev) => {
			return prev.map((q) => {
				if (q.questionId === cQuestion.id){
					return { ...q, amount: q.amount -1 };
				}
				if (q.questionId === leastBusyQuestion.id){
					return { ...q, amount: q.amount + 1 };
				}
				return q;
			});
		});
		// console.log(`${person.getName()} going to ${leastBusyQuestion.id} because it has ${leastBusyQuestion.amount} people currently going`);
		return leastBusyQuestion;
	};

	const addPerson = () => {
		const question = getLeastBusyQuestion(questionIds);
		setQuestionData((prev) => {
			return prev.map((q) => {
				if (q.questionId === question.id) return { ...q, amount: q.amount +1 };
				return q;
			});
		});
		const p = new Person(question, questionIds);
		setPeople([ ...people, p ]);
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
					const n = getQuestion(p);
					p.newQuestion(n);
				}
				return p.move();
			});
		});
	};

	useEffect(() => {
		console.log(questionData);
	}, [questionData]);

	useEffect(() => {
		getCollections(collections.questions)
			.then((q) => {
				setQuestions(q);
				setQuestionIds(q.map(o => o.id));
				setQuestionData(q.map(o => ({ questionId: o.id, amount: 0 })));
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
