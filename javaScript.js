window.onload = function () {
  document.getElementById("nextBtn").addEventListener("click", function () {
    showCriteriaInputs();
    document.getElementById("autoFillCriteria").style.display = "block";
    let initialInputs = document.getElementById("initialInputs");
    initialInputs.style.display = "none";
  });
  
  document.getElementById("autoFillCriteria").addEventListener("click", function () {
    autoFillCriteria();
  });

  document.getElementById("createMatrix").addEventListener("click", function () {
    document.getElementById("autoFillCriteria").style.display = "none";
    document.getElementById("createMatrix").style.display = "none";
    document.getElementById("criteriaInputContainer").style.display = "none";
    document.getElementById("calculate").style.display = "block";
    document.getElementById("autoFillMatrix").style.display = "block";
    createMatrix();
    let criteriaInputContainer = document.getElementById("criteriaInputContainer");
    criteriaInputContainer.style.display = "none";
  });

  document.getElementById("autoFillMatrix").addEventListener("click", function () {
    //document.getElementById("autoFillMatrix").style.display = "none";
    autoFillMatrix();
  });
  
  let priorityVectorsForCriterias = {}; 

document.getElementById("calculate").addEventListener("click", function (event) {
  document.getElementById("autoFillMatrix").style.display = "none";
  document.getElementById("calculate").style.display = "none";
  document.getElementById("nextA").style.display = "block";
  let criteriaNames = getCriteriasNames();
  let matrixValues = getMatrixValues();
  deleteMatrix();
  let eigenVector = calculateEigenVector(matrixValues);
  let priorityVector = calculatePriorityVector(eigenVector);
  let lambda = calculateLambda(priorityVector, matrixValues);
  calculate(criteriaNames, matrixValues, eigenVector, priorityVector, lambda);

  let n = parseInt(document.getElementById("numCriteria").value);
  let IU = calculateIU(lambda, n);
  let randomIndices = [0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49]; 
  let VU = calculateVU(IU, randomIndices, n - 1);
  let VUPercentage = calculateVUPercentage(VU);

  if (VUPercentage < 0 || VUPercentage > 10) {
      alert("Відсоток BУ виходить за межі від 0 до 10!");
      event.preventDefault(); 
      document.getElementById("autoFillMatrix").style.display = "block"; 
      document.getElementById("calculate").style.display = "block";
      document.getElementById("autoFillMatrix").style.display = "block";
      document.getElementById("resultsContainer").style.display = "none";
      document.getElementById("nextA").style.display = "none";
      createMatrix();
      return; 
  }

  let resultsDiv = document.getElementById("resultsContainer");
  resultsDiv.innerHTML += `<p>ІУ: ${IU.toFixed(8).replace(/\.?0+$/, "")}</p>`;
  resultsDiv.innerHTML += `<p>ВУ: ${VU.toFixed(8).replace(/\.?0+$/, "")}</p>`;
  resultsDiv.innerHTML += `<p>ВУ у відсотках: ${VUPercentage}%</p>`;
});

  document.getElementById("nextA").addEventListener("click", function () {
    showAltInputs();
    document.getElementById("resultsContainer").style.display = "none";
    document.getElementById("nextA").style.display = "none";
    document.getElementById("autoFillAlt").style.display = "block";
    document.getElementById("createMatrixAlt").style.display = "block";
    let initialInputsAlt = document.getElementById("initialInputsAlt");
    initialInputsAlt.style.display = "none";
  });

  document.getElementById("autoFillAlt").addEventListener("click", function () {
    autoFillAlt();
  });

  document.getElementById("createMatrixAlt").addEventListener("click", function () {
    document.getElementById("autoFillAlt").style.display = "none";
    document.getElementById("createMatrixAlt").style.display = "none";
    document.getElementById("AltInputContainer").style.display = "none";
    document.getElementById("calculateAlt").style.display = "block";
    //document.getElementById("autoFillMatrixAlternative").style.display = "block";
    createMatrixAlt();
    let AltInputContainer = document.getElementById("AltInputContainer");
    AltInputContainer.style.display = "none";
  });

  document.getElementById("autoFillMatrixAlternative").addEventListener("click", function () {
    //autoFillMatrixAlternative();
  });

  document.getElementById("calculateAlt").addEventListener("click", function () {
    document.getElementById("autoFillMatrixAlternative").style.display = "none";
    document.getElementById("calculateAlt").style.display = "none";
    //document.getElementById("nextA").style.display = "block";
    calculateAlt();
    document.getElementById("calculateEnd").style.display = "block";
  });

  document.getElementById("calculateEnd").addEventListener("click", function () {
    document.getElementById("matrixInputContainerAlt").style.display = "none";
    let calculateEndContainer = document.getElementById("calculateEndContainer");
  calculateEndContainer.style.display = "block";
    document.getElementById("calculateEnd").style.display = "none";
    calculateEnd();
  });
  };

  function showAltInputs() {
    let numAlts = parseInt(document.getElementById("numAlts").value);
    let AltInputContainer = document.getElementById("AltInputContainer");
    AltInputContainer.innerHTML = "";

    let AltNames = getAltNames();

    for (let i = 0; i < numAlts; i++) {
        let input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Альтернатива ' + (i + 1);
        input.className = 'Alt-input';
        input.id = 'AltInput' + (i + 1); 
        AltInputContainer.appendChild(input);
    }
    document.getElementById("nextBtn").style.display = "none";
    document.getElementById("createMatrixAlt").style.display = "block";
}

  function autoFillAlt() {
    let Alt = ["iPhone 13 Pro", "Samsung Galaxy S21", "Google Pixel 6", "Xiaomi Mi 11", "OnePlus 9"];
    let AltInputs = document.getElementById("AltInputContainer").querySelectorAll('input[type="text"]');
  
    for (let i = 0; i < AltInputs.length; i++) {
      AltInputs[i].value = Alt[i] || '';
    }
  }

 let matrices = {}; 
