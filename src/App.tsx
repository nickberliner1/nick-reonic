import React, { useState } from "react";
import ChargePointSimulator from "./ChargePointSimulator";

const App: React.FC = () => {
	const [numChargePoints, setNumChargePoints] = useState<number>(20);
	const [arrivalMultiplier, setArrivalMultiplier] = useState<number>(2); // Start with a higher multiplier
	const [carConsumption, setCarConsumption] = useState<number>(18);
	const [chargingPower, setChargingPower] = useState<number>(11);

	return (
		<div className="p-4 max-w-2xl mx-auto">
			<h1 className="text-2xl font-bold mb-4">EV Charger Simulation</h1>
			<div className="space-y-4">
				<div className="flex flex-col space-y-1">
					<label className="flex flex-col">
						<span className="mb-1">Number of Charge Points:</span>
						<input
							type="number"
							value={numChargePoints}
							onChange={(e) =>
								setNumChargePoints(Number(e.target.value))
							}
							className="border p-2"
							min="1"
						/>
					</label>
				</div>
				<div className="flex flex-col space-y-1">
					<label className="flex flex-col">
						<span className="mb-1">
							Arrival Probability Multiplier (%):
						</span>
						<input
							type="number"
							value={arrivalMultiplier * 100}
							onChange={(e) =>
								setArrivalMultiplier(
									Number(e.target.value) / 100
								)
							}
							className="border p-2"
							min="1"
							max="200"
						/>
					</label>
				</div>
				<div className="flex flex-col space-y-1">
					<label className="flex flex-col">
						<span className="mb-1">Car Consumption (kWh):</span>
						<input
							type="number"
							value={carConsumption}
							onChange={(e) =>
								setCarConsumption(Number(e.target.value))
							}
							className="border p-2"
							min="1"
						/>
					</label>
				</div>
				<div className="flex flex-col space-y-1">
					<label className="flex flex-col">
						<span className="mb-1">
							Charging Power per Chargepoint (kW):
						</span>
						<input
							type="number"
							value={chargingPower}
							onChange={(e) =>
								setChargingPower(Number(e.target.value))
							}
							className="border p-2"
							min="1"
						/>
					</label>
				</div>
			</div>
			<ChargePointSimulator
				numChargePoints={numChargePoints}
				arrivalMultiplier={arrivalMultiplier}
				carConsumption={carConsumption}
				chargingPower={chargingPower}
			/>
		</div>
	);
};

export default App;
