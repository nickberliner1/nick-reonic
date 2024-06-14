export interface SimulationResult {
	totalEnergyConsumed: number;
	theoreticalMaxPowerDemand: number;
	actualMaxPowerDemand: number;
	concurrencyFactor: number;
}

type ChargePoint = {
	isOccupied: boolean;
	remainingChargeTime: number; // in 15-minute intervals
};

const TOTAL_INTERVALS = 24 * 4 * 365; // Number of 15-minute intervals in a year

// Define arrival probabilities for 15-minute intervals
const ARRIVAL_PROBABILITIES = new Array(24 * 4)
	.fill(0)
	.map((_, i) =>
		(i >= 7 * 4 && i < 9 * 4) || (i >= 17 * 4 && i < 19 * 4) ? 0.02 : 0.005
	);

// Normalize to ensure the sum equals 1
const totalProb = ARRIVAL_PROBABILITIES.reduce((acc, val) => acc + val, 0);
const normalizedArrivalProbabilities = ARRIVAL_PROBABILITIES.map(
	(p) => p / totalProb
);

const CHARGING_NEEDS_PROBABILITIES = {
	5: 0.1,
	10: 0.3,
	15: 0.4,
	20: 0.2,
};

const randomChoice = (choices: Record<number, number>): number => {
	const sum = Object.values(choices).reduce((acc, prob) => acc + prob, 0);
	let rand = Math.random() * sum;
	for (const [value, prob] of Object.entries(choices)) {
		if (rand < prob) {
			return parseInt(value, 10);
		}
		rand -= prob;
	}
	return 0;
};
export const simulateCharging = (
	numChargePoints: number,
	arrivalMultiplier: number,
	carConsumption: number,
	chargingPower: number
): SimulationResult => {
	const chargepoints: ChargePoint[] = new Array(numChargePoints)
		.fill(null)
		.map(() => ({
			isOccupied: false,
			remainingChargeTime: 0,
		}));

	let totalEnergyConsumed = 0; // in kWh
	let actualMaxPowerDemand = 0; // in kW

	// Adjust probabilities based on arrivalMultiplier
	const adjustedArrivalProbabilities = normalizedArrivalProbabilities.map(
		(p) => p * arrivalMultiplier
	);

	for (let interval = 0; interval < TOTAL_INTERVALS; interval++) {
		// Calculate the probability of new arrivals
		const probArrival = adjustedArrivalProbabilities[interval % (24 * 4)];
		const numArrivals = Math.min(
			Math.floor(probArrival * numChargePoints),
			numChargePoints
		);

		for (let i = 0; i < numArrivals; i++) {
			const freeChargepoint = chargepoints.find((cp) => !cp.isOccupied);
			if (freeChargepoint) {
				const chargingNeed = randomChoice(CHARGING_NEEDS_PROBABILITIES);
				const chargingTime = Math.ceil(
					(chargingNeed / chargingPower) * 4
				); // Calculate charging time in 15-minute intervals
				freeChargepoint.isOccupied = true;
				freeChargepoint.remainingChargeTime = chargingTime;
				totalEnergyConsumed += chargingNeed;
			}
		}

		chargepoints.forEach((cp, index) => {
			if (cp.isOccupied) {
				cp.remainingChargeTime -= 1;
				if (cp.remainingChargeTime <= 0) {
					cp.isOccupied = false;
				}
			}
		});

		const currentPowerDemand =
			chargepoints.filter((cp) => cp.isOccupied).length * chargingPower;
		actualMaxPowerDemand = Math.max(
			actualMaxPowerDemand,
			currentPowerDemand
		);
	}

	const theoreticalMaxPowerDemand = numChargePoints * chargingPower;
	const concurrencyFactor =
		(actualMaxPowerDemand / theoreticalMaxPowerDemand) * 100;

	console.log(`Total Energy Consumed: ${totalEnergyConsumed.toFixed(2)} kWh`);
	console.log(
		`Theoretical Max Power Demand: ${theoreticalMaxPowerDemand} kW`
	);
	console.log(`Actual Max Power Demand: ${actualMaxPowerDemand} kW`);
	console.log(`Concurrency Factor: ${concurrencyFactor.toFixed(2)}%`);

	return {
		totalEnergyConsumed,
		theoreticalMaxPowerDemand,
		actualMaxPowerDemand,
		concurrencyFactor,
	};
};
