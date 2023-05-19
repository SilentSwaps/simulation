import React, { useEffect, useState } from "react";
import {
	Button, Grid, Typography,
} from "@mui/material";
import { movePointTowards } from "../../util";
import { useSimulation } from "../../hooks/useSimulation";
import {
	MapContainer, Marker, Popup, TileLayer, useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { marker } from "leaflet";
import { GeoPoint } from "../../types";

// delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
	iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
	iconUrl: require("leaflet/dist/images/marker-icon.png"),
	shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export const Home = () => {
	const [ markers, setMarkers ] = useState<GeoPoint[]>([]);

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
		setMarkers(people.map(p => p.getLocation()));
		// people.map(p => console.log(p.getLocation()));
		// setMarkers([...markers, people.map(p => p.getLocation())])
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

				<MapContainer
					center={[ 52.799811, 6.112557 ]}
					zoom={13}
					scrollWheelZoom
					style={{ width: "100%", height: "calc(100vh - 4rem)" }}
				>
					<TileLayer
						url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
						attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					/>

					{
						markers.map((m, i) => {
							return (
								<Marker position={[ m.latitude, m.longtitude ]} key={i}>
									<Popup>
										A pretty CSS3 popup.
										{" "}

										<br />

										{" "}
										Easily customizable.
									</Popup>
								</Marker>
							);
						})
					}

					<Marker position={[ 52.801336, 6.104918 ]}>
						<Popup>
							A pretty CSS3 popup.
							{" "}

							<br />

							{" "}
							Easily customizable.
						</Popup>
					</Marker>
				</MapContainer>
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
