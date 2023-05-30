import React, {
	useState, useEffect, PropsWithChildren,
} from "react";
import { SimulationContext } from "../context/SimulationContext";
import { Person } from "../classes/person";
import {
	HeatMapData, IPerson, Question,
} from "../types";
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
	const [ heatmapData, setHeatmapData ] = useState<HeatMapData[]>([]);

	// Creates a map for quick lookup
	const getAmounts = (d: QuestionData[]) =>
		new Map(d.map( i => [ i.questionId, i.amount ]));
	/**
	 *
	 * @param r array of ids of the remaining questions
	 */
	const getMergedAndFiltered = (r: string[], d: QuestionData[]) =>
		questions
			.map(q => ({ ...q, amount: getAmounts(d).get(q.id) as number }))
			.filter(q => r.includes(q.id));

	/**
	 *
	 * @param r array of ids of the remaining questions
	 */
	const getLeastBusyQuestion = (r: string[], d: QuestionData[]) =>
		getMergedAndFiltered(r, d)
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
		getMergedAndFiltered(r, questionData)
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
		const leastBusyQuestion = getLeastBusyQuestion(remainingQuestions, questionData);

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

	const TransformToHeatmap = (o: IPerson[]) => {
		const temp: HeatMapData = o.map((p) => {
			const x = p.getLocation();
			return [
				x.latitude, x.longtitude, 1,
			];
		});
		setHeatmapData([ ...heatmapData, temp ]);
	};

	const addPerson = () => {
		let tempQuestionData = [...questionData];
		let newPeople = [...people];
		// const map = getAmounts(tempQuestionData);

		for (let i=0; i<200;i++){
			const q = getLeastBusyQuestion(questionIds, tempQuestionData);
			const p = new Person(q, questionIds);
			tempQuestionData = tempQuestionData.map((t) => {
				if (t.questionId === q.id) return { ...t, amount: t.amount +1 };
				return t;
			});
			newPeople = [ ...newPeople, p ];
		}

		TransformToHeatmap(newPeople);
		setQuestionData(tempQuestionData);
		setPeople(newPeople);
	};

	const getInstances = (): IPerson[] => {
		return people;
	};

	const movePeople = () => {

		let tempPeople = [...people];
		let tempData = [...questionData];

		tempPeople.forEach((person) => {

			if (!person.hasCompleted()) return person.move();

			const currentQuestion = person.getCurrentQuestion();
			const remainingQuestions = person.getRemainingQuestions();

			if (remainingQuestions.length === 0){
				console.log(heatmapData);
				// Person is done
				tempData = tempData.map((t) => {
					if (t.questionId === currentQuestion.id) return { ...t, amount: t.amount - 1 };
					return t;
				});
				tempPeople = tempPeople.filter(t => t !== person);
				return;
			}

			const leastBusyQuestion = getLeastBusyQuestion(remainingQuestions, tempData);
			// console.log(`${person.getName()} will go to ${leastBusyQuestion.id} because it has ${questionData.find(d => d.questionId === leastBusyQuestion.id)?.amount} people`, questionData);
			// console.log("before", tempData);
			tempData = tempData.map((t) => {
				if (t.questionId === currentQuestion.id) {
					t = { ...t, amount: t.amount - 1 };
				}
				if (t.questionId === leastBusyQuestion.id){
					t = { ...t, amount: t.amount + 1 };
				}
				return t;
			});

			person.newQuestion(leastBusyQuestion);

			person.move();
		});
		if (people.length !== 0){
			TransformToHeatmap(tempPeople);
		}
		setPeople(tempPeople);
		setQuestionData(tempData);
	};

	useEffect(() => {
		console.log(heatmapData);
	}, [heatmapData]);

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
			addPerson, getInstances, movePeople, people, questions, heatmapData,
		}}
		>
			{children}
		</SimulationContext.Provider>
	);
};
