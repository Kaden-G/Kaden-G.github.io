class BlackjackGame {
    constructor() {
        // Starting chips get initialized only when we do a "new game"
        this.deck = new Deck();
        this.playerHand = new Hand();
        this.dealerHand = new Hand();
        this.playerChips = 1000;
        this.dealerChips = 1000;
        this.currentBet = 0;
    }

    // Called each time we want a new round, but not a new game
    startRound() {
        // currentBet gets cleared here so player can place a new bet
        this.currentBet = 0;

        // New hands every round
        this.playerHand = new Hand();
        this.dealerHand = new Hand();

        // Re-create or shuffle deck
        // If you want a FULL re-shuffle each time, just do:
        //     this.deck = new Deck();
        // If you only want a partial shuffle if the deck is low, do this:
        if (this.deck.deck.length < 10) {
            this.deck = new Deck();
        }

        // Deal initial cards
        this.playerHand.addCard(this.deck.deck.pop());
        this.playerHand.addCard(this.deck.deck.pop());
        this.dealerHand.addCard(this.deck.deck.pop());
        this.dealerHand.addCard(this.deck.deck.pop());
    }

    placeBet(amount) {
        if (isNaN(amount) || amount <= 0) {
            return "Bet must be a positive number.";
        }
        if (amount > this.playerChips) {
            return "You don’t have enough chips to make that bet.";
        }
        this.currentBet = amount;
        this.playerChips -= amount;
        this.dealerChips -= amount; // The dealer also matches the bet
    }

    playerHits() {
        if (this.deck.deck.length === 0) {
            return "Deck is empty. Restart the game.";
        }
        this.playerHand.addCard(this.deck.deck.pop());
    }

    playerStands() {
        this.handleDealerTurn();
    }

    handleDealerTurn() {
        const playDealerTurn = () => {
            const dealerTotal = this.dealerHand.calculateTotalValue();
            if (dealerTotal < 17) {
                this.dealerHand.addCard(this.deck.deck.pop());
                setTimeout(playDealerTurn, 500);
            }
        };
        playDealerTurn();
    }

    determineOutcome() {
        const playerTotal = this.playerHand.calculateTotalValue();
        const dealerTotal = this.dealerHand.calculateTotalValue();

        if (playerTotal > 21) {
            // Player busts
            this.dealerChips += this.currentBet * 2;
            return "Player busts. Dealer wins the pot.";
        } else if (dealerTotal > 21) {
            // Dealer busts
            this.playerChips += this.currentBet * 2;
            return "Dealer busts. Player wins the pot.";
        } else if (playerTotal > dealerTotal) {
            // Player wins
            this.playerChips += this.currentBet * 2;
            return "Player wins the pot!";
        } else if (playerTotal < dealerTotal) {
            // Dealer wins
            this.dealerChips += this.currentBet * 2;
            return "Dealer wins the pot!";
        } else {
            // Tie
            this.playerChips += this.currentBet;
            this.dealerChips += this.currentBet;
            return "It’s a tie! Bets returned.";
        }
    }
}
