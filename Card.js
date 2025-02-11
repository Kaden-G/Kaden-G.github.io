class Card {
    constructor(value, suit) {
        this.value = value;
        this.suit = suit;
    }

    toString() {
        return `${this.value} of ${this.suit}`;
    }
}
