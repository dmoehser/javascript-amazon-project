// Calculate cost TK
let sumTk = (5354.97 * 100) / 100;
let healthCostTk = (sumTk * 0.1705) / 2;
let healthCostSumTk = parseFloat(healthCostTk.toFixed(2));

// Calculate cost BKK Pfalz
let sumBkk = (5354.97 * 100) / 100;
let healthCostBkk = (sumBkk * 0.1850) / 2;
let healthCostSumBkk = parseFloat(healthCostBkk.toFixed(2));


// Calculate Difference
let diff = healthCostSumBkk - healthCostSumTk;
let diffSum = parseFloat(diff.toFixed(2));

// Alert
alert(`Dein Beitrag in der TK Versicherung ist: ` + healthCostSumTk + ` EUR.\nDein Beitrag in der BKK Pflaz Versicherung ist: ` + healthCostSumBkk + ` EUR.\n\nEin Unterschied von: ` + diffSum + ` EUR.`);

