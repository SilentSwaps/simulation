import React, { useEffect, useState } from "react";
import {
	Box,
	Button, Grid, Typography,
} from "@mui/material";
import { movePointTowards } from "../../util";
import { useSimulation } from "../../hooks/useSimulation";
import {
	MapContainer, Marker, Popup, TileLayer, useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { marker } from "leaflet";
import { HeatmapLayerFactory } from "@vgrid/react-leaflet-heatmap-layer";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

L.Icon.Default.mergeOptions({
	iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
	iconUrl: require("leaflet/dist/images/marker-icon.png"),
	shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const blueIcon = new L.Icon({ iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png" });
const redIcon = new L.Icon({ iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png" });
const HeatmapLayer = HeatmapLayerFactory<[number, number, number]>();

const points: [number, number, number][] = [

	[
		-37.8963032667, 175.4132068, 500,
	],
];

export const Insights = () => {
	const [ pause, setPause ] = useState<boolean>(true);

	const {
		addPerson, getInstances, movePeople, people, questions,
	} = useSimulation();

	useEffect(() => {
		if (pause) return;
		const interval = setInterval(() => {
			movePeople();
		}, 200);
		return () => clearInterval(interval);
	}, [ movePeople, questions ]);

	return (
		<Grid container>
			<Grid
				item
				xs={2}
			>
				<Box>
					<Typography variant="h2">Settings</Typography>
				</Box>

				<Box>
					<IconButton>
						<ArrowBackIosIcon />
					</IconButton>

					{
						pause ?(
							<IconButton onClick={() => {
								setPause(!pause);
								movePeople();
							}}
							>
								<PlayArrowIcon />
							</IconButton>
						):(
							<IconButton onClick={() => setPause(!pause)}>
								<PauseIcon />
							</IconButton>
						)
					}

					<IconButton onClick={() =>  movePeople()}>
						<ArrowForwardIosIcon />
					</IconButton>
				</Box>

				<Box
					sx={{
						display: "flex", flexDirection: "column", alignItems: "flex-start",
					}}
				>

					<Button onClick={movePeople}>Move</Button>

					<Button>Initialize</Button>
				</Box>
			</Grid>

			<Grid item xs={10}>

				<MapContainer
					center={[ 52.799811, 6.112557 ]}
					zoom={15}
					scrollWheelZoom
					style={{ width: "100%", height: "calc(100vh - 4rem)" }}
				>
					<HeatmapLayer
						fitBoundsOnLoad
						fitBoundsOnUpdate
						points={points}
						longitudeExtractor={m => m[1]}
						latitudeExtractor={m => m[0]}
						intensityExtractor={m => m[2]}
						max={500}
					/>

					<TileLayer
						url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
						attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					/>

					{
						questions.map((q) => {
							return (
								<Marker position={[ q.latitude, q.longtitude ]} key={q.hash} icon={redIcon}>
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
				</MapContainer>
			</Grid>
		</Grid>
	);
};
