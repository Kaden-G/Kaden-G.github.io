class Deck {
  constructor(numDecks = 6) {
    this.numDecks = numDecks;
    this.cards = [];
    this.cutCardPosition = 0;
    this.createShoe();
  }

  createShoe() {
    this.cards = [];
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];

    // Create multiple decks for the shoe
    for (let d = 0; d < this.numDecks; d++) {
      suits.forEach(suit => {
        values.forEach(value => {
          this.cards.push(new Card(value, suit));
        });
      });
    }

    this.shuffle();
    // Place cut card at ~75% penetration (deal 75% of cards before reshuffling)
    this.cutCardPosition = Math.floor(this.cards.length * 0.25);
  }

  shuffle() {
    // Fisher-Yates shuffle
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  drawCard() {
    if (this.needsReshuffle()) {
      this.createShoe();
    }
    return this.cards.pop();
  }

  needsReshuffle() {
    return this.cards.length <= this.cutCardPosition;
  }
}
