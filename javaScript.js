// Отримати елементи HTML за їхніми ідентифікаторами
let userName = document.getElementById("user-name");
let userScore = document.getElementById("user-score");
let userNumber = document.getElementById("user-number");
let computerScore = document.getElementById("computer-score");
let computerNumber = document.getElementById("computer-number");
let result = document.getElementById("result");


// Встановити початкові значення змінних
let userWins = 0; // Кількість перемог користувача
let computerWins = 0; // Кількість перемог комп'ютера
let maxWins = 3; // Максимальна кількість перемог для завершення гри
let gameEnded = false; // Прапорець, який вказує, чи закінчилася гра

// Запитати ім'я користувача і відобразити його на сторінці
let inputName = prompt("Введіть ваше ім'я:");
if (inputName) {
  userName.textContent = inputName;
} else {
  userName.textContent = "Гравець";
}

// Додати обробник події для кнопки "Грати"
function playGame() {
  // Перевірити, чи не закінчилася гра
  if (!gameEnded) {

    // Перевірити, чи досягнуто максимальної кількості перемог
    if (userWins === maxWins) {
      // Користувач виграв гру
      result.textContent = "Ви виграли гру!"; // Відобразити повідомлення про перемогу в грі
      gameEnded = true; // Встановити прапорець, що гра закінчилася
      playButton.disabled = true; // Вимкнути кнопку "Грати"
    } else if (computerWins === maxWins) {
      // Комп'ютер виграв гру
      result.textContent = "Ви програли гру!"; // Відобразити повідомлення про програш в грі
      gameEnded = true; // Встановити прапорець, що гра закінчилася
      playButton.disabled = true; // Вимкнути кнопку "Грати"
    }
    
    // Згенерувати випадкові числа для користувача і комп'ютера від 1 до 10
    let userRandom = Math.floor(Math.random() * 10) + 1;
    let computerRandom = Math.floor(Math.random() * 10) + 1;

    // Відобразити числа на сторінці
    userNumber.textContent = userRandom;
    computerNumber.textContent = computerRandom;

    // Порівняти числа і визначити переможця
    if (userRandom > computerRandom) {
      // Користувач переміг
      userWins++; // Збільшити кількість перемог користувача на 1
      userScore.textContent = userWins; // Відобразити кількість перемог користувача на сторінці
      result.textContent = "Ви виграли!"; // Відобразити повідомлення про перемогу
    } else if (userRandom < computerRandom) {
      // Комп'ютер переміг
      computerWins++; // Збільшити кількість перемог комп'ютера на 1
      computerScore.textContent = computerWins; // Відобразити кількість перемог комп'ютера на сторінці
      result.textContent = "Ви програли!"; // Відобразити повідомлення про програш
    } else {
      // Нічия
      result.textContent = "Нічия!"; // Відобразити повідомлення про нічию
    }
  }
};

