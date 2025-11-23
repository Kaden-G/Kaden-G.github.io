class BlackjackGame {
    constructor() {
        this.deck = new Deck(6); // 6-deck shoe
        this.playerHand = new Hand();
        this.dealerHand = new Hand();
        this.playerHands = []; // For splits
        this.currentHandIndex = 0;
        this.playerChips = 1000;
        this.currentBet = 0;
        this.insuranceBet = 0;
        this.dealerHoleCardHidden = true;
        this.roundInProgress = false;
        this.dealerTurnInProgress = false;
        this.hasDoubledDown = false;
        this.hasSurrendered = false;
    }

    // Called each time we want a new round
    startRound() {
        this.currentBet = 0;
        this.insuranceBet = 0;
        this.dealerHoleCardHidden = true;
        this.roundInProgress = false;
        this.dealerTurnInProgress = false;
        this.hasDoubledDown = false;
        this.hasSurrendered = false;

        // Clear hands
        this.playerHand.clear();
        this.dealerHand.clear();
        this.playerHands = [];
        this.currentHandIndex = 0;
    }

    dealInitialCards() {
        // Deal cards: Player, Dealer, Player, Dealer
        this.playerHand.addCard(this.deck.drawCard());
        this.dealerHand.addCard(this.deck.drawCard());
        this.playerHand.addCard(this.deck.drawCard());
        this.dealerHand.addCard(this.deck.drawCard());

        this.roundInProgress = true;
    }

    placeBet(amount) {
        if (isNaN(amount) || amount <= 0) {
            return "Bet must be a positive number.";
        }
        if (amount > this.playerChips) {
            return "You don't have enough chips to make that bet.";
        }
        this.currentBet = amount;
        this.playerChips -= amount;
        return null;
    }

    canOfferInsurance() {
        return this.dealerHand.cards.length === 2 &&
               this.dealerHand.cards[0].value === 'Ace' &&
               this.insuranceBet === 0;
    }

    placeInsurance() {
        const insuranceAmount = Math.floor(this.currentBet / 2);
        if (insuranceAmount > this.playerChips) {
            return "Not enough chips for insurance.";
        }
        this.insuranceBet = insuranceAmount;
        this.playerChips -= insuranceAmount;
        return null;
    }

    checkDealerBlackjack() {
        if (this.dealerHand.isBlackjack()) {
            this.dealerHoleCardHidden = false;
            if (this.insuranceBet > 0) {
                // Insurance pays 2:1
                this.playerChips += this.insuranceBet * 3;
            }
            return true;
        }
        // Lose insurance bet if dealer doesn't have blackjack
        this.insuranceBet = 0;
        return false;
    }

    playerHit() {
        this.playerHand.addCard(this.deck.drawCard());
    }

    playerDoubleDown() {
        if (this.currentBet > this.playerChips) {
            return "Not enough chips to double down.";
        }
        this.playerChips -= this.currentBet;
        this.currentBet *= 2;
        this.hasDoubledDown = true;
        this.playerHand.addCard(this.deck.drawCard());
        return null;
    }

    playerSurrender() {
        this.hasSurrendered = true;
        // Return half the bet
        this.playerChips += Math.floor(this.currentBet / 2);
        this.roundInProgress = false;
    }

    playerSplit() {
        if (!this.playerHand.canSplit()) {
            return "Cannot split this hand.";
        }
        if (this.currentBet > this.playerChips) {
            return "Not enough chips to split.";
        }

        // Deduct additional bet
        this.playerChips -= this.currentBet;

        // Create two hands from the split
        const card1 = this.playerHand.cards[0];
        const card2 = this.playerHand.cards[1];

        const hand1 = new Hand();
        const hand2 = new Hand();
        hand1.addCard(card1);
        hand2.addCard(card2);

        // Deal one card to each hand
        hand1.addCard(this.deck.drawCard());
        hand2.addCard(this.deck.drawCard());

        this.playerHands = [hand1, hand2];
        this.currentHandIndex = 0;
        return null;
    }

    async handleDealerTurn() {
        this.dealerTurnInProgress = true;
        this.dealerHoleCardHidden = false;

        return new Promise((resolve) => {
            const playDealerTurn = () => {
                const dealerTotal = this.dealerHand.calculateTotalValue();
                // Dealer stands on all 17s (including soft 17)
                if (dealerTotal < 17) {
                    this.dealerHand.addCard(this.deck.drawCard());
                    setTimeout(playDealerTurn, 800);
                } else {
                    this.dealerTurnInProgress = false;
                    resolve();
                }
            };
            playDealerTurn();
        });
    }

    determineOutcome() {
        if (this.hasSurrendered) {
            return "You surrendered. Half your bet returned.";
        }

        const playerTotal = this.playerHand.calculateTotalValue();
        const dealerTotal = this.dealerHand.calculateTotalValue();
        const playerBlackjack = this.playerHand.isBlackjack();
        const dealerBlackjack = this.dealerHand.isBlackjack();

        // Both have blackjack - push
        if (playerBlackjack && dealerBlackjack) {
            this.playerChips += this.currentBet;
            return "Both have Blackjack! Push - bet returned.";
        }

        // Player blackjack pays 3:2
        if (playerBlackjack) {
            const payout = this.currentBet + Math.floor(this.currentBet * 1.5);
            this.playerChips += payout;
            return `Blackjack! You win ${payout} chips!`;
        }

        // Dealer blackjack - player loses
        if (dealerBlackjack) {
            return "Dealer has Blackjack. You lose.";
        }

        // Player busts
        if (playerTotal > 21) {
            return "You busted! Dealer wins.";
        }

        // Dealer busts
        if (dealerTotal > 21) {
            this.playerChips += this.currentBet * 2;
            return "Dealer busts! You win!";
        }

        // Compare totals
        if (playerTotal > dealerTotal) {
            this.playerChips += this.currentBet * 2;
            return `You win with ${playerTotal}!`;
        } else if (playerTotal < dealerTotal) {
            return `Dealer wins with ${dealerTotal}.`;
        } else {
            this.playerChips += this.currentBet;
            return "Push! Bet returned.";
        }
    }

    canHit() {
        return this.roundInProgress &&
               !this.dealerTurnInProgress &&
               !this.hasDoubledDown &&
               !this.hasSurrendered &&
               !this.playerHand.isBust();
    }

    canStand() {
        return this.roundInProgress &&
               !this.dealerTurnInProgress &&
               !this.hasSurrendered;
    }

    canDoubleDown() {
        return this.roundInProgress &&
               this.playerHand.cards.length === 2 &&
               !this.dealerTurnInProgress &&
               !this.hasDoubledDown &&
               this.currentBet <= this.playerChips;
    }

    canSplit() {
        return this.roundInProgress &&
               this.playerHand.canSplit() &&
               this.playerHands.length === 0 &&
               this.currentBet <= this.playerChips;
    }

    canSurrender() {
        return this.roundInProgress &&
               this.playerHand.cards.length === 2 &&
               !this.dealerTurnInProgress &&
               !this.hasDoubledDown;
    }
}
