/*
 * Create a list that holds all of your cards
 */
const iconList = ["fa fa-diamond", "fa fa-paper-plane-o",
    "fa fa-anchor", "fa fa-bolt", "fa fa-cube",
    "fa fa-leaf", "fa fa-bicycle", "fa fa-bomb",
    "fa fa-diamond", "fa fa-paper-plane-o",
    "fa fa-anchor", "fa fa-bolt", "fa fa-cube",
    "fa fa-leaf", "fa fa-bicycle", "fa fa-bomb"];
let stars = document.querySelectorAll('.fa-star');
let p = document.createElement('p');
p.className = 'congrats'
p.textContent = "Congratulations! You Won";

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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

function setGame(){

    let shuffledIcon = shuffle(iconList);

    const cards = document.querySelectorAll('.card');

    for (let i = 0; i < shuffledIcon.length; i++){
        let icon = document.createElement('i');
        icon.setAttribute('class', shuffledIcon[i]);
        cards[i].innerHTML = icon.outerHTML;
    }
    for (let star of stars){
        star.style.display = 'none';
    }
}

setGame();



/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
// Retrieve the card deck element
const cardDeck = document.querySelector('.deck');
// variable to count game moves
let moveCount = 0;
// array to hold currently open cards
let openCards = [];
// array to hold matched cards
let match = [];

// Retrieve the move element and the restart element.
const moves = document.querySelector('.moves');
const restart = document.querySelector('.restart');

// add event listener to the card deck
cardDeck.addEventListener('click', f);
function f(e){
    //check that a card item or an unmatched card item is clicked
    if (e.target.nodeName === "LI" && e.target.className === "card"){
        displayCard(e.target);
        verifyCards();
        checkWin();
        announceWinner();
    }


}


//this function takes a card parameter and displays it.
function displayCard(card){
    card.setAttribute('class', 'card show open');
    addCard(card);
}

//this function stores the open cards in an array
function addCard(card) {
    openCards.push(card);
}

//this function checks the open card for a match and returns a boolean.
function checkCard() {
    return (openCards[0].firstElementChild.className === openCards[1].firstElementChild.className)
}

//this function verifies the cards and opens them if it a match
function verifyCards() {
    if (openCards.length === 2){
        let test = checkCard();
        if (test){
            match.push(...openCards);
            for (let card of openCards){
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

//closes all open cards and empties the array
function closeCards() {
    for (let card of openCards){
        card.className = 'card';
    }
    openCards = [];
}

//animates the cards
function animate() {
    for (let card of openCards){
        card.className = 'card open show unmatch';
    }
}

//closes all matched cards at the end of the game
function  closeAll() {
    for (let card of match){
        card.className = 'card';
    }
    match = [];
}

//counts the number of moves
function countMoves() {
    moveCount++;
    moves.textContent = moveCount;
}

//checks if the match has been won
function checkWin() {
    return match.length === 16;
}

//Displays a message when the game is won
function announceWinner() {
    if (checkWin()){
        cardDeck.style.display = 'none';
        p.setAttribute("style", "")
        cardDeck.parentElement.appendChild(p);

        if (moveCount <= 16){
            showStars(3);
        } else if (moveCount < 32){
            showStars(2);
        } else {
            showStars(1);
        }
    }
}

restart.addEventListener('click', repeat);

//Resets all values and restarts the game
function repeat() {
    moves.textContent = '0';
    moveCount = 0;
    closeCards();
    closeAll();
    setGame();
    cardDeck.setAttribute('style', '');
    p.style.display = 'none';
}

//displays the number of stars for the player
function showStars(count) {
    for (let i = 0; i < (count); i++){
        stars[i].setAttribute('style', '');
    }
}