import React from "react";
import {
	MapContainer, Marker, Popup, TileLayer, useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
export const MapTest = () => {
	return (
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
	);
};
