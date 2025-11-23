let game;
let playerName = "";
let pendingBet = 0;

// ----------------------
// Creating Card Elements
// ----------------------
function createCardElement(card) {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";

    const suitSymbols = {
        Hearts: "♥",
        Diamonds: "♦",
        Clubs: "♣",
        Spades: "♠"
    };
    const suitSymbol = suitSymbols[card.suit] || card.suit;

    const shortValue = (card.value === "Ace")
        ? "A"
        : (card.value === "King")
            ? "K"
            : (card.value === "Queen")
                ? "Q"
                : (card.value === "Jack")
                    ? "J"
                    : card.value;

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

    if (card.suit === "Hearts" || card.suit === "Diamonds") {
        cardDiv.style.color = "red";
    } else {
        cardDiv.style.color = "black";
    }

    return cardDiv;
}

function createCardBack() {
    const cardBack = document.createElement("div");
    cardBack.className = "card-back";
    cardBack.textContent = "?";
    return cardBack;
}

// ----------------------
// Updating UI
// ----------------------
function updateUI() {
    if (!game) return;

    const dealerCardsContainer = document.getElementById("dealer-cards");
    const playerCardsContainer = document.getElementById("player-cards");

    dealerCardsContainer.innerHTML = "";
    playerCardsContainer.innerHTML = "";

    // Display dealer cards (hide hole card if needed)
    game.dealerHand.cards.forEach((card, index) => {
        if (index === 1 && game.dealerHoleCardHidden) {
            dealerCardsContainer.appendChild(createCardBack());
        } else {
            dealerCardsContainer.appendChild(createCardElement(card));
        }
    });

    // Display player cards
    game.playerHand.cards.forEach(card => {
        playerCardsContainer.appendChild(createCardElement(card));
    });

    updateHandTotals();
    updateChipCounts();
    updateButtonStates();
}

function updateHandTotals() {
    if (!game) return;

    const dealerTotal = document.getElementById("dealer-total");
    const playerTotal = document.getElementById("player-total");

    if (game.dealerHoleCardHidden) {
        const firstCard = game.dealerHand.cards[0];
        let firstCardValue = parseInt(firstCard.value);
        if (isNaN(firstCardValue)) {
            firstCardValue = firstCard.value === "Ace" ? 11 : 10;
        }
        dealerTotal.textContent = `Showing: ${firstCardValue}`;
    } else {
        dealerTotal.textContent = `Total: ${game.dealerHand.calculateTotalValue()}`;
    }

    const playerValue = game.playerHand.calculateTotalValue();
    playerTotal.textContent = `Total: ${playerValue}`;

    if (game.playerHand.isBlackjack()) {
        playerTotal.textContent += " - BLACKJACK!";
    } else if (playerValue > 21) {
        playerTotal.textContent += " - BUST!";
    }
}

function updateChipCounts() {
    if (!game) return;

    document.getElementById("player-chips").textContent = game.playerChips;
    document.getElementById("current-bet").textContent = pendingBet > 0 ? pendingBet : game.currentBet;
}

function updateButtonStates() {
    if (!game) return;

    document.getElementById("hit-btn").disabled = !game.canHit();
    document.getElementById("stand-btn").disabled = !game.canStand();
    document.getElementById("double-btn").disabled = !game.canDoubleDown();
    document.getElementById("split-btn").disabled = !game.canSplit();
    document.getElementById("surrender-btn").disabled = !game.canSurrender();
    document.getElementById("insurance-btn").disabled = !game.canOfferInsurance();

    // Betting controls
    const bettingInProgress = !game.roundInProgress && pendingBet === 0;
    const canPlaceBet = pendingBet > 0 && pendingBet <= game.playerChips;

    document.querySelectorAll('.chip-btn').forEach(btn => {
        const amount = parseInt(btn.dataset.amount);
        btn.disabled = game.roundInProgress || amount > game.playerChips;
    });

    document.getElementById("place-bet-btn").disabled = !canPlaceBet;
    document.getElementById("clear-bet-btn").disabled = pendingBet === 0;
    document.getElementById("next-round-btn").disabled = game.roundInProgress;
}

function showMessage(msg) {
    document.getElementById("message").textContent = msg;
}

// ----------------------
// Betting Functions
// ----------------------
function handleChipClick(event) {
    if (!game || game.roundInProgress) return;

    const amount = parseInt(event.target.dataset.amount);
    if (pendingBet + amount <= game.playerChips) {
        pendingBet += amount;
        updateChipCounts();
        updateButtonStates();
    }
}

function handleClearBet() {
    pendingBet = 0;
    updateChipCounts();
    updateButtonStates();
}

async function handlePlaceBet() {
    if (!game || pendingBet <= 0 || pendingBet > game.playerChips) return;

    const error = game.placeBet(pendingBet);
    if (error) {
        showMessage(error);
        return;
    }

    pendingBet = 0;
    game.dealInitialCards();
    updateUI();

    // Check for insurance offer
    if (game.canOfferInsurance()) {
        showMessage("Dealer showing Ace! Insurance available.");
        return;
    }

    // Check for dealer blackjack
    if (game.dealerHand.cards[0].value === 'Ace' ||
        ['10', 'Jack', 'Queen', 'King'].includes(game.dealerHand.cards[0].value)) {
        if (game.checkDealerBlackjack()) {
            updateUI();
            const outcome = game.determineOutcome();
            showMessage(outcome);
            game.roundInProgress = false;
            updateButtonStates();
            return;
        }
    }

    // Check for player blackjack
    if (game.playerHand.isBlackjack()) {
        game.dealerHoleCardHidden = false;
        updateUI();
        const outcome = game.determineOutcome();
        showMessage(outcome);
        game.roundInProgress = false;
        updateButtonStates();
        return;
    }

    showMessage("Make your move!");
}

