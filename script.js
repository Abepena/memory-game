const gameContainer = document.getElementById("game");
const title = document.querySelector("#title");
const resetButton = document.querySelector("#start-restart");
const pointsDisplay = document.querySelector("#points");
const recordDisplay = document.querySelector("#record");

let matches = 0;
let points = 0;
let record = JSON.parse(localStorage.getItem("record")) || Infinity;
recordDisplay.innerText = record === Infinity ? "none" : record;
let card1 = null;
let card2 = null;

const GIFS = [
    {
        url:
            "https://media4.giphy.com/media/wW95fEq09hOI8/100.gif?cid=a3fda15b9a00a44ff8e27b89527553294dd9dfd1074c9204&rid=100.gif",
        id: 1,
    },
    {
        url:
            "https://media2.giphy.com/media/Y4sWRVE6wyhwuLWpi4/200.gif?cid=a3fda15be6012d60e7f2385b7de5e3bfb1f9662e3365d042&rid=200.gif",
        id: 2,
    },
    {
        url:
            "https://media2.giphy.com/media/l4Jz3a8jO92crUlWM/200.gif?cid=a3fda15b41bd4e129079c3bef46a3d4d5b8bcfc36cf141a8&rid=200.gif",
        id: 3,
    },
    {
        url:
            "https://media4.giphy.com/media/LmNwrBhejkK9EFP504/200.gif?cid=a3fda15b640ec323eefee93edd1b68cead141705f489ebb6&rid=200.gif",
        id: 4,
    },
    {
        url:
            "https://media0.giphy.com/media/3o85xGocUH8RYoDKKs/200.gif?cid=a3fda15b868f72aad6306669862fa9b0755b7ecb64a2ec06&rid=200.gif",
        id: 5,
    },
    {
        url:
            "https://media4.giphy.com/media/wW95fEq09hOI8/100.gif?cid=a3fda15b9a00a44ff8e27b89527553294dd9dfd1074c9204&rid=100.gif",
        id: 1,
    },
    {
        url:
            "https://media2.giphy.com/media/Y4sWRVE6wyhwuLWpi4/200.gif?{url: cid=a3fda15be6012d60e7f2385b7de5e3bfb1f9662e3365d042&rid=200.gif",
        id: 2,
    },
    {
        url:
            "https://media2.giphy.com/media/l4Jz3a8jO92crUlWM/200.gif?cid=a3fda15b41bd4e129079c3bef46a3d4d5b8bcfc36cf141a8&rid=200.gif",
        id: 3,
    },
    {
        url:
            "https://media4.giphy.com/media/LmNwrBhejkK9EFP504/200.gif?cid=a3fda15b640ec323eefee93edd1b68cead141705f489ebb6&rid=200.gif",
        id: 4,
    },
    {
        url:
            "https://media0.giphy.com/media/3o85xGocUH8RYoDKKs/200.gif?cid=a3fda15b868f72aad6306669862fa9b0755b7ecb64a2ec06&rid=200.gif",
        id: 5,
    },
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want to research more
function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

let shuffledGifs = shuffle(GIFS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForGifs(gifArray) {
    for (let { url, id } of gifArray) {
        // create a new div
        const newDiv = document.createElement("div");
        const front = document.createElement("div");
        const back = document.createElement("img");

        // give it a class attribute for the value we are looping over
        newDiv.classList.add("rounded", "card");
        front.classList.add("front");
        back.classList.add("back");

        //other attributes/data
        newDiv.dataset.id = id;
        back.src = url;
        back.style.backgroundSize = `cover`;
        newDiv.append(front, back);

        // call a function handleCardClick when a div is clicked on
        newDiv.addEventListener("click", handleCardClick);

        // append the div to the element with an id of game
        gameContainer.append(newDiv);
    }
}


function handleCardClick(e) {
    // you can use event.target to see which element was clicked
    //check if we have matching ids if card1 and card2 have values
    if (!e.target.classList.contains("front")) return;

    //flip the card
    this.classList.add("flip");
    points++;
    pointsDisplay.innerText = points;
    //set cards if null
    if (!card1) {
        card1 = this;
    } else if (card1 && !card2) {
        card2 = this;
    }

    //if you just set card2 this will run
    if (card1 && card2) {
        console.log(card1.dataset.id, card2.dataset.id);
        if (card1.dataset.id === card2.dataset.id) {
            card1.removeEventListener("click", handleCardClick);
            card2.removeEventListener("click", handleCardClick);
            card1 = null;
            card2 = null;
            matches += 2;
        } else {
            setTimeout(() => {
                card1.classList.remove("flip");
                card2.classList.remove("flip");
                card1 = null;
                card2 = null;
            }, 700);
        }
    }

    //check if player has won
    if (matches === numCards) end();
}

// when the DOM loads
createDivsForGifs(shuffledGifs);
const cards = document.querySelectorAll(".card");
const numCards = cards.length;
//callback to start game and change button to reset button

resetButton.addEventListener("click", reset);

function end() {
    if (points < record) {
        record = points;
        localStorage.setItem("record", JSON.stringify(points));
        title.innerText = `new record: ${record}`;
        recordDisplay.innerText = record;
    } else {
        title.innerText = `game over: record ${record}`;
    }
}

//callback for reset button and timer running out
function reset() {
    title.innerText = `memory`;
    cards.forEach((card) => {
        card.classList.remove("flip");
        card.addEventListener("click", handleCardClick);
    });
    points = 0;
    matches = 0;
    pointsDisplay.innerText = points;
}
