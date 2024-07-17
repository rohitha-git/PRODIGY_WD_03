var ai =  document.getElementById("ai");
var friend = document.getElementById("friend");

var qsn2 = document.getElementById("qsn2");
var qsn1 = document.getElementById("qsn1");

var restart = document.getElementById("restart");

if(restart){
    restart.addEventListener("click", function(){
        location.reload();
    });
}

var player1 = document.getElementById("player1");
var player2 = document.getElementById("player2");
var isAI=null, isPlayer1First=null;

ai.addEventListener("click", function(){
    qsn2.style.display = "block";
    isAI = 1;
    qsn1.style.display = "none";
});

friend.addEventListener("click", function(){
    qsn1.style.display = "none";
    document.getElementById("player1").innerHTML = "Friend";
    qsn2.style.display = "block";
    isAI = 0;
});

player1.addEventListener("click", function(){
    qsn2.style.display = "none";
    isPlayer1First = 1;
    enableClick();
    checkPlayers(isAI, isPlayer1First);
});

player2.addEventListener("click", function(){
    qsn2.style.display = "none";
    isPlayer1First = 0;
    enableClick();
    checkPlayers(isAI, isPlayer1First);
});


function enableClick(){
let box = document.getElementById("board");
box.style.pointerEvents = "auto";
}



var board = ['','','','','','','','',''];
var gameState = "ongoing";  
var currentPlayer = 'X';
var anotherPlayer = 'O';
var winner;

console.log(isAI);
console.log(isPlayer1First);



function checkPlayers(isAI, isPlayer1First)
{
if(isAI == 1 && isPlayer1First == 1)
{
    currentPlayer = 'O';
    anotherPlayer = 'X';
    aiMove();
    console.log('AI vs Player AI Goes First');
}
else if(isAI == 1 && isPlayer1First == 0)
{
    console.log('AI vs Player Player Goes First');
}
else if(isAI == 0 && isPlayer1First == 1)
{
    console.log('Player vs Player Player 1 Goes First');
}
else if(isAI == 0 && isPlayer1First == 0)
{
    console.log('Player vs Player Player 2 Goes First');
}
}



function displayWinMessage()
{
    document.getElementById('winning-message').style.display = "block";

    
    if(isAI == 1 && gameState == "over")
    {
        if(winner == 'X')
        {
            document.getElementById('game-status').innerHTML = "Game Over!";
            document.getElementById('winner').innerHTML = "You Win!";

        }
        else
        {
            document.getElementById('game-status').innerHTML = "Game Over!";
            document.getElementById('winner').innerHTML = "You Lose!";
        }
    }
    else if(isAI == 0 && gameState == "over")
    {
        if(winner == 'X' && gameState == "over")
        {
            document.getElementById('game-status').innerHTML = "Game Over!";
            document.getElementById('winner').innerHTML = "Player 1 Wins!";
        }
        else
        {
            document.getElementById('game-status').innerHTML = "Game Over!";
            document.getElementById('winner').innerHTML = "Player 2 Wins!";
        }
    }
    else if(winner==null && gameState == "draw")
    {
        document.getElementById('game-status').innerHTML = "Game Over!";
        document.getElementById('winner').innerHTML = "Draw!";
    }
}



function makeMove(pos)
{
    if(gameState == "ongoing")
    {
        if(board[pos] == '')
        {
            board[pos] = currentPlayer;
            console.log(board);
            if(currentPlayer == 'X')
            {
                document.getElementById(pos).innerHTML = 'X';
                document.getElementById(pos).classList.add('x');
                currentPlayer = 'O';
                anotherPlayer = 'X';
            }
            else
            {
                document.getElementById(pos).innerHTML = 'O';
                document.getElementById(pos).classList.add('o');
                currentPlayer = 'X';
                anotherPlayer = 'O';
            }
            checkStatus();
        }
    }
    if(isAI == 1 && currentPlayer == 'O')
    {
        aiMove();
    }
}


function evaluate(board) {
    if (checkWinner(board, currentPlayer)) {
        return 10; 
    } else if (checkWinner(board, anotherPlayer)) {
        return -10; 
    } else {
        
        var heuristicScore = 0;

        for (var i = 0; i < 3; i++) {
            heuristicScore += evaluateLine(board[i * 3], board[i * 3 + 1], board[i * 3 + 2]); 
            heuristicScore += evaluateLine(board[i], board[i + 3], board[i + 6]);
        }
        heuristicScore += evaluateLine(board[0], board[4], board[8]); 
        heuristicScore += evaluateLine(board[2], board[4], board[6]); 

        return heuristicScore;
    }
}

function evaluateLine(cell1, cell2, cell3) {
    var score = 0;
    
    
    if (cell1 === currentPlayer) {
        score = 1;
    } else if (cell1 === anotherPlayer) {
        score = -1;
    }

    if (cell2 === currentPlayer) {
        if (score === 1) {
            score = 10; 
        } else if (score === -1) {
            return 0; 
        } else {
            score = 1; 
        }
    } else if (cell2 === anotherPlayer) {
        if (score === -1) {
            score = -10; 
        } else if (score === 1) {
            return 0; 
        } else {
            score = -1; 
        }
    }

    if (cell3 === currentPlayer) {
        if (score > 0) {
            score *= 10; 
        } else if (score < 0) {
            return 0; 
        } else {
            score = 1; 
        }
    } else if (cell3 === anotherPlayer) {
        if (score < 0) {
            score *= 10; 
        } else if (score > 0) {
            return 0; 
        } else {
            score = -1; 
        }
    }

    return score;
}



function checkWinner(board, player) {
    return (
        (board[0] === player && board[1] === player && board[2] === player) ||
        (board[3] === player && board[4] === player && board[5] === player) ||
        (board[6] === player && board[7] === player && board[8] === player) ||
        (board[0] === player && board[3] === player && board[6] === player) ||
        (board[1] === player && board[4] === player && board[7] === player) ||
        (board[2] === player && board[5] === player && board[8] === player) ||
        (board[0] === player && board[4] === player && board[8] === player) ||
        (board[2] === player && board[4] === player && board[6] === player)
    );
}


function minimax(board, depth, alpha, beta, isMaximizing) {
    var score = evaluate(board);

    if (score !== 0 || depth === 0) {
        return score;
    }

    if (isMaximizing) {
        var bestScore = -Infinity;
        for (var i = 0; i < 9; i++) {
            if (board[i] == '') {
                board[i] = currentPlayer;
                var score = minimax(board, depth - 1, alpha, beta, !isMaximizing);
                board[i] = '';
                bestScore = Math.max(bestScore, score);
                alpha = Math.max(alpha, bestScore);
                if (beta <= alpha) {
                    break; 
                }
            }
        }
        return bestScore;
    } else {
        var bestScore = Infinity;
        for (var i = 0; i < 9; i++) {
            if (board[i] == '') {
                board[i] = anotherPlayer;
                var score = minimax(board, depth - 1, alpha, beta, !isMaximizing);
                board[i] = '';
                bestScore = Math.min(bestScore, score);
                beta = Math.min(beta, bestScore);
                if (beta <= alpha) {
                    break; 
                }
            }
        }
        return bestScore;
    }
}



function aiMove() {
    if (gameState === "ongoing") {
        var bestScore = -Infinity;
        var bestMoves = [];

        
        var depth = 100;

        for (var i = 0; i < 9; i++) {
            if (board[i] == '') {
                board[i] = anotherPlayer;
                var score = minimax(board, depth, -Infinity, Infinity, false);
                board[i] = '';
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMoves = [i];
                } else if (score === bestScore) {
                    bestMoves.push(i);
                }
            }
        }

        
        var randomMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];

        makeMove(randomMove);
    }
}


function checkStatus()
{
    
    for(var i=0; i<9; i+=3)
    {
        if(board[i] == board[i+1] && board[i+1] == board[i+2] && board[i] != '')
        {
            document.getElementById(i).classList.add('win');
            document.getElementById(i).classList.add('win-row');
            document.getElementById(i+1).classList.add('win');
            document.getElementById(i+1).classList.add('win-row');
            document.getElementById(i+2).classList.add('win');
            document.getElementById(i+2).classList.add('win-row');
            winner = board[i];
            gameState = "over";
            document.getElementById('restart').style.display = "block";
            displayWinMessage();
            break;
        }
    }
    
    
    for(var i=0; i<3; i++)
    {
        if(board[i] == board[i+3] && board[i+3] == board[i+6] && board[i] != '')
        {
            gameState = "over";
            document.getElementById(i).classList.add('win');
            document.getElementById(i).classList.add('win-col');
            document.getElementById(i+3).classList.add('win');
            document.getElementById(i+3).classList.add('win-col');
            document.getElementById(i+6).classList.add('win');
            document.getElementById(i+6).classList.add('win-col');
            document.getElementById('restart').style.display = "block";
            winner=board[i];  
            displayWinMessage();   
            break;
        }
    }

    
    if(board[0] == board[4] && board[4] == board[8] && board[0] != '')
    {
        gameState = "over";
        document.getElementById(0).classList.add('win');
        document.getElementById(0).classList.add('win-diag');
        document.getElementById(4).classList.add('win');
        document.getElementById(4).classList.add('win-diag');
        document.getElementById(8).classList.add('win');
        document.getElementById(8).classList.add('win-diag');
        document.getElementById('restart').style.display = "block";
        winner=board[0];
        displayWinMessage();
    }

    if(board[2] == board[4] && board[4] == board[6] && board[2] != '')
    {
        gameState = "over";
        document.getElementById(2).classList.add('win');
        document.getElementById(2).classList.add('win-diag');
        document.getElementById(4).classList.add('win');
        document.getElementById(4).classList.add('win-diag');
        document.getElementById(6).classList.add('win');
        document.getElementById(6).classList.add('win-diag');
        document.getElementById('restart').style.display = "block";
        winner=board[2];
        displayWinMessage();
    }

    
    var filled = 0;
    for(var i=0; i<9; i++)
    {
        if(board[i] != '')
        {
            filled++;
        }
    }
    if(filled == 9 && gameState != "over")
    {
        gameState = "draw";
        winner=null;
        document.getElementById('restart').style.display = "block";
        displayWinMessage();
    }

    console.log(gameState);
}