// ----------------------
// Game Action Handlers
// ----------------------
async function handleHit() {
    if (!game.canHit()) return;

    game.playerHit();
    updateUI();

    if (game.playerHand.isBust()) {
        showMessage("You busted! Dealer wins.");
        game.roundInProgress = false;
        updateButtonStates();
    }
}

async function handleStand() {
    if (!game.canStand()) return;

    showMessage("Dealer's turn...");
    updateButtonStates();

    await game.handleDealerTurn();
    updateUI();

    const outcome = game.determineOutcome();
    showMessage(outcome);
    game.roundInProgress = false;
    updateButtonStates();
}

async function handleDoubleDown() {
    if (!game.canDoubleDown()) return;

    const error = game.playerDoubleDown();
    if (error) {
        showMessage(error);
        return;
    }

    updateUI();

    if (game.playerHand.isBust()) {
        showMessage("You busted! Dealer wins.");
        game.roundInProgress = false;
        updateButtonStates();
        return;
    }

    showMessage("Dealer's turn...");
    updateButtonStates();

    await game.handleDealerTurn();
    updateUI();

    const outcome = game.determineOutcome();
    showMessage(outcome);
    game.roundInProgress = false;
    updateButtonStates();
}

async function handleSplit() {
    if (!game.canSplit()) return;

    const error = game.playerSplit();
    if (error) {
        showMessage(error);
        return;
    }

    updateUI();
    showMessage("Playing split hands - feature coming soon!");
}

function handleSurrender() {
    if (!game.canSurrender()) return;

    game.playerSurrender();
    updateUI();
    showMessage("You surrendered. Half your bet returned.");
    updateButtonStates();
}

function handleInsurance() {
    if (!game.canOfferInsurance()) return;

    const error = game.placeInsurance();
    if (error) {
        showMessage(error);
        return;
    }

    updateUI();

    // Check if dealer has blackjack
    if (game.checkDealerBlackjack()) {
        updateUI();
        showMessage("Dealer has Blackjack! Insurance pays 2:1.");
        const outcome = game.determineOutcome();
        showMessage(outcome);
        game.roundInProgress = false;
        updateButtonStates();
    } else {
        showMessage("Dealer doesn't have Blackjack. Insurance lost.");
        updateButtonStates();
    }
}

// ----------------------
// Game Flow Handlers
// ----------------------
function handleNewGame() {
    game = new BlackjackGame();
    pendingBet = 0;
    showMessage("Place your bet to start!");
    updateUI();
}

function handleNextRound() {
    if (!game) {
        showMessage("Start a new game first!");
        return;
    }

    if (game.playerChips <= 0) {
        showMessage("You're out of chips! Start a new game.");
        return;
    }

    game.startRound();
    pendingBet = 0;
    showMessage("Place your bet!");
    updateUI();
}

function handleEndGame() {
    if (!playerName) {
        playerName = prompt("What's your name?") || "Anonymous";
    }

    if (game) {
        updateHighRollers(playerName, game.playerChips);
        updateHighRollerBoard();
    }

    showMessage(`Thanks for playing, ${playerName}! Final chips: ${game ? game.playerChips : 0}`);

    setTimeout(() => {
        game = null;
        pendingBet = 0;
        document.getElementById("dealer-cards").innerHTML = "";
        document.getElementById("player-cards").innerHTML = "";
        document.getElementById("dealer-total").textContent = "";
        document.getElementById("player-total").textContent = "";
        document.getElementById("player-chips").textContent = "0";
        document.getElementById("current-bet").textContent = "0";
        showMessage("Click 'New Game' to play again!");
        updateButtonStates();
    }, 3000);
}

// ----------------------
// High Roller Board
// ----------------------
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

    const entries = Object.entries(stored)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    if (entries.length === 0) {
        const listItem = document.createElement("li");
        listItem.textContent = "No high rollers yet!";
        list.appendChild(listItem);
        return;
    }

    entries.forEach(([name, chips], index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${index + 1}. ${name}: ${chips} chips`;
        list.appendChild(listItem);
    });
}

// ----------------------
// Event Listeners
// ----------------------
(function attachEventListeners() {
    if (typeof document === 'undefined') return;

    // Game action buttons
    document.getElementById('hit-btn').addEventListener('click', handleHit);
    document.getElementById('stand-btn').addEventListener('click', handleStand);
    document.getElementById('double-btn').addEventListener('click', handleDoubleDown);
    document.getElementById('split-btn').addEventListener('click', handleSplit);
    document.getElementById('surrender-btn').addEventListener('click', handleSurrender);
    document.getElementById('insurance-btn').addEventListener('click', handleInsurance);

    // Game flow buttons
    document.getElementById('new-game-btn').addEventListener('click', handleNewGame);
    document.getElementById('next-round-btn').addEventListener('click', handleNextRound);
    document.getElementById('end-game-btn').addEventListener('click', handleEndGame);

    // Betting buttons
    document.querySelectorAll('.chip-btn').forEach(btn => {
        btn.addEventListener('click', handleChipClick);
    });
    document.getElementById('place-bet-btn').addEventListener('click', handlePlaceBet);
    document.getElementById('clear-bet-btn').addEventListener('click', handleClearBet);

    // Initialize high roller board
    updateHighRollerBoard();
})();