function createMatrixAlt() {
  let numAlts = parseInt(document.getElementById("numAlts").value);
  let numCriteria = parseInt(document.getElementById("numCriteria").value);
  let matrixInputContainerAlt = document.getElementById("matrixInputContainerAlt");
  matrixInputContainerAlt.innerHTML = ""; 
  let altNames = getAltNames(); 
  let criteriaNames = getCriteriasNames();

  for (let i = 0; i < numCriteria; i++) {

    let criteriaHeader = document.createElement('div');
    criteriaHeader.textContent = 'Показники для МПП альтернатив по відношенню критерію ' + criteriaNames[i];
    matrixInputContainerAlt.appendChild(criteriaHeader);

    let matrixContainer = document.createElement('div');
    matrixContainer.id = 'matrix' + (i + 1); 
    matrixInputContainerAlt.appendChild(matrixContainer);

    let matrix = document.createElement('table');
    matrixContainer.appendChild(matrix);

    matrices['matrix' + (i + 1)] = matrix; 

    let headerRow = document.createElement('tr');
    matrix.appendChild(headerRow);
    headerRow.appendChild(document.createElement('th')); 
    for (let j = 0; j < numAlts; j++) {
      let th = document.createElement('th');
      th.textContent = altNames[j];
      headerRow.appendChild(th);
    }

    for (let j = 0; j < numAlts; j++) {
      let row = document.createElement('tr');
      matrix.appendChild(row);

      
      let th = document.createElement('th');
      th.textContent = altNames[j];
      row.appendChild(th);

      for (let k = 0; k < numAlts; k++) {
        let cell = document.createElement('td');
        row.appendChild(cell);

        if (j == k) {
          let input = document.createElement('input');
          input.type = 'text';
          input.value = '1';
          input.readOnly = true;
          input.style.width = '50px';
          input.style.textAlign = 'center'; 
          cell.appendChild(input);
        } else {
          let input = document.createElement('input');
          input.type = 'number';
          input.min = '1';
          input.max = '9';
       
          cell.appendChild(input);

         
          input.addEventListener('input', function () {
            let reciprocal = 1 / this.value;
          
            let reciprocalCell = matrix.rows[k + 1].cells[j + 1]; 
            if (reciprocalCell.firstChild) {
              reciprocalCell.firstChild.value = reciprocal.toFixed(8).replace(/\.?0+$/, "");
            }
          });
        }
      }
    }
  }

  document.getElementById("matrixInputContainerAlt").style.display = "block";
}

let columnSums = {}; 
let eigenVectors = {}; 
let priorityVectors = {}; 
let lambdaAlts = {}; 
let IUs = {}; 
let VUs = {}; 
let randomIndices = [0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49]; 

