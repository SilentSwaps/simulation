import React, { useEffect, useState } from "react";
import {
	Box,
	Button, Grid, TextField, Typography,
} from "@mui/material";
import { useSimulation } from "../../hooks/useSimulation";
import {
	MapContainer, Marker, Popup, TileLayer,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { GeoPoint } from "../../types";
import IconButton from "@mui/material/IconButton";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { useNavigate } from "react-router";

L.Icon.Default.mergeOptions({
	iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
	iconUrl: require("leaflet/dist/images/marker-icon.png"),
	shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const blueIcon = new L.Icon({ iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png" });
const redIcon = new L.Icon({ iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png" });

export const Home = () => {
	const [ markers, setMarkers ] = useState<GeoPoint[]>([]);
	const [ pause, setPause ] = useState<boolean>(true);
	const [ amount, setAmount ] = useState<string>("0");
	const navigate = useNavigate();
	const {
		addPerson, getInstances, movePeople, people, questions,
	} = useSimulation();

	useEffect(() => {
		setMarkers(people.map(p => p.getLocation()));
	}, [people]);

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
					<Typography variant="h2">Controls</Typography>
				</Box>

				<Box>
					{/* <IconButton>
						<ArrowBackIosIcon />
					</IconButton> */}

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
					<TextField
						label="Amount of people"
						focused
						value={amount}
						margin="normal"
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
							setAmount(event.target.value);
						}}
					/>

					<Button onClick={() => addPerson(parseInt(amount))}>add</Button>

					<Button onClick={() => navigate("insights")}>Insights</Button>

				</Box>
			</Grid>

			<Grid item xs={10}>

				<MapContainer
					center={[ 52.799811, 6.112557 ]}
					zoom={15}
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
								<Marker position={[ m.latitude, m.longtitude ]} key={i} icon={blueIcon}>
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

					{
						questions.map((q) => {
							return (
								<Marker position={[ q.latitude, q.longtitude ]} key={q.hash} icon={redIcon}>
									<Popup>
										{q.hash}

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
