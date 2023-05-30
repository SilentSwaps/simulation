import React, { useEffect } from "react";
import {
	MapContainer, Marker, Popup, TileLayer, useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useSimulation } from "../../hooks/useSimulation";
import { Button, Grid } from "@mui/material";
export const MapTest = () => {

	const { heatmapData } = useSimulation();

	useEffect(() => {
		console.log(heatmapData);
	}, []);

	return (
		<Grid container>
			<Grid item xs={3}>
				<Button onClick={() => console.log(heatmapData)}>Heatmap data</Button>
			</Grid>

			<Grid item xs={9}>
				<MapContainer
					center={[ 51.505, -0.09 ]}
					zoom={13}
					scrollWheelZoom
					style={{ width: "40%", height: "calc(100vh - 4rem)" }}
				>
					<TileLayer
						url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
						attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					/>

					<Marker position={[ 51.505, -0.09 ]}>
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
