let game;
let playerName = "";

// ----------------------
// Creating Card Elements
// ----------------------
function createCardElement(card) {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";

    // Map suit names to symbols
    const suitSymbols = {
        Hearts: "♥",
        Diamonds: "♦",
        Clubs: "♣",
        Spades: "♠"
    };
    const suitSymbol = suitSymbols[card.suit] || card.suit;

    // Shorten face cards and Aces
    const shortValue = (card.value === "Ace")
        ? "A"
        : (card.value === "King")
            ? "K"
            : (card.value === "Queen")
                ? "Q"
                : (card.value === "Jack")
                    ? "J"
                    : card.value;

    // Position the card values
    const topValueDiv = document.createElement("div");
    topValueDiv.className = "top-left-value";
    topValueDiv.textContent = shortValue;

    const suitDiv = document.createElement("div");
    suitDiv.className = "suit";
    suitDiv.textContent = suitSymbol;

    const bottomValueDiv = document.createElement("div");
    bottomValueDiv.className = "bottom-right-value";
    bottomValueDiv.textContent = shortValue;

    cardDiv.appendChild(topValueDiv);
    cardDiv.appendChild(suitDiv);
    cardDiv.appendChild(bottomValueDiv);

    // Set the card color: red for hearts and diamonds, black for others
    if (card.suit === "Hearts" || card.suit === "Diamonds") {
        cardDiv.style.color = "red";
    } else {
        cardDiv.style.color = "black";
    }

    return cardDiv;
}

// ----------------------
// Updating Chip Counts
// ----------------------
function updateChipCounts() {
    if (!game) return;

    document.getElementById("player-chips").textContent = game.playerChips;
    document.getElementById("dealer-chips").textContent = game.dealerChips;
    document.getElementById("current-bet").textContent = game.currentBet;
}

// ----------------------
// Prompting a Bet
// ----------------------
function promptBet() {
    // If the player has no chips, end the game
    if (game.playerChips <= 0) {
        alert("You have no more chips left! Game over.");
        handleEndGame();
        return;
    }

    let bet;
    do {
        let input = prompt(`Enter your bet amount (Max: ${game.playerChips}):`);
        if (input === null) return; // cancelled by user
        input = input.trim();
        bet = Number(input);
    } while (!Number.isInteger(bet) || bet <= 0 || bet > game.playerChips);

    game.placeBet(bet);
    game.currentBet = bet; // keep in sync if placeBet doesn't do so

    updateChipCounts();
}

// ----------------------
// Updating the UI
// ----------------------
function updateUI() {
    if (!game) return;

    const dealerCardsContainer = document.getElementById("dealer-cards");
    const playerCardsContainer = document.getElementById("player-cards");
    const messageElement = document.getElementById("message");

    // Clear old cards
    dealerCardsContainer.innerHTML = "";
    playerCardsContainer.innerHTML = "";

    // Display new cards
    game.dealerHand.cards.forEach(card => {
        dealerCardsContainer.appendChild(createCardElement(card));
    });
    game.playerHand.cards.forEach(card => {
        playerCardsContainer.appendChild(createCardElement(card));
    });

    // Clear message
    messageElement.textContent = "";

    // Update chip counts
    updateChipCounts();
}

// ----------------------
// New Game
// ----------------------
function handleNewGame() {
    // 1) Create brand-new game
    game = new BlackjackGame();

    // 2) Start Round (deal initial cards, shuffle if needed)
    game.startRound();

    // 3) Update UI for fresh round
    updateUI();

    // 4) Prompt for bet AFTER dealing
    promptBet();
}

// ----------------------
// Next Round
// ----------------------
function handleNextRound() {
    if (!game) {
        alert("No active game. Click 'New Game' first.");
        return;
    }
    if (game.playerChips <= 0) {
        alert("You're out of chips! Please start a New Game.");
        return;
    }
    if (game.dealerChips <= 0) {
        alert("Dealer is out of chips! You win. Start a New Game to reset.");
        return;
    }

    // 1) Start Round (re-deal)
    game.startRound();

    // 2) Update UI
    updateUI();

    // 3) Prompt for a new bet
    promptBet();
}

// ----------------------
// Hit / Stand / End Game
// ----------------------
function handleHit() {
    game.playerHits();
    updateUI();

    if (game.playerHand.calculateTotalValue() > 21) {
        document.getElementById("message").textContent = "You busted! Dealer wins.";
    }
}

function handleStand() {
    if (!game) return;

    // Dealer’s turn completes
    game.playerStands();

    // 1) Determine who won & adjust chips
    const result = game.determineOutcome();

    // 2) Update the UI to show updated chip counts
    updateUI();

    // 3) Display the result message
    document.getElementById("message").textContent = result;
}

function handleEndGame() {
    if (!playerName) {
        playerName = prompt("What’s your name?");
    }

    if (game) {
        updateHighRollers(playerName, game.playerChips);
        updateHighRollerBoard();
    }

    resetGame();
}

// ----------------------
// High Roller Tracking
// ----------------------

// Use localStorage to persist high rollers across sessions
function updateHighRollers(name, chips) {
    const stored = JSON.parse(localStorage.getItem("highRollers") || "{}");
    if (!stored[name] || chips > stored[name]) {
        stored[name] = chips;
    }
    localStorage.setItem("highRollers", JSON.stringify(stored));
}

function updateHighRollerBoard() {
    const stored = JSON.parse(localStorage.getItem("highRollers") || "{}");
    const list = document.getElementById("high-rollers-list");
    list.innerHTML = "";
    Object.entries(stored)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .forEach(([name, chips]) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${name}: ${chips} chips`;
            list.appendChild(listItem);
        });
}
