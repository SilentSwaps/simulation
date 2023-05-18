import React, { useEffect } from "react";
import {
	Button, Grid, Typography,
} from "@mui/material";
import { movePointTowards } from "../util";
import { useSimulation } from "../hooks/useSimulation";

export const Home = () => {
	const {
		addPerson, getInstances, movePeople, people,
	} = useSimulation();

	const add = () => {
		addPerson();
	};

	const getNames = () => {
		const p = getInstances();
		people.forEach(px => console.log(px.getName()));
	};

	useEffect(() => {
		console.log("updated component", people);
	}, [people]);

	useEffect(() => {
		const interval = setInterval(() => {
			movePeople();
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<Grid container>
			<Grid item xs={2}>
				<Typography>Settings</Typography>

				<Button onClick={add}>add</Button>

				<Button onClick={getNames}>get names</Button>

				<Button onClick={movePeople}>Move</Button>
			</Grid>

			<Grid item xs={10}>
				<Typography>Side</Typography>
			</Grid>
		</Grid>
	);
};

// const handleClick = () => {
// 	const pointA = { latitude: 52.731069437604795, longtitude: 6.049038174628135 };
// 	const pointB = { latitude: 52.731290, longtitude: 6.048536 };
// 	const distanceInMeters = 100;

// 	const newPoint = movePointTowards(pointA, pointB, distanceInMeters);
// 	console.log(newPoint);
// };
