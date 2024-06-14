import React, { useEffect, useState } from "react";
import { simulateCharging, SimulationResult } from "./simulateCharging";

interface Props {
	numChargePoints: number;
	arrivalMultiplier: number;
	carConsumption: number;
	chargingPower: number;
}

const ChargePointSimulator: React.FC<Props> = ({
	numChargePoints,
	arrivalMultiplier,
	carConsumption,
	chargingPower,
}) => {
	const [simulationResult, setSimulationResult] =
		useState<SimulationResult | null>(null);

	useEffect(() => {
		const result = simulateCharging(
			numChargePoints,
			arrivalMultiplier,
			carConsumption,
			chargingPower
		);
		setSimulationResult(result);
	}, [numChargePoints, arrivalMultiplier, carConsumption, chargingPower]);

	return (
		<div className="mt-4">
			<h2 className="text-xl font-bold">Simulation Results</h2>
			{simulationResult ? (
				<>
					<p>
						Total Energy Consumed:{" "}
						{simulationResult.totalEnergyConsumed.toFixed(2)} kWh
					</p>
					<p>
						Theoretical Maximum Power Demand:{" "}
						{simulationResult.theoreticalMaxPowerDemand} kW
					</p>
					<p>
						Actual Maximum Power Demand:{" "}
						{simulationResult.actualMaxPowerDemand} kW
					</p>
					<p>
						Concurrency Factor:{" "}
						{simulationResult.concurrencyFactor.toFixed(2)}%
					</p>
				</>
			) : (
				<p>Running simulation...</p>
			)}
		</div>
	);
};

export default ChargePointSimulator;
