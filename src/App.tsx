import React from "react";
import {
	BrowserRouter, Route, Routes,
} from "react-router-dom";
import { Home } from "./home";
import { SimulationProvider } from "./providers/SimulationProvider";

function App() {
	return (
		<SimulationProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Home />} />
				</Routes>
			</BrowserRouter>
		</SimulationProvider>
	);
}

export default App;