function calculateAlt() {
  let numCriteria = parseInt(document.getElementById("numCriteria").value);
  let numAlts = parseInt(document.getElementById("numAlts").value); 

  for (let i = 0; i < numCriteria; i++) {
    let matrix = matrices['matrix' + (i + 1)]; 

let sums = new Array(numAlts).fill(0);
for (let j = 1; j < matrix.rows.length; j++) { 
  for (let k = 1; k <= numAlts; k++) { 
    let cell = matrix.rows[j].cells[k];
    if (cell.firstChild && cell.firstChild.tagName === 'INPUT') {
      let value = parseFloat(cell.firstChild.value) || 1;
      sums[k - 1] += value;
      cell.innerHTML = value.toFixed(8).replace(/\.?0+$/, ""); 
    }
  }
}

columnSums['matrix' + (i + 1)] = sums; 


let sumRow = document.createElement('tr');
matrix.appendChild(sumRow);
let sumLabel = document.createElement('td');
sumLabel.textContent = "Сума";
sumRow.appendChild(sumLabel);
for (let j = 0; j < numAlts; j++) {
  let cell = document.createElement('td');
  sumRow.appendChild(cell);
  cell.textContent = sums[j].toFixed(8).replace(/\.?0+$/, ""); 
}

    let matrixValues = Array.from(matrix.rows).slice(1, numAlts + 1).map(row => Array.from(row.cells).slice(1, numAlts + 1).map(cell => parseFloat(cell.textContent)));
    let eigenVector = calculateAltEigenVector(matrixValues);
    eigenVectors['matrix' + (i + 1)] = eigenVector; 

    let thForEV = document.createElement('th');
    thForEV.textContent = "Власний вектор";
    matrix.rows[0].appendChild(thForEV); 
    for (let j = 0; j < numAlts; j++) {
      let cell = matrix.rows[j + 1].insertCell(-1); 
      cell.textContent = eigenVector[j].toFixed(8).replace(/\.?0+$/, "");
    }
    let sumCellForEV = sumRow.insertCell(-1);
    sumCellForEV.textContent = eigenVector.reduce((a, b) => a + b, 0).toFixed(8).replace(/\.?0+$/, ""); 
 
    let priorityVectorAlt = calculateAltPriorityVector(eigenVector);
    priorityVectors['matrix' + (i + 1)] = priorityVectorAlt; 
  
    let thForPV = document.createElement('th');
    thForPV.textContent = "Вектор приоритетів";
    matrix.rows[0].appendChild(thForPV); 
    for (let j = 0; j < numAlts; j++) {
      let cell = matrix.rows[j + 1].insertCell(-1); 
      cell.textContent = priorityVectorAlt[j].toFixed(8).replace(/\.?0+$/, "");
    }
    let sumCellForPV = sumRow.insertCell(-1);
    sumCellForPV.textContent = priorityVectorAlt.reduce((a, b) => a + b, 0).toFixed(8).replace(/\.?0+$/, ""); 

    let lambdaAlt = calculateAltLambda(priorityVectorAlt, matrixValues);
    lambdaAlts['matrix' + (i + 1)] = lambdaAlt; 
  
    let thForLambda = document.createElement('th');
    thForLambda.textContent = "Лямбда";
    matrix.rows[0].appendChild(thForLambda); 
    for (let j = 0; j < numAlts; j++) {
      let cell = matrix.rows[j + 1].insertCell(-1); 
      cell.textContent = lambdaAlt[j].toFixed(8).replace(/\.?0+$/, "");
    }
    let sumCellForLambda = sumRow.insertCell(-1);
    sumCellForLambda.textContent = lambdaAlt.reduce((a, b) => a + b, 0).toFixed(8).replace(/\.?0+$/, ""); // Сума лямбди

    let IU = calculateAltIU(lambdaAlt, numAlts);
    IUs['matrix' + (i + 1)] = IU; 
  
    let IUContainer = document.createElement('p');
    IUContainer.textContent = "ІУ: " + IU.toFixed(8).replace(/\.?0+$/, "");
    matrix.parentNode.appendChild(IUContainer); 

    let VU = calculateAltVU(IUs['matrix' + (i + 1)], randomIndices, numAlts);
    VUs['matrix' + (i + 1)] = VU; 

    let VUContainer = document.createElement('p');
    VUContainer.textContent = "ВУ: " + VU.toFixed(8).replace(/\.?0+$/, "");
    matrix.parentNode.appendChild(VUContainer); 

    let VUPercent = VU * 100;
    if (VUPercent < 0 || VUPercent > 10) {
      alert('ВУ у відсотках виходить за межі 0-10%');
    }

    let VUPercentContainer = document.createElement('p');
    VUPercentContainer.textContent = "ВУ у відсотках: " + VUPercent.toFixed(2).replace(/\.?0+$/, "") + "%";
    matrix.parentNode.appendChild(VUPercentContainer); 
  }
}

