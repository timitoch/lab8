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
    document.getElementById("autoFillMatrix").style.display = "block";
    document.getElementById("calculate").style.display = "block";
    createMatrix();
    let criteriaInputContainer = document.getElementById("criteriaInputContainer");
    criteriaInputContainer.style.display = "none";
  });

  document.getElementById("autoFillMatrix").addEventListener("click", function () {
    //document.getElementById("autoFillMatrix").style.display = "none";
    autoFillMatrix();
  });
  
  document.getElementById("calculate").addEventListener("click", function () {
    document.getElementById("autoFillMatrix").style.display = "none";
    let criteriaNames = getCriteriasNames();
    let matrixValues = getMatrixValues();
    deleteMatrix();
    let eigenVector = calculateEigenVector(matrixValues);
    let priorityVector = calculatePriorityVector(eigenVector);
    let lambda = calculateLambda(priorityVector, matrixValues);
    calculate(criteriaNames, matrixValues, eigenVector, priorityVector, lambda);
       
    // Розрахунок ІУ та ВУ
    let n = parseInt(document.getElementById("numCriteria").value);
    let IU = calculateIU(lambda, n);
    let randomIndices = [0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49]; // Випадкова узгодженість для різних розмірів матриці
    let VU = calculateVU(IU, randomIndices, n - 1);

    // Розрахунок ВУ у відсотках нижче звичайного значення ВУ
    let VUPercentage = calculateVUPercentage(VU);
 
   // Виведення результатів під таблицею
   let resultsDiv = document.getElementById("resultsContainer");
   resultsDiv.innerHTML += `<p>ІУ: ${IU.toFixed(8).replace(/\.?0+$/, "")}</p>`;
   resultsDiv.innerHTML += `<p>ВУ: ${VU.toFixed(8).replace(/\.?0+$/, "")}</p>`;
   resultsDiv.innerHTML += `<p>ВУ у відсотках: ${VUPercentage}%</p>`;
  });

  };

  function showCriteriaInputs() {
    let numAlternatives = parseInt(document.getElementById("numAlternatives").value);
    let numCriteria = parseInt(document.getElementById("numCriteria").value);
    let criteriaInputContainer = document.getElementById("criteriaInputContainer");

    criteriaInputContainer.innerHTML = "";

    for (let i = 0; i < numCriteria; i++) {
        let input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Критерій ' + (i + 1);
        input.className = 'criteria-input';
        input.id = 'criteriaInput' + (i + 1); // Unique ID for each input
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
  

  // Отримати назви критеріїв з полів вводу
  let criteriaInputs = criteriaInputContainer.querySelectorAll('input[type="text"]');
  let criteriaNames = Array.from(criteriaInputs, (input, index) => input.value.trim() || 'Критерій ' + (index + 1));

  // Очистити контейнер перед створенням нової матриці
  while (matrixInputContainer.firstChild) {
    matrixInputContainer.removeChild(matrixInputContainer.firstChild);
  }

  // Створити нову таблицю для матриці
  let matrixTable = document.createElement("table");
  matrixInputContainer.appendChild(matrixTable);

  // Додати рядок заголовка
  let headerRow = matrixTable.insertRow();
  headerRow.insertCell(); // Порожня клітинка у лівому верхньому куті

  // Додати назви критеріїв до рядка заголовка
  for (let i = 0; i < criteriaNames.length; i++) {
    let headerCell = headerRow.insertCell();
    headerCell.innerText = criteriaNames[i];
  }


  
  // Додати рядки та стовпці для введення значень МПП
for (let i = 0; i < criteriaNames.length; i++) {
  let row = matrixTable.insertRow();

  // Додати назву критерію у лівий стовпець
  let firstCell = row.insertCell();
  firstCell.innerText = criteriaNames[i];

  for (let j = 0; j < criteriaNames.length; j++) {
    let cell = row.insertCell();
    if (i == j) {
      // Створити фіксований інпут для діагональних елементів
      let input = document.createElement('input');
      input.type = 'text';
      input.value = '1';
      input.readOnly = true;
      input.style.width = '50px'; // Встановити ширину для скорочення
      input.style.textAlign = 'center'; // Центрувати текст
      cell.appendChild(input);
    } else {
      let input = document.createElement('input');
      input.type = 'number';
      input.min = '1';
      input.max = '9';
      input.step = '1';
      input.dataset.row = i;
      input.dataset.col = j;
      input.className = 'matrix-input'; // Додати клас до поля вводу
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

  // Додати комірку для обчислених власних значень
  //let eigenCell = row.insertCell();
  //eigenCell.className = 'eigen-cell'; // Додати клас для стилізації
}



// Додати кнопку до контейнера для матриці
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

function calculate(criteriaNames, matrixValues, eigenVector, priorityVector, lambda) {
  let resultsTable = document.getElementById("results");
  resultsTable.innerHTML = ""; // Очистити попередні дані

  // Додати заголовок
  let headerRow = resultsTable.insertRow();
  headerRow.insertCell(); // Порожня клітинка у лівому верхньому куті

  // Додати назви критеріїв до рядка заголовка
  for (let i = 0; i < criteriaNames.length; i++) {
    let headerCell = headerRow.insertCell();
    headerCell.innerText = criteriaNames[i];
  }

  // Додати заголовки для власного вектора та вектора пріорітетів
  headerRow.insertCell().innerText = "Власний вектор";
  headerRow.insertCell().innerText = "Вектор пріорітетів";
  headerRow.insertCell().innerText = "Lambda";

  // Додати рядки та стовпці для введення значень МПП
  for (let i = 0; i < criteriaNames.length; i++) {
    let row = resultsTable.insertRow();

    // Додати назву критерію у лівий стовпець
    let firstCell = row.insertCell();
    firstCell.innerText = criteriaNames[i];

    // Додати значення МПП до відповідних клітинок
    for (let j = 0; j < criteriaNames.length; j++) {
      let cell = row.insertCell();
      //cell.innerText = matrixValues[i][j];
      cell.innerText = parseFloat(matrixValues[i][j]).toFixed(8).replace(/\.?0+$/, "");
    }

    // Додати значення власного вектора та вектора пріорітетів
    let eigenCell = row.insertCell();
    eigenCell.innerText = parseFloat(eigenVector[i]).toFixed(8).replace(/\.?0+$/, "");
    //eigenCell.innerText = limitText(eigenVector[i].toString());
    let priorityCell = row.insertCell();
    priorityCell.innerText = parseFloat(priorityVector[i]).toFixed(8).replace(/\.?0+$/, "");
    //priorityCell.innerText = limitText(priorityVector[i].toString());
    let lambdaCell = row.insertCell(); 
    lambdaCell.innerText = parseFloat(lambda[i]).toFixed(8).replace(/\.?0+$/, "");
    //lambdaCell.innerText = limitText(lambda[i].toString());
  }

  // Об'єднати matrixValues, eigenVector та priorityVector в один масив
  let combinedValues = matrixValues.map((row, i) => [...row, eigenVector[i], priorityVector[i], lambda[i]]);

  // Додати рядок для сум кожного стовпчика
  let sumRow = resultsTable.insertRow();
  let sumHeaderCell = sumRow.insertCell();
  sumHeaderCell.innerText = "Сума";

  // Обчислити суми кожного стовпчика і додати їх до рядка
for (let j = 0; j < criteriaNames.length + 3; j++) {
  let sum = 0;
  for (let i = 0; i < criteriaNames.length; i++) {
    sum += combinedValues[i][j];
  }
  let sumCell = sumRow.insertCell();
  sumCell.innerText = parseFloat(sum).toFixed(8).replace(/\.?0+$/, "");
  //sumCell.innerText = sum;
  //sumCell.innerText = limitText(sum.toString());
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

  // Calculate the sum of each column
  for (let j = 0; j < matrix[0].length; j++) {
      let columnSum = 0;
      for (let i = 0; i < matrix.length; i++) {
          columnSum += matrix[i][j];
      }
      columnSums.push(columnSum);
  }

  // Calculate λ 
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
  let index = randomIndices[n]; // Отримати випадковий індекс для даного розміру матриці
  return IU / index;
}

function calculateVUPercentage(VU) {
  let percentage = VU * 100;
  return percentage.toFixed(2);
}
