# BlackJack.js
Classic BlackJack game using JS

Welcome to **Hit or Commit!** This is a simple browser-based Blackjack game built with JavaScript, HTML, and CSS. Players can place bets, play rounds against the dealer, and manage their chip totals until they run out—or become the ultimate winner.

## Features
- **New Game** button resets everything, giving both player and dealer 1000 chips each.
- **Next Round** keeps current chip totals but reshuffles and deals new hands.
- **Place Bets**: Prompted at the start of each round, reducing the player’s and dealer’s chips accordingly.
- **Hit or Stand**: Play standard Blackjack rules—try to beat the dealer without going bust.
- **Chip Counts**: Displays both player and dealer totals and the current bet amount.
- **Outcome Messages**: Displays who won the pot each round or if it’s a tie.

## How to Play
1. **Clone or Download** this repository.
2. **Open `index.html`** in your web browser (or host it on GitHub Pages).
3. **Click “New Game”**:
   - Your chips and the dealer’s chips both start at 1000.
   - Cards are dealt, and you’re prompted for a bet.
4. **Place a Bet**:
   - Enter an amount no greater than your current chip total.
5. **Hit**:
   - Draw another card if you think you can improve your hand without busting.
6. **Stand**:
   - End your turn. The dealer will draw until reaching at least 17, then a winner is determined.
7. **Next Round**:
   - Keeps the current chip totals but deals fresh hands so you can keep playing.
8. **End Game**:
   - Reset everything, prompting the user for their name (optionally used in a high-roller board).

## Requirements
- A modern web browser (Chrome, Firefox, Safari, Edge).
- No additional server or backend needed (purely client-side).

## Folder Structure
```
.
├─ index.html        # Main HTML page containing the layout
├─ main.js           # Core JavaScript that handles game logic, bets, UI updates
├─ BlackjackGame.js  # Class-based JavaScript with Blackjack mechanics
├─ Card.js           # Representing individual cards
├─ Deck.js           # Deck creation and shuffling
├─ Hand.js           # Player or dealer hand logic
└─ styles.css        # (Optional) Additional CSS if you break it out of index.html
```

## Known Limitations
- **High Roller Board**: Currently commented out. If you’d like a local scoreboard, uncomment the relevant code. (Note that it won’t be persistent across browsers or sessions without additional setup.)
- **No Shared Leaderboard**: Each user’s session is local—there’s no global scoreboard.
- **Dealer Logic**: The dealer hits until reaching 17, but does not use more advanced Blackjack strategies.

## Future Enhancements
- **Persistent Leaderboard** using localStorage or an external server.
- **Cognito or OAuth** integration for secure, multi-user score tracking.
- **Improved UI** with animations and card graphics.

## License
This project is open source—feel free to modify or use any portion for learning or building your own Blackjack game.

---

Enjoy the game, and may the best hand win!