function calculateAltEigenVector(matrix) {
  let eigenVectorSAlt = matrix.map(row => {
    let product = row.reduce((a, b) => a * b, 1);
    return Math.pow(product, 1 / row.length);
  });
  return eigenVectorSAlt;
}

function calculateAltPriorityVector(eigenVectorSAlt) {
  let sum = eigenVectorSAlt.reduce((a, b) => a + b, 0);
  let priorityVectorAlt = eigenVectorSAlt.map(v => v / sum);
  return priorityVectorAlt;
}

function calculateAltLambda(priorityVectorAlt, matrix) {
  let lambdaAlt = [];
  let columnSumsAlt = [];

 
  for (let j = 0; j < matrix[0].length; j++) {
      let columnSum = 0;
      for (let i = 0; i < matrix.length; i++) {
          columnSum += matrix[i][j];
      }
      columnSumsAlt.push(columnSum);
  }

  for (let i = 0; i < columnSumsAlt.length; i++) {
    lambdaAlt.push(columnSumsAlt[i] * priorityVectorAlt[i]);
  }

  return lambdaAlt;
}

function calculateAltIU(lambdaAlt, n) {
  let sumlambdaAlt = lambdaAlt.reduce((a, b) => a + b, 0);
  return (sumlambdaAlt - n) / (n - 1);
}

function calculateAltVU(IU, randomIndices, n) {
  let index = randomIndices[n - 1]; 
  return IU / index;
}
    
function calculateEnd() {
  let outputContainer = document.getElementById("calculateEndContainer"); 
  let altNames = getAltNames(); 

  if (!altNames || altNames.length !== priorityVectors['matrix1'].length) {
    console.error('Помилка: getAltNames() повернула неправильну кількість назв альтернатив');
    return;
  }

  let numAlts = priorityVectors['matrix1'].length; 
  let bestAltName = altNames[0];
  let bestAltValue = 0;
  let allValuesEqual = true;
  let previousSum = null;
  for (let i = 0; i < numAlts; i++) {
    let sum = 0;
    for (let matrix in priorityVectors) {
      let matrixValue = priorityVectors[matrix][i]; 
      let criteriaValue = priorityVectorsForCriterias['criteria' + (parseInt(matrix.replace('matrix', '')))]; 
      sum += matrixValue * criteriaValue;
    }
    let p = document.createElement('p');
    p.textContent = altNames[i] + " = " + sum.toFixed(8).replace(/\.?0+$/, "");
    outputContainer.appendChild(p); 

    if (sum > bestAltValue) {
      bestAltValue = sum;
      bestAltName = altNames[i];
    }

    if (previousSum !== null && sum !== previousSum) {
      allValuesEqual = false;
    }
    previousSum = sum;
  }

  let p = document.createElement('p');
  if (allValuesEqual) {
    p.textContent = "Всі значення рівні.";
  } else {
    p.innerHTML = "<strong>Краща альтернатива: " + bestAltName + " зі значенням " + bestAltValue.toFixed(8).replace(/\.?0+$/, "") + "</strong>";
  }
  outputContainer.appendChild(p); 
}



function getAltNames() {
  let AltInputs = document.getElementById("AltInputContainer").querySelectorAll('input[type="text"]');
  return Array.from(AltInputs, (input, index) => input.value.trim() || 'Альтернатива ' + (index + 1));
}
function displayPriorityVectorValues(priorityVectorsForCriterias) {

  for (let i = 0; i < priorityVectorsForCriterias.length; i++) {

      let priorityValue = priorityVector[i].toFixed(8).replace(/\.?0+$/, "");
      calculateEndContainer.innerHTML += `<p>Priority Vector Criteria ${i + 1}: ${priorityValue}</p>`;
  }
}

  //_________________________________________________для критеріїв_______________________________________________________________



