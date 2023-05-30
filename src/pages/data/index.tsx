import React, { useEffect, useState } from "react";
import {
	Box, Button, Grid, Typography, Divider, TextField,
} from "@mui/material";
import { movePointTowards } from "../../util";
import { useSimulation } from "../../hooks/useSimulation";
import {
	MapContainer, Marker, Popup, TileLayer,
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

export const Insights = () => {
	const [ pause, setPause ] = useState<boolean>(true);
	const [ tick, setTick ] = useState<number>(0);
	const [ maxPoints, setMaxPoints ] = useState<string>("10");
	const [ radius, setRadius ] = useState<string>("15");

	const {
		addPerson, getInstances, movePeople, people, questions, heatmapData,
	} = useSimulation();

	useEffect(() => {
		if (pause) return;
		const interval = setInterval(() => {
			if (tick + 1 > heatmapData.length -1) return setPause(!pause);
			setTick(t => t + 1);
		}, 200);
		return () => clearInterval(interval);
	}, [ pause, tick ]);

	return (
		<Grid container>
			<Grid
				item
				xs={2}
			>
				<Box>
					<Typography variant="h4">Insights</Typography>
				</Box>

				<Box>
					<IconButton onClick={() => {
						if (tick -1 < 0) return;
						setTick(t => t - 1);
					}}
					>
						<ArrowBackIosIcon />
					</IconButton>

					{
						pause ?(
							<IconButton onClick={() => {
								setPause(!pause);
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

					<IconButton onClick={() => {
						if (tick + 1 > heatmapData.length) return;
						setTick(t => t + 1);
					}}
					>
						<ArrowForwardIosIcon />
					</IconButton>

				</Box>

				<Box
					sx={{
						display: "flex", flexDirection: "column", alignItems: "flex-start",
					}}
				>

					<TextField
						id="points"
						label="Maximum points"
						focused
						value={maxPoints}
						margin="normal"
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
							setMaxPoints(event.target.value);
						}}
					/>

					<TextField
						id="radius"
						label="Radius"
						focused
						value={radius}
						margin="normal"
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
							setRadius(event.target.value);
						}}
					/>

					<Button onClick={() => setTick(0)}>Reset ticks</Button>

				</Box>
			</Grid>

			<Grid item xs={10}>

				<MapContainer
					center={[ 52.799811, 6.112557 ]}
					zoom={15}
					scrollWheelZoom
					style={{ width: "100%", height: "calc(100vh - 4rem)" }}
				>
					{
						heatmapData.length > 0 ? (
							<HeatmapLayer
								points={heatmapData[tick]}
								longitudeExtractor={m => m[1]}
								latitudeExtractor={m => m[0]}
								intensityExtractor={m => m[2]}
								max={parseInt(maxPoints)}
								radius={parseInt(radius)}
								minOpacity={0.5}
							/>
						) : (null)
					}

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
