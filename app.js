"use strict";

const cellContainer = document.querySelector(".cell-container");
const newGameBtn = document.querySelector(".new-game-btn");
const cells = document.querySelectorAll("[id^=cell]");
const cellsArray = Array.from(cells);
const gameOverPanel = document.querySelector(".game-over");
const gameOverPanelText = document.querySelector(".game-over h1");
const lines = Array.from(document.querySelectorAll("[class^=line]"));
const column0 = Array.from(document.querySelectorAll(".column0"));
const column1 = Array.from(document.querySelectorAll(".column1"));
const column2 = Array.from(document.querySelectorAll(".column2"));
const columns = [column0, column1, column2];
const diagonal0 = Array.from(document.querySelectorAll("#cell0, #cell4, #cell8"));
const diagonal1 = Array.from(document.querySelectorAll("#cell2, #cell4, #cell6"));
const diagonalsArray = [diagonal0, diagonal1];
let freeIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let freeIndexesFiltered = [];
let userAsWinner = false;

newGameBtn.addEventListener("click", () => {
    newGameAction();
});

const resultWriter = (text, color) => {
    gameOverPanel.style.display = "block";
    gameOverPanelText.style.color = color;
    gameOverPanelText.textContent = text;
};

const cellColorizer = (array, winner) => {
    if (winner === "user") {
        array.map(cell => {
            cell.classList.remove("default-cell");
            cell.classList.add("user-won");
        }); 
    } else if (winner === "machine") {
        array.map(cell => {
            cell.classList.remove("default-cell");
            cell.classList.add("machine-won");
        }); 
    } else {
        array.map(cell => {
            cell.classList.remove("default-cell");
            cell.classList.add("tie-game");
        }); 
    }
};

const newGameAction = () => {
    cellsArray.map(item => {
        item.classList.remove("user-won", "machine-won", "tie-game");
        item.classList.add("default-cell");
        item.textContent = "";
    });
    freeIndexesFiltered = [];
    freeIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    gameOverPanel.style.display = "none";
    cellContainer.classList.remove("disable-cell-container");
    cellContainer.classList.add("enable-cell-container");
    userAsWinner = false;
};

const winnerSwitcher = (userwon, machinewon, array) => {
    if (userwon) {
        cellContainer.classList.remove("enable-cell-container");
        cellContainer.classList.add("disable-cell-container");
        cellColorizer(array, "user");
        resultWriter("Gratulálok! Győztél! 😇", "green");
        userAsWinner = true;
        return;
    }
    else if (machinewon) {
        cellContainer.classList.remove("enable-cell-container");
        cellContainer.classList.add("disable-cell-container");
        cellColorizer(array, "machine");
        resultWriter("Sajnos veszítettél! 😓", "red");
        return;
    }
};

const hitsChecker = (array, symbol) => array.every(cell => cell.textContent === symbol);

const linesChecker = () => {
    lines.forEach(line => {
        const lineCellsArray = Array.from(line.querySelectorAll("[id^=cell]"));
        winnerSwitcher(hitsChecker(lineCellsArray, "X"), hitsChecker(lineCellsArray, "0"), lineCellsArray);
    });
};

const columnsChecker = () => columns.forEach(column => winnerSwitcher(hitsChecker(column, "X"), hitsChecker(column, "0"), column));
const diagonalsChecker = () => diagonalsArray.forEach(diagonal => winnerSwitcher(hitsChecker(diagonal, "X"), hitsChecker(diagonal, "0"), diagonal));

const tieGameChecker = () => {
    if (cellsArray.every(item => item.textContent == "X" || item.textContent == "0")) {
        cellContainer.classList.remove("enable-cell-container");
        cellContainer.classList.add("disable-cell-container");
        cellColorizer(cellsArray, "tie");
        resultWriter("Ez a játszma döntetlen lett! 😝", "#DC9510");
    }
};

const randomChoice = {
    choices: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    filteredChoices: [],
    getRandomNumber: function () {
        if (freeIndexesFiltered.length !== 0) {
            return freeIndexesFiltered[Math.floor(Math.random() * freeIndexesFiltered.length)];
        } else {
            return freeIndexes[Math.floor(Math.random() * freeIndexes.length)];
        }
    },
    choice: function (choice = null, cellsArray = null) {
        if (choice !== null && cellsArray === null) {
            this.choices[choice] = null;
            this.filteredChoices = this.choices.filter(item => typeof item === "number");
        } else {
            let randomNumber = this.getRandomNumber();
            this.choices[randomNumber] = null;
            this.filteredChoices = this.choices.filter(item => typeof item === "number");
            freeIndexes[randomNumber] = null;
            freeIndexesFiltered = freeIndexes.filter(item => typeof item === "number");
            return randomNumber;
        }
    }
}

const winCheck = () => {
    linesChecker();
    if (!userAsWinner) columnsChecker();
    if (!userAsWinner) diagonalsChecker();
    if (!userAsWinner) tieGameChecker();
};

cellsArray.map((item, index) => {
    item.addEventListener("click", function () {
        if (item.textContent !== "X" && item.textContent !== "0") {
            item.textContent = "X";
            freeIndexes[index] = null;
            freeIndexesFiltered = freeIndexes.filter(item => typeof item === "number");
            randomChoice.choice(index);
            const freePosition = randomChoice.choice(null, cellsArray);
            winCheck();
            if ((!userAsWinner) && (freeIndexesFiltered.length >= 1)) {
                cellsArray[freePosition].textContent = "0";
                winCheck();
            }
        }
    });
});