function showCriteriaInputs() {
    let numAlts = parseInt(document.getElementById("numAlts").value);
    let numCriteria = parseInt(document.getElementById("numCriteria").value);
    let criteriaInputContainer = document.getElementById("criteriaInputContainer");

    criteriaInputContainer.innerHTML = "";

    let criteriaNames = getCriteriasNames();

    for (let i = 0; i < numCriteria; i++) {
        let input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Критерій ' + (i + 1);
        input.className = 'criteria-input';
        input.id = 'criteriaInput' + (i + 1); 
        criteriaInputContainer.appendChild(input);
    }

    document.getElementById("nextBtn").style.display = "none";
    document.getElementById("createMatrix").style.display = "block";
}

function autoFillCriteria() {
  let criteria = ["Ціна (грн)", "Частота процесора (ГГц)", "Ємність акумулятора (мАг)", "Вага (г)", "Основна камера (МП)", "Передня камера (МП)"];
  let criteriaInputs = document.getElementById("criteriaInputContainer").querySelectorAll('input[type="text"]');
  for (let i = 0; i < criteriaInputs.length; i++) {
    criteriaInputs[i].value = criteria[i] || '';
  }
}

function createMatrix() {
  
  let criteriaInputContainer = document.getElementById("criteriaInputContainer");
  let matrixInputContainer = document.getElementById("matrixInputContainer");
  document.getElementById("matrixInputContainer").style.display = "block";
  

  let criteriaInputs = criteriaInputContainer.querySelectorAll('input[type="text"]');
  let criteriaNames = Array.from(criteriaInputs, (input, index) => input.value.trim() || 'Критерій ' + (index + 1));

  while (matrixInputContainer.firstChild) {
    matrixInputContainer.removeChild(matrixInputContainer.firstChild);
  }

  let matrixTable = document.createElement("table");
  matrixInputContainer.appendChild(matrixTable);

  let headerRow = matrixTable.insertRow();
  headerRow.insertCell(); 

  for (let i = 0; i < criteriaNames.length; i++) {
    let headerCell = headerRow.insertCell();
    headerCell.innerText = criteriaNames[i];
  }

for (let i = 0; i < criteriaNames.length; i++) {
  let row = matrixTable.insertRow();

  let firstCell = row.insertCell();
  firstCell.innerText = criteriaNames[i];

  for (let j = 0; j < criteriaNames.length; j++) {
    let cell = row.insertCell();
    if (i == j) {
      let input = document.createElement('input');
      input.type = 'text';
      input.value = '1';
      input.readOnly = true;
      input.style.width = '50px'; 
      input.style.textAlign = 'center'; 
      cell.appendChild(input);
    } else {
      let input = document.createElement('input');
      input.type = 'number';
      input.min = '1';
      input.max = '9';
      input.step = '1';
      input.dataset.row = i;
      input.dataset.col = j;
      input.className = 'matrix-input'; 
      input.addEventListener('input', function () {
        let inverseCell = matrixTable.rows[j + 1].cells[i + 1];
        if (this.value != 0) {
          inverseCell.querySelector('input').value = 1 / this.value;
        } else {
          inverseCell.querySelector('input').value = '';
        }
      });
      cell.appendChild(input);
    }
  }
}
matrixInputContainer.appendChild(calculateBtn);
}

function autoFillMatrix() {
  let matrixTable = document.querySelector('table');
  let values = [
    [1, 4, 2, 3, 0.2, 0.2],
    [0.25, 1, 0.5, 1, 1 / 6, 1 / 6],
    [0.5, 2, 1, 2, 0.5, 0.5],
    [1 / 3, 1, 0.5, 1, 0.25, 0.25],
    [5, 6, 2, 4, 1, 2],
    [5, 6, 2, 4, 0.5, 1]
  ];

  for (let i = 0; i < values.length; i++) {
    for (let j = 0; j < values[i].length; j++) {
      let input = matrixTable.rows[i + 1].cells[j + 1].querySelector('input');
      input.value = values[i][j];
    }
  }
}

function getCriteriasNames() {
  let criteriaInputs = document.getElementById("criteriaInputContainer").querySelectorAll('input[type="text"]');
  return Array.from(criteriaInputs, (input, index) => input.value.trim() || 'Критерій ' + (index + 1));
}

