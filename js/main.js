'use strict';

var gBoard;
var gLevel = {
    SIZE: 4,
    MINES: 2,
};
var gGame;
var gUnshownCell;
var gIsHint;
var gHints;
var gImgIdx;
var gSmileyies;
var gInterval;
var gTotalSeconds;
var gTime;
innit()


function innit() {
    gSmileyies = {
        oSmiley: `<img src="images/osmiley.jpg"></img>`,
        hSmiley: `<img src="images/hsmiley.jpg"></img>`,
        sSmiley: `<img src="images/ssmiley.jpg"></img>`,
    };
    gIsHint = false;
    gHints = [true, true, true];

    gGame = {
        isOn: false,
        shownCount: 0,
        markedMineCount: 0,
    }
    gBoard = getBoard();
    renderBoard(gBoard);
    console.table(gBoard);
    if (gInterval) {
        gInterval = clearInterval;
    }
    document.querySelector(".smiley").innerHTML = gSmileyies.oSmiley;
}












function getBoard() {
    var board = [];
    console.log("glevel size :", gLevel.SIZE);
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = {
                isShown: false,
                isMine: false,
                mineCountNeg: 0,
                isFlagged: false,
                isMineCounted: false,
            }

            board[i][j] = cell;

        }

    }
    return board;
}


function renderBoard(board) {
    var strHtml = '';
    var tdId;
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        strHtml += '<tr>';
        for (var j = 0; j < row.length; j++) {
            var cell = row[j];
            gUnshownCell = "O";
            tdId = `cell-${i}-${j}`;
            strHtml += `<td id="${tdId}" class="cell" oncontextmenu="markCell(this)" onclick="cellClicked(this)" data-i="${i}" data-j="${j}"">
                            ${gUnshownCell}
                        </td>`;
        }
        strHtml += '</tr>';
    }
    var elMat = document.querySelector('.mine-board');
    elMat.innerHTML = strHtml;
}

function getMineNegs(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            checkNegs(i, j);
        }
    }

}

function checkNegs(posI, posJ) {

    for (var i = posI - 1; i <= posI + 1; i++) {
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (i < 0 || i >= gBoard.length || j < 0 || j >= gBoard.length) continue;
            if (posI === i && posJ === j) continue;

            if (gBoard[i][j].isMine === true) {

                gBoard[posI][posJ].mineCountNeg++;
            }
        }
    }

}

function cellClicked(elcell) {
    var dataSet = elcell.dataset;
    var posI = +dataSet.i;
    var posJ = +dataSet.j;

    console.log(gImgIdx);
    if (!gHints[gImgIdx] || !gIsHint) {
        if (!gGame.isOn) {
            startTime()
        }



        if (!gBoard[posI][posJ].isFlagged && !gBoard[posI][posJ].isCounted) {
            gBoard[posI][posJ].isShown = true;
            elcell.classList.remove("cell")
            elcell.classList.add("emptycell")
            gGame.shownCount++;
            gBoard[posI][posJ].isCounted = true;
            console.log(gGame.shownCount);
        }

        if (gBoard[posI][posJ].isFlagged === false) {
            if (gBoard[posI][posJ].isMine === true) {
                lose()
            } else if (!gBoard[posI][posJ].isMine && gBoard[posI][posJ].mineCountNeg === 0 && gGame.isOn) {
                openNegs(elcell)

            } else if (gBoard[posI][posJ].mineCountNeg !== 0) {
                elcell.innerText = gBoard[posI][posJ].mineCountNeg;
            } else if (!gGame.isOn) {
                getRandomMines(posI, posJ);
                getMineNegs(gBoard);
                elcell.innerText = gBoard[posI][posJ].mineCountNeg;
                gGame.isOn = true;
            }


        }

        win()
    } else if (gIsHint && gHints[gImgIdx]) {
        console.log("is");
        hintAction(elcell)
        gHints[gImgIdx] = false;
        gIsHint = false;
    }
}

function getRandomMines(posI, posJ) {
    var count = 1;
    var loc = getRandomMineIdx(0, gBoard.length - 1)

    gBoard[loc.i][loc.j].isMine = true;

    while (count < gLevel.MINES) {
        loc = getRandomMineIdx(0, gBoard.length - 1)
        if (!gBoard[loc.i][loc.j].isMine) {
            if (loc.i !== posI || loc.j !== posJ) {
                count++
                gBoard[loc.i][loc.j].isMine = true;
            }
        }

    }




}

function getRandomMineIdx(min, max) {
    var i = Math.floor(Math.random() * (max - min + 1)) + min;
    var j = Math.floor(Math.random() * (max - min + 1)) + min;


    var loc = {
        i: i,
        j: j,
    }
    return loc
}