"use strict";

//array of icons
const iconList = ["fa fa-diamond", "fa fa-paper-plane-o",
    "fa fa-anchor", "fa fa-bolt", "fa fa-cube",
    "fa fa-leaf", "fa fa-bicycle", "fa fa-bomb"];

//retrieve the star icons from the page
const stars = document.querySelectorAll('.fa-star');

//the table body
const tBody = document.querySelector('.tablebody');


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//initialize the game

let gameCount = 0;
let score = 0;
function setGame() {

    const shuffledIcon = shuffle(iconList.concat(iconList));

    const cards = document.querySelectorAll('.card');

    for (let i = 0; i < shuffledIcon.length; i++) {
        const icon = document.createElement('i');
        icon.setAttribute('class', shuffledIcon[i]);
        cards[i].innerHTML = icon.outerHTML;
    }

    //reset the card at the beginning of the game
    for (let star of stars) {
        star.setAttribute('style', '');
    }

    gameCount++;


}

setGame();


// Retrieve the card deck element
const cardDeck = document.querySelector('.deck');
// variable to count game moves
let moveCount = 0;
// array to hold currently open cards
let openCards = [];
// array to hold matched cards
let match = [];

let clock;
//initialize the clock
clock = $('.clock').FlipClock({
    clockFace: 'HourlyCounter'
});
clock.stop();

// Retrieve the move element and the restart element.
const moves = document.querySelector('.moves');
const restart = document.querySelector('.restart');

// add event listener to the restart icon
restart.addEventListener('click', repeat);

// add event listener to the card deck
cardDeck.addEventListener('click', onClick);

function onClick(e) {
    //check that a card item or an unmatched card item is clicked
    if (e.target.nodeName === "LI" && e.target.className === "card" && openCards.length < 2) {
        showStars();
        displayCard(e.target);
        verifyCards();
        if (moveCount === 0) {
            clock.start();
        }
        checkWin();
        announceWinner();
    }


}


//this function takes a card parameter and displays it.
function displayCard(card) {
    card.setAttribute('class', 'card show open');
    openCards.push(card);
}

//this function verifies the cards and opens them if it a match
function verifyCards() {
    if (openCards.length === 2) {
        if (checkCard()) {
            match.push(...openCards);
            for (let card of openCards) {
                card.className = 'card match';
            }
            openCards = [];
        } else {
            //animates the cards then close them.
            animate();
            setTimeout(closeCards, 1000);

        }
        countMoves();
    }
}


//this function checks the open card for a match and returns a boolean.
function checkCard() {
    return (openCards[0].firstElementChild.className === openCards[1].firstElementChild.className);
}



//closes all open cards and empties the array
function closeCards() {
    for (let card of openCards) {
        card.className = 'card';
    }
    openCards = [];
}

//animates the cards
function animate() {
    for (let card of openCards) {
        card.className = 'card open show unmatch';
    }
}

//closes all matched cards at the end of the game
function closeAll() {
    for (let card of match) {
        card.className = 'card';
    }
    match = [];
}

//counts the number of moves
function countMoves() {
    moveCount++;
    moves.textContent = (moveCount === 1) ? `${moveCount} Move` : `${moveCount} Moves`;
}

//checks if the match has been won
function checkWin() {
    return match.length === 16;
}

//Displays a message when the game is won
function announceWinner() {
    if (checkWin()) {
        clock.stop();
        //retrieve the star element from the page
        const starGame = document.querySelector('.stars');
        //star element in the modal
        const starFinal = document.querySelector('#starfinal');
        //retrieve the move element
        const movesFinal = document.querySelector('.movesFinal');
        //retrieve the time element
        const time = document.querySelector('#time');
        time.textContent = getTime();
        //show the stars earned on the modal
        starFinal.innerHTML = starGame.outerHTML;
        // show the moves on the modal
        movesFinal.textContent = `${moveCount} Moves`;
        $('#myModal').modal('show');

        //show the score table after the first game
        if (gameCount !== 0) {
            tBody.parentElement.setAttribute('style', '');
            let tRow = `<tr>
                            <th scope="row">${gameCount}</th>
                            <td>${score}</td>
                            <td>${moveCount}</td>
                            <td>${time.textContent}</td>
                        </tr>`;
            tBody.insertAdjacentHTML('beforeend', tRow);

        }

    }
}


//Resets all values and restarts the game
function repeat() {
    if ($('#myModal').is(':visible')) {
        $('#myModal').modal('hide');
    }
    moves.textContent = '0';
    moveCount = 0;
    clock.stop();
    clock.reset();
    closeCards();
    closeAll();
    setGame();
    cardDeck.setAttribute('style', '');
}

//displays the number of stars for the player
function showStars() {
    let count;
    if (moveCount < 16) {
        count = 3;
        score = 60;
    } else if (moveCount < 32) {
        count = 2;
        score = 40;
    } else {
        count = 1;
        score = 10;
    }
    for (let i = 0; i < (stars.length - count); i++) {
        stars[i].setAttribute('style', 'display: none');
    }
}

//returns time in a readable format
function getTime() {
    let hours = Math.floor(clock.getTime().time / 3600);
    let minutes = Math.floor((clock.getTime().time % 3600) / 60);
    let seconds = Math.floor((clock.getTime().time % 3600) % 60);

    if (hours === 0 && minutes === 0) {
        return `${seconds} Seconds`;
    } else if (hours === 0) {
        return `${minutes} ${(minutes === 1) ? "Minute" : "Minutes"}, ${seconds} ${(seconds === 1 || seconds === 0) ? "Second" : "Seconds"}`;
    } else {
        return `${hours}:${minutes}:${seconds}`;
    }

}

//checks if the table is empty and hides it
if (tBody.firstElementChild === null){
    tBody.parentElement.setAttribute('style', 'display: none');
}