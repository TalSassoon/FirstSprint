'use strict';


function startTime() {
    var minutesLabel = document.getElementById("minutes");
    var secondsLabel = document.getElementById("seconds");
    gTotalSeconds = 0;
    gInterval = setInterval(setTime, 1000);
    gTime = [secondsLabel, minutesLabel]

}

function setTime() {

    ++gTotalSeconds;
    gTime[0].innerHTML = pad(gTotalSeconds % 60);
    gTime[1].innerHTML = pad(parseInt(gTotalSeconds / 60));

}

function pad(val) {
    var valString = val + "";


    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }

}

function markCell(elcell) {

    var dataSet = elcell.dataset;
    var posI = +dataSet.i;
    var posJ = +dataSet.j;
    var cell = gBoard[posI][posJ]

    if (!cell.isFlagged && !cell.isShown) {
        cell.isFlagged = true;
        elcell.innerText = "🚩";
        elcell.classList.remove("cell")
        elcell.classList.add("emptycell")
        if (cell.isMine && !cell.isMineCounted) {
            cell.isMineCounted = true;
            gGame.markedMineCount++;
            console.log(gGame.markedMineCount);
        }

    } else if (cell.isFlagged) {
        cell.isFlagged = false;
        elcell.innerText = "O"
        elcell.classList.remove("emptycell")
        elcell.classList.add("cell")
        if (cell.isMine && cell.isMineCounted) {
            cell.isMineCounted = false;
            gGame.markedMineCount--;
            console.log(gGame.markedMineCount);
        }


    }
    win()
}



function lose() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) {
                document.querySelector(`#cell-${i}-${j}`).classList.remove("cell")
                document.querySelector(`#cell-${i}-${j}`).classList.add("emptycell")
                document.querySelector(`#cell-${i}-${j}`).innerText = "💣";
            }
        }
    }
    document.querySelector(".smiley").innerHTML = gSmileyies.sSmiley;
    clearInterval(gInterval)
    console.log("you have lost, game will restart in 5 sec");
    setTimeout(function() { innit(); }, 1337);
}

function win() {
    if (gGame.shownCount === ((gLevel.SIZE ** 2) - gLevel.MINES) && gGame.markedMineCount === gLevel.MINES) {

        clearInterval(gInterval)
        innit()
        document.querySelector(".smiley").innerHTML = gSmileyies.hSmiley;
    }

}

function buttonClicked(elButton) {

    var dataSet = elButton.dataset;
    var mines = +dataSet.mines;
    var size = +dataSet.size;
    console.log("elbutton size :", dataSet)
    gLevel.SIZE = size;
    gLevel.MINES = mines;
    clearInterval(gInterval)
    innit()
}

function openNegs(elcell) {
    var dataSet = elcell.dataset;
    var posI = +dataSet.i;
    var posJ = +dataSet.j;
    var cell = gBoard[posI][posJ]

    for (var i = posI - 1; i <= posI + 1; i++) {
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (i < 0 || i >= gBoard.length || j < 0 || j >= gBoard.length) continue;
            if (!gBoard[i][j].isFlagged && !gBoard[i][j].isCounted) {
                gBoard[i][j].isShown = true;
                gGame.shownCount++;
                document.querySelector(`#cell-${i}-${j}`).classList.remove("cell")
                document.querySelector(`#cell-${i}-${j}`).classList.add("emptycell")
                gBoard[i][j].isCounted = true;
                console.log(gGame.shownCount);
            }

            if (gBoard[i][j].isFlagged === false) {
                document.querySelector(`#cell-${i}-${j}`).innerText = gBoard[i][j].mineCountNeg;

            }
        }
    }
}

function hint(elimg) {
    var id = elimg.id;

    gIsHint = true;
    switch (id) {
        case 'img1':
            gImgIdx = 0;

            break;
        case 'img2':
            gImgIdx = 1;

            break;
        case 'img3':
            gImgIdx = 2;

            break;

    }
    console.log(gImgIdx);
    document.querySelector(`#${id}`).style.borderColor = "yellow";
}

function hintAction(elcell) {
    var dataSet = elcell.dataset;
    var posI = +dataSet.i;
    var posJ = +dataSet.j;
    var cell = gBoard[posI][posJ]

    for (var i = posI - 1; i <= posI + 1; i++) {
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (i < 0 || i >= gBoard.length || j < 0 || j >= gBoard.length) continue;
            if (gBoard[i][j].isMine === true) {
                document.querySelector(`#cell-${i}-${j}`).innerText = "💣";
                document.querySelector(`#cell-${i}-${j}`).classList.remove("cell")
                document.querySelector(`#cell-${i}-${j}`).classList.add("emptycell")
            } else {
                document.querySelector(`#cell-${i}-${j}`).innerText = gBoard[i][j].mineCountNeg;
                document.querySelector(`#cell-${i}-${j}`).classList.remove("cell")
                document.querySelector(`#cell-${i}-${j}`).classList.add("emptycell")
            }
        }
    }

    setTimeout(function() {
        for (var i = posI - 1; i <= posI + 1; i++) {
            for (var j = posJ - 1; j <= posJ + 1; j++) {
                if (i < 0 || i >= gBoard.length || j < 0 || j >= gBoard.length) continue;
                if (!gBoard[i][j].isShown) {
                    document.querySelector(`#cell-${i}-${j}`).innerText = "O";

                    document.querySelector(`#cell-${i}-${j}`).classList.remove("emptycell")
                    document.querySelector(`#cell-${i}-${j}`).classList.add("cell")
                }

            }
        }
    }, 1000);

}