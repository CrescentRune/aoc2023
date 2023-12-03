import * as fs from 'fs';

type NumberToken = {
  re: RegExp;
  val: number;
}

const tokenRef = {
  n: {re: /\d/, val: 0},
  zero: {re: /zero/, val: 0},
  one: {re: /one/, val: 1},
  two: {re: /two/, val: 2},
  three: {re: /three/, val: 3},
  four: {re: /four/, val: 4},
  five: {re: /five/, val: 5},
  six: {re: /six/, val: 6},
  seven: {re: /seven/, val: 7},
  eight: {re: /eight/, val: 8},
  nine: {re: /nine/, val: 9},
} as const;

const objKeys = function <T extends Object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
};

function getFirstLastNumeral(line: string): [number, number] {
	let cursor = 0;
	let firstVal: number = 0;
	let lastVal: number = 0;
	const tokenKeys = objKeys(tokenRef);
	while (cursor !== line.length) {
		tokenKeys.forEach((key) => {
			const currToken = tokenRef[key];
			const searchSpace = line.substring(cursor, cursor + key.length);
			if (currToken.re.test(searchSpace)) {
				if (!firstVal) {
					firstVal = key === 'n' ? parseInt(searchSpace) : currToken.val; 
					lastVal = firstVal;
				} else {
					lastVal = key === 'n' ? parseInt(searchSpace) : currToken.val; 
				}
			}
		});
		cursor++;
	}

	return [firstVal, lastVal];
}

function calculateNumP1(line: string): number {
	let res = /^\D*(\d)(?:.*(\d)\D*|\D*)?$/.exec(line);


	if (!res) {
		return 0;
	}


	let numeral1 = res[1];
	let numeral2 = res[2] ?? numeral1;

	const value = parseInt(`${numeral1}${numeral2}`);
	return value;
}

function calculateNumP2(line: string): number {
	let sum = 0;
	let [numeral1, numeral2] = getFirstLastNumeral(line);
	return numeral1*10 + numeral2;
}



const lines = fs.readFileSync('./input', 'utf-8').split('\n');

let sum1 = 0;
let sum2 = 0;
lines.forEach((line: string) => {
	sum1 += calculateNumP1(line);
	sum2 += calculateNumP2(line);
});

console.log(`Part one: ${sum1}`);
console.log(`Part two: ${sum2}`);

