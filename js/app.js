/*
 * Create a list that holds all of your cards
 */
const iconList = ["fa fa-diamond", "fa fa-paper-plane-o",
    "fa fa-anchor", "fa fa-bolt", "fa fa-cube",
    "fa fa-leaf", "fa fa-bicycle", "fa fa-bomb",
    "fa fa-diamond", "fa fa-paper-plane-o",
    "fa fa-anchor", "fa fa-bolt", "fa fa-cube",
    "fa fa-leaf", "fa fa-bicycle", "fa fa-bomb"];
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

function setGame(){
    let shuffledIcon = shuffle(iconList);

    const cards = document.querySelectorAll('.card');

    for (let i = 0; i < shuffledIcon.length; i++){
        let icon = document.createElement('i');
        icon.setAttribute('class', shuffledIcon[i]);
        cards[i].innerHTML = icon.outerHTML;
    }
}


setGame();
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
const cardDeck = document.querySelector('.deck');
let moveCount = 0;
let openCards = [];
let match = [];
const moves = document.querySelector('.moves');
const restart = document.querySelector('.restart');

restart.addEventListener('click', repeat);

function f(e){

    if (e.target.nodeName === "LI" && e.target.className === "card"){
        displayCard(e.target);
        verifyCards();
        checkWin();
        announceWinner();
    }


}
cardDeck.addEventListener('click', f);


function displayCard(card){
    card.setAttribute('class', 'card show transition');
    addCard(card);
}

function addCard(card) {
    openCards.push(card);
    console.log(openCards.length)
}

function checkCard() {
    return (openCards[0].firstElementChild.className === openCards[1].firstElementChild.className)
}

function verifyCards() {
    if (openCards.length === 2){
        let test = checkCard();
        if (test){
            match.push(...openCards);
            openCards[0].className = 'card match transition';
            openCards[1].className = 'card match transition';
            openCards = [];
        } else {
            setTimeout(closeCards, 500);

        }
        countMoves();
    }
}

function closeCards() {
    for (let card of openCards){
        card.className = 'card';
    }
    openCards = [];
}

function  closeAll() {
    for (let card of match){
        card.className = 'card';
    }
    match = [];
}

function countMoves() {
    moveCount++;
    moves.textContent = moveCount;
}

function checkWin() {
    return match.length === 16;
}

function announceWinner() {
    if (checkWin()){
        cardDeck.style.display = 'none';
        let p = document.createElement('p');
        p.textContent = "Congratulations! You Won";
        p.style.fontSize = '4em';
        cardDeck.parentElement.appendChild(p);
    }
}
function repeat() {
    moves.textContent = '0';
    closeCards();
    closeAll();
    setGame();
}