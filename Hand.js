class Hand {
    constructor() {
        this.cards = [];
    }

    addCard(card) {
        this.cards.push(card);
    }

    calculateTotalValue() {
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

        return total;
    }
}
