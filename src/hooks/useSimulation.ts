import { useContext } from "react";
import { SimulationContext } from "../context/SimulationContext";

export const useSimulation = () => useContext(SimulationContext);