function getMatrixValues() {
  let matrixTable = document.getElementById("matrixInputContainer").querySelector('table');
  let matrixValues = [];

  for (let i = 1; i < matrixTable.rows.length; i++) {
    let rowValues = [];
    for (let j = 1; j < matrixTable.rows[i].cells.length; j++) {
      let input = matrixTable.rows[i].cells[j].querySelector('input');
      rowValues.push(parseFloat(input.value) || 1);
    }
    matrixValues.push(rowValues);
  }

  return matrixValues;
}
let priorityVectorsForCriterias = {};
function calculate(criteriaNames, matrixValues, eigenVector, priorityVector, lambda) {
  let resultsTable = document.getElementById("results");
  resultsTable.innerHTML = ""; 

  
  let headerRow = resultsTable.insertRow();
  headerRow.insertCell(); 

  for (let i = 0; i < criteriaNames.length; i++) {
    let headerCell = headerRow.insertCell();
    headerCell.innerText = criteriaNames[i];
  }

  headerRow.insertCell().innerText = "Власний вектор";
  headerRow.insertCell().innerText = "Вектор пріорітетів";
  headerRow.insertCell().innerText = "λ max";

  for (let i = 0; i < criteriaNames.length; i++) {
    let row = resultsTable.insertRow();

    let firstCell = row.insertCell();
    firstCell.innerText = criteriaNames[i];

    for (let j = 0; j < criteriaNames.length; j++) {
      let cell = row.insertCell();
      cell.innerText = parseFloat(matrixValues[i][j]).toFixed(8).replace(/\.?0+$/, "");
    }

  for (let i = 0; i < priorityVector.length; i++) {
    priorityVectorsForCriterias['criteria' + (i + 1)] = priorityVector[i];
  }
    let eigenCell = row.insertCell();
    eigenCell.innerText = parseFloat(eigenVector[i]).toFixed(8).replace(/\.?0+$/, "");
    let priorityCell = row.insertCell();
    priorityCell.innerText = parseFloat(priorityVector[i]).toFixed(8).replace(/\.?0+$/, "");
    let lambdaCell = row.insertCell(); 
    lambdaCell.innerText = parseFloat(lambda[i]).toFixed(8).replace(/\.?0+$/, "");
  }

  let combinedValues = matrixValues.map((row, i) => [...row, eigenVector[i], priorityVector[i], lambda[i]]);

  let sumRow = resultsTable.insertRow();
  let sumHeaderCell = sumRow.insertCell();
  sumHeaderCell.innerText = "Сума";

for (let j = 0; j < criteriaNames.length + 3; j++) {
  let sum = 0;
  for (let i = 0; i < criteriaNames.length; i++) {
    sum += combinedValues[i][j];
  }
  let sumCell = sumRow.insertCell();
  sumCell.innerText = parseFloat(sum).toFixed(8).replace(/\.?0+$/, "");
}


}

function deleteMatrix() {
  let resultsContainer = document.getElementById("resultsContainer");
  let matrixInputContainer = document.getElementById("matrixInputContainer");
  resultsContainer.style.display = "block";
  matrixInputContainer.style.display = "none";
}

function calculateEigenVector(matrix) {
  let eigenVectors = matrix.map(row => {
    let product = row.reduce((a, b) => a * b, 1);
    return Math.pow(product, 1 / row.length);
  });
  return eigenVectors;
}

function calculatePriorityVector(eigenVectors) {
  let sum = eigenVectors.reduce((a, b) => a + b, 0);
  let priorityVector = eigenVectors.map(v => v / sum);
  return priorityVector;
}

function calculateLambda(priorityVector, matrix) {
  let lambda = [];
  let columnSums = [];

  for (let j = 0; j < matrix[0].length; j++) {
      let columnSum = 0;
      for (let i = 0; i < matrix.length; i++) {
          columnSum += matrix[i][j];
      }
      columnSums.push(columnSum);
  }

  // λ 
  for (let i = 0; i < columnSums.length; i++) {
      lambda.push(columnSums[i] * priorityVector[i]);
  }

  return lambda;
}

function calculateIU(lambda, n) {
  let sumLambda = lambda.reduce((a, b) => a + b, 0);
  return (sumLambda - n) / (n - 1);
}

function calculateVU(IU, randomIndices, n) {
  let index = randomIndices[n]; 
  return IU / index;
}

function calculateVUPercentage(VU) {
  let percentage = VU * 100;
  return percentage.toFixed(2);
}

