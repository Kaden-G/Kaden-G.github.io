# BlackJack.js - Professional Casino Edition

Classic Blackjack game using JavaScript with realistic casino rules and professional gameplay.

Welcome to **Hit or Commit!** This is a fully-featured browser-based Blackjack game built with JavaScript, HTML, and CSS. Experience authentic casino gameplay with a 6-deck shoe, insurance, splitting, doubling down, and more.

## Recent Optimizations (v2.0)

This game was recently optimized for **functionality, efficiency, and realistic blackjack gameplay**:

### 🎯 Realistic Casino Rules
- **6-Deck Shoe**: Professional casino setup with 312 cards
- **Cut Card System**: Auto-reshuffles at 75% deck penetration (realistic casino practice)
- **Blackjack Detection**: Natural 21s are detected and pay 3:2 (not even money)
- **Dealer Hole Card**: Second dealer card is hidden until dealer's turn (authentic gameplay)
- **Insurance**: Available when dealer shows Ace, pays 2:1
- **Split Pairs**: Split matching cards including all 10-value cards
- **Double Down**: Double your bet and receive exactly one more card
- **Surrender**: Forfeit hand for half bet back (early surrender)
- **Proper Betting**: Players bet BEFORE cards are dealt (not after)
- **Dealer Rules**: Stands on all 17s (including soft 17)
- **Push Handling**: Ties return bet (not double it)

### ⚡ Efficiency Improvements
- **Hand Value Caching**: Calculations cached until hand changes for better performance
- **Proper Async Handling**: Fixed race condition with Promise-based dealer turn
- **Smart Deck Management**: `drawCard()` method with automatic reshuffle detection
- **No Page Reloads**: Clean state management without full page refresh
- **Card Class Usage**: Proper OOP structure instead of plain objects
- **Optimized Rendering**: Reduced DOM manipulation

### 💎 Enhanced UX/UI
- **Hand Totals Display**: Always shows current hand values
- **Chip Denomination Buttons**: Quick betting with 5, 10, 25, 50, 100, 500 chips
- **Visual Card Back**: Stylized hidden dealer card with pattern
- **Smart Button States**: Buttons automatically enable/disable based on game state
- **Action Buttons**: Six game actions (Hit, Stand, Double, Split, Surrender, Insurance)
- **High Roller Board**: Now enabled with localStorage persistence
- **Clear Messaging**: Real-time game state and outcome messages
- **Bet Building**: Add chips incrementally before placing bet

### 🐛 Bug Fixes
- Fixed async dealer turn completing before UI updates
- Removed unrealistic dealer chip deduction
- Fixed premature bust checking without chip handling
- Corrected betting sequence (bet-before-deal)
- Fixed inconsistent Card object usage
- Resolved deck running out mid-game issues

## Features

### Core Gameplay
- **New Game**: Start fresh with 1000 chips
- **Next Round**: Continue playing with current bankroll
- **End Game**: Save score to High Roller Board with persistent storage
- **Realistic Rules**: Follows Las Vegas casino blackjack standards

### Betting System
- Chip denomination buttons (5, 10, 25, 50, 100, 500)
- Build bets incrementally before dealing
- Clear bet and start over
- Visual feedback for current bet amount

### Player Actions
- **Hit**: Draw another card
- **Stand**: End turn and let dealer play
- **Double Down**: Double bet, receive one card, turn ends
- **Split**: Split matching pairs into two hands (bet doubles)
- **Surrender**: Forfeit hand for 50% bet return
- **Insurance**: Side bet when dealer shows Ace (pays 2:1)

### Professional Features
- 6-deck shoe with realistic reshuffling
- Hidden dealer hole card
- Blackjack pays 3:2
- Dealer stands on all 17s
- Visual hand totals
- Smart button enabling/disabling
- High Roller leaderboard

## How to Play

1. **Start a New Game**:
   - Click "New Game" to begin with 1000 chips

2. **Place Your Bet**:
   - Click chip denomination buttons to build your bet
   - Click "Clear Bet" to start over
   - Click "Place Bet & Deal" when ready

3. **Special Situations**:
   - **Insurance**: If dealer shows Ace, Insurance button enables
   - **Split**: If you have matching cards, Split button enables
   - **Blackjack**: Natural 21 pays 3:2 automatically

4. **Make Your Play**:
   - **Hit**: Take another card
   - **Stand**: End your turn
   - **Double Down**: Available on first two cards with enough chips
   - **Surrender**: Available on first two cards before any action

5. **Dealer's Turn**:
   - Dealer reveals hole card
   - Dealer hits until 17 or higher
   - Outcome determined and chips awarded

6. **Continue Playing**:
   - Click "Next Round" to play again with current chips
   - Click "End Game" to save score to High Roller Board

## Requirements

- A modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- No server or backend needed (purely client-side)
- localStorage enabled for High Roller Board persistence

## File Structure

```
.
├─ index.html         # Main HTML with embedded CSS
├─ main.js            # UI logic, event handlers, and game flow
├─ BlackJackGame.js   # Core game logic and rules engine
├─ Card.js            # Card class definition
├─ Deck.js            # 6-deck shoe with shuffle and draw methods
├─ Hand.js            # Hand evaluation, blackjack detection, split logic
└─ README.md          # This file
```

## Technical Details

### Game Architecture

**BlackJackGame Class**:
- Manages game state (chips, bets, round progress)
- Handles all player actions (hit, stand, double, split, surrender)
- Implements dealer logic with async turn handling
- Determines outcomes with proper payout calculations

**Deck Class**:
- Creates 6-deck shoe (312 cards)
- Fisher-Yates shuffle algorithm
- Cut card at 75% penetration
- Auto-reshuffle when needed

**Hand Class**:
- Calculates hand values with Ace optimization
- Detects blackjack (2 cards = 21)
- Detects bust (> 21)
- Determines split eligibility
- Caches calculations for performance

**Main.js**:
- Manages UI updates and rendering
- Handles all user interactions
- Controls game flow and messaging
- Manages High Roller Board

### Performance Optimizations

1. **Cached Hand Calculations**: Hand values cached until cards change
2. **Efficient Rendering**: Minimal DOM manipulation
3. **Smart Button Updates**: State-driven UI updates
4. **Async Dealer Turn**: Non-blocking dealer animation with Promise
5. **Event Delegation**: Single event listeners where possible

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

Requires ES6 support (async/await, arrow functions, classes, template literals).

## Known Limitations

- **Split Hands**: Split feature is implemented but full split hand gameplay (playing each hand separately) is marked as "coming soon"
- **No Re-splitting**: Can only split once per round
- **No Side Bets**: Only insurance is available (no perfect pairs, 21+3, etc.)
- **localStorage Only**: High Roller Board doesn't sync across devices

## Future Enhancements

- Full split hand gameplay with separate actions for each hand
- Re-split support (up to 4 hands)
- Animated card dealing
- Sound effects
- Mobile-responsive design improvements
- Side bets (Perfect Pairs, 21+3)
- Card counting trainer mode
- Statistics tracking (win rate, blackjack frequency, etc.)
- Cloud-based leaderboard with authentication

## License

This project is open source—feel free to modify or use any portion for learning or building your own Blackjack game.

---

**Enjoy authentic casino blackjack gameplay right in your browser!**

Built with ❤️ and optimized with Claude Code
