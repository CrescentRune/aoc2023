import * as fs from 'fs';

function parseRound(round: string): [number, number, number] {
	let redRes = /(\d+) red/.exec(round);
	let greenRes = /(\d+) green/.exec(round);
	let blueRes = /(\d+) blue/.exec(round);

	return [
		redRes && redRes[1] ? parseInt(redRes[1]) : 0,
		greenRes && greenRes[1] ? parseInt(greenRes[1]) : 0,
		blueRes && blueRes[1] ? parseInt(blueRes[1]) : 0
	];
}

function parseGame(game: string): [number, number, number, number, number] | undefined {
	let res = /^Game (\d+): (.*)$/.exec(game);
	if (!res) return;
	let gameNum = parseInt(res[1]);
	
	let rounds = res[2].split(';');

	let minRed = 0, minGreen = 0, minBlue = 0;
	rounds.forEach((round) => {
		const roundRes = parseRound(round);
		if (roundRes[0] > minRed) {
			minRed = roundRes[0];
		}
		if (roundRes[1] > minGreen) {
			minGreen = roundRes[1];
		}
		if (roundRes[2] > minBlue) {
			minBlue = roundRes[2];
		}
	});

	return [gameNum, minRed, minGreen, minBlue, minRed * minGreen * minBlue];
}

function isGamePossible(maxes: [number, number, number], redCount: number, greenCount: number, blueCount: number): boolean {
	return maxes[0] >= redCount && maxes[1] >= greenCount && maxes[2] >= blueCount;
}

function evaluateGames(fileName: string, redCount: number, blueCount: number, greenCount: number): [number, number] {
	const lines = fs.readFileSync(fileName, 'utf-8').split('\n');

	const maxes: [number, number, number] = [redCount, blueCount, greenCount];

	let possibleSum = 0;
	let powerSum = 0;
	lines.forEach((line) => {
		const gameRes = parseGame(line);
		if (gameRes) {
			const gameIsPossible = isGamePossible(maxes, gameRes[1], gameRes[2], gameRes[3]);	
			if (gameIsPossible) {
				possibleSum += gameRes[0];
			}
			powerSum += gameRes[4];
		}
	});

	return [possibleSum, powerSum];
}


const gameResult = evaluateGames('./input', 12, 13, 14);
console.log(`Sum of possible games: ${gameResult[0]}`);
console.log(`Sum of the power of all games: ${gameResult[1]}`);

