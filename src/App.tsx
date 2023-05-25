import React from "react";
import {
	BrowserRouter, Route, Routes,
} from "react-router-dom";
import { Home } from "./pages/home";
import { SimulationProvider } from "./providers/SimulationProvider";
import { MapTest } from "./pages/map";
import { Insights } from "./pages/data";

function App() {
	return (
		<SimulationProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />

					<Route path="/map" element={<MapTest />} />

					<Route path="/insights" element={<Insights />} />
				</Routes>
			</BrowserRouter>
		</SimulationProvider>
	);
}

export default App;
