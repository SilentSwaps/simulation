import React, { useEffect, useState } from "react";
import {
	Box, Button, Grid, Typography, TextField,
} from "@mui/material";
import { useSimulation } from "../../hooks/useSimulation";
import {
	MapContainer, Marker, Popup, TileLayer,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { HeatmapLayerFactory } from "@vgrid/react-leaflet-heatmap-layer";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import {
	LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

L.Icon.Default.mergeOptions({
	iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
	iconUrl: require("leaflet/dist/images/marker-icon.png"),
	shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const redIcon = new L.Icon({ iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png" });
const HeatmapLayer = HeatmapLayerFactory<[number, number, number]>();

type BarChartData = {
	leastBusy: number,
	leasyBusyRemaining: number
}

export const Insights = () => {
	const [ pause, setPause ] = useState<boolean>(true);
	const [ tick, setTick ] = useState<number>(0);
	const [ maxPoints, setMaxPoints ] = useState<string>("10");
	const [ radius, setRadius ] = useState<string>("15");
	const [ barchartData, setBarchatData ] = useState<BarChartData[] | undefined>();

	const {
		questions, heatmapData, lineGraphData,
	} = useSimulation();

	useEffect(() => {
		let leastBusy = 0;
		let leastBusyRemaining = 0;

		for (let i = 0; i < lineGraphData.length; i++) {
			leastBusy += lineGraphData[i].leastBusy;
			leastBusyRemaining += lineGraphData[i].leastBusyRemaining;
		}

		setBarchatData([{ leastBusy, leasyBusyRemaining: leastBusyRemaining }] );

		console.log(leastBusy, leastBusyRemaining);
	}, [lineGraphData]);

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
						if (tick + 1 > heatmapData.length - 1) return;
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

			<Grid item xs={4}>

				<ResponsiveContainer width="100%" height="100%">
					<BarChart
						width={500}
						height={300}
						data={barchartData}
						margin={{
							top: 5,
							right: 30,
							left: 20,
							bottom: 5,
						}}
					>
						<CartesianGrid strokeDasharray="3 3" />

						<XAxis dataKey="name" />

						<YAxis />

						<Tooltip />

						<Legend />

						<Bar dataKey="leasyBusyRemaining" fill="#8884d8" />

						<Bar dataKey="leastBusy" fill="#82ca9d" />
					</BarChart>
				</ResponsiveContainer>
			</Grid>

			<Grid item xs={6}>

				<MapContainer
					center={[ 52.799811, 6.112557 ]}
					zoom={15}
					scrollWheelZoom
					style={{ width: "100%", height: "700px" }}
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

			<Grid item xs={12} sx={{ minHeight: 600 }}>
				<ResponsiveContainer width="100%" height="100%">
					<LineChart
						title="Choices least busy spot vs least busy spot of remainders"
						width={500}
						height={300}
						data={lineGraphData.filter(l => (l.leastBusy !== 0 && l.leastBusyRemaining !== 0))}
						margin={{
							top: 5,
							right: 30,
							left: 20,
							bottom: 5,
						}}
					>
						<CartesianGrid strokeDasharray="3 3" />

						<XAxis dataKey="name" />

						<YAxis />

						<Tooltip />

						<Legend />

						<Line
							type="monotone"
							dataKey="leastBusyRemaining"
							label="Least busy of remaining questions"
							stroke="#8884d8"
							activeDot={{ r: 8 }}
						/>

						<Line
							type="monotone"
							label="Least busy"
							dataKey="leastBusy"
							stroke="#82ca9d"
						/>
					</LineChart>
				</ResponsiveContainer>
			</Grid>
		</Grid>
	);
};
