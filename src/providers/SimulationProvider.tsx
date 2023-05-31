import React, {
	useState, useEffect, PropsWithChildren,
} from "react";
import { SimulationContext } from "../context/SimulationContext";
import { Person } from "../classes/person";
import {
	HeatMapData, IPerson, LineGraph, Question,
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
	const [ lineGraphData, setLineGraphData ] = useState<LineGraph[]>([]);

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
			.reduce((p, c) => p.amount < c.amount ? p : c);

	/**
	 *
	 * @param r array of ids of the remaining questions
	 * @param x current latitude
	 * @param s current longtitude
	 */
	const getClosestQuestion = (r: string[], x: number, s: number, d: QuestionData[]) =>
		getMergedAndFiltered(r, d)
			.reduce((p, c) => {
				return (
					Math.ceil(geofire.distanceBetween(
						[ x, s ],
						[ p.latitude, p.longtitude ]
					) * 1000 )
					< Math.ceil(geofire.distanceBetween(
						[ x, s ],
						[ c.latitude, c.longtitude ]
					) * 1000) ? p : c
				);
			});

	const TransformToHeatmap = (o: IPerson[]) => {
		const temp: HeatMapData = o.map((p) => {
			const x = p.getLocation();
			return [
				x.latitude, x.longtitude, 1,
			];
		});
		setHeatmapData([ ...heatmapData, temp ]);
	};

	const addPerson = (amount: number) => {
		let tempQuestionData = [...questionData];
		let newPeople = [...people];
		// const map = getAmounts(tempQuestionData);

		for (let i=0; i<amount;i++){
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

		let tempLineData: LineGraph = {
			leastBusy: 0,
			leastBusyAndClosest: 0,
			leastBusyRemaining: 0,
			tick: 0,
		};

		tempPeople.forEach((person) => {

			if (!person.hasCompleted()) return person.move();

			const currentQuestion = person.getCurrentQuestion();
			const remainingQuestions = person.getRemainingQuestions();

			if (remainingQuestions.length === 0){
				// Person is done
				tempData = tempData.map((t) => {
					if (t.questionId === currentQuestion.id) return { ...t, amount: t.amount - 1 };
					return t;
				});
				tempPeople = tempPeople.filter(t => t !== person);
				return;
			}

			const leastBusyQuestion = getLeastBusyQuestion(remainingQuestions, tempData);

			const actualLeastBusy = getLeastBusyQuestion(questionIds, tempData);
			const closest = getClosestQuestion(
				questionIds,
				currentQuestion.latitude,
				currentQuestion.longtitude,
				tempData
			);

			if (leastBusyQuestion.hash === actualLeastBusy.hash){
				tempLineData = { ...tempLineData, leastBusy: tempLineData.leastBusy + 1 };
			} else {
				tempLineData = { ...tempLineData, leastBusyRemaining: tempLineData.leastBusyRemaining + 1 };
			}

			if (leastBusyQuestion.hash === closest.hash){
				tempLineData = { ...tempLineData, leastBusyAndClosest: tempLineData.leastBusyAndClosest + 1 };
			}

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
		setLineGraphData([ ...lineGraphData, tempLineData ]);
		setPeople(tempPeople);
		setQuestionData(tempData);
	};

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
			addPerson, getInstances, movePeople, people, questions, heatmapData, lineGraphData,
		}}
		>
			{children}
		</SimulationContext.Provider>
	);
};
