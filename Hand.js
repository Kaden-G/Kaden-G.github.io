class Hand {
    constructor() {
        this.cards = [];
        this._cachedTotal = null;
    }

    addCard(card) {
        this.cards.push(card);
        this._cachedTotal = null; // Invalidate cache
    }

    calculateTotalValue() {
        if (this._cachedTotal !== null) {
            return this._cachedTotal;
        }

        let total = 0;
        let aceCount = 0;

        this.cards.forEach(card => {
            let value = parseInt(card.value);
            if (isNaN(value)) {
                // Face cards are worth 10
                value = 10;
            }
            if (card.value === "Ace") {
                aceCount++;
                value = 11;
            }
            total += value;
        });

        // Adjust for Aces if total > 21
        while (total > 21 && aceCount > 0) {
            total -= 10;
            aceCount--;
        }

        this._cachedTotal = total;
        return total;
    }

    isBlackjack() {
        return this.cards.length === 2 && this.calculateTotalValue() === 21;
    }

    isBust() {
        return this.calculateTotalValue() > 21;
    }

    canSplit() {
        if (this.cards.length !== 2) return false;
        const value1 = this.cards[0].value;
        const value2 = this.cards[1].value;

        // Allow splitting same ranks or any 10-value cards
        if (value1 === value2) return true;
        const tenValues = ['10', 'Jack', 'Queen', 'King'];
        return tenValues.includes(value1) && tenValues.includes(value2);
    }

    clear() {
        this.cards = [];
        this._cachedTotal = null;
    }
}
