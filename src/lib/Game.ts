// import { symbols, cardValues } from "@/utils/constants";
//------- constnts
import { symbols, cardValues, MIN_DECK_LENGTH } from "@/utils/constants";
import { Card, Deck, Player, Round, InitPlayer, Action, IGame } from "@/types";
import { Component, ComponentClass } from "react";
///----------- types

//// ----- -utils

// ---- main class
// export default class Game implements IGame {
//   //   rounds: Round[];
//   rounds: Round[] = [];
//   players: Player[] = []; // I decided to build in this way instead of just playerName since it's more flexible
//   delay: number = 0;
//   deck: Deck = [];
//   currentPlayerTurn: number = 0;
//   isLoading: boolean = false;
//   booted: boolean = false;

//   update() {}

//   // Boots game
//   new(delay: number, players: InitPlayer[]) {
//     console.log("Starting new game");
//     this.rounds = [];
//     this.players = [dealer, ...players.map((p) => new Player(p.name))];
//     this.delay = delay;
//     this.deck = [];
//     this.currentPlayerTurn = 0;
//     this.booted = true;
//     this.start();
//     this.update();
//   }

//   // start the game
//   async start() {
//     if (this.deck.length < MIN_DECK_LENGTH) this.regenerateDeck();
//     await this.waitDelay();
//     this.drawHands();
//     this.setNextPlayerTurn(); // pass to first player
//     this.update();
//   }

//   regenerateDeck() {
//     this.deck = BlackJack.shuffleDeck(
//       Array.from({ length: 6 }, BlackJack.buildSingleDeck).flat()
//     );
//     this.update();
//   }

//   drawHands() {
//     this.players.forEach((player) => {
//       const card1 = this.drawCard();
//       const card2 = this.drawCard();
//       const cards = [card1, card2];
//       const value = this.calculateHandValue(cards);
//       player.hand = {
//         cards: [card1, card2],
//         done: false,
//         value,
//       };
//     });
//     this.update();
//   }

//   drawCard(): Card {
//     if (this.deck.length < MIN_DECK_LENGTH) this.regenerateDeck();
//     return this.deck.pop() as Card;
//     this.update();
//   }

//   getNextPlayerIdx() {
//     const currentPlayer: number = this.currentPlayerTurn;
//     let next = currentPlayer + 1;
//     if (next >= this.players.length) {
//       next = 0;
//     }
//     return next;
//   }

//   getNextPlayer() {
//     return this.players[this.getNextPlayerIdx()];
//   }

//   getCurrentPlayer() {
//     return this.players[this.currentPlayerTurn];
//   }

//   setNextPlayerTurn() {
//     const next = this.getNextPlayerIdx();
//     this.currentPlayerTurn = next;
//     if (next === 0) this.dealerPlay();
//     this.update();
//   }

//   updatePlayerHandValue(playerIdx: number) {
//     this.players[playerIdx].hand.value = this.calculateHandValue(
//       this.players[playerIdx].hand.cards
//     );
//     this.update();
//   }

//   play(player: Player, action: Action) {
//     const currentPlayer = this.players[this.currentPlayerTurn];
//     // Check if is players turn
//     if (player.id !== currentPlayer.id) {
//       console.error("NOT PLAYER TURN");
//       return;
//     }
//     if (action === Action.HIT) {
//       // pick new card
//       const newCard = this.drawCard();
//       // store new card into player hand cards array
//       this.players[this.currentPlayerTurn].hand.cards.push(newCard);
//       // update hand total value
//       this.updatePlayerHandValue(this.currentPlayerTurn);
//       if (this.players[this.currentPlayerTurn].hand.value >= 21) {
//         this.players[this.currentPlayerTurn].hand.done = true;
//         this.setNextPlayerTurn();
//       }
//     } else if (action === Action.STAY) {
//       this.players[this.currentPlayerTurn].hand.done = true;
//       this.setNextPlayerTurn();
//     }
//     this.update();
//   }

//   dealerPlay() {
//     let dealerHandValue = this.calculateHandValue(this.players[0].hand.cards);
//     // Implement the dealer's logic (hit until 17 or more)
//     while (dealerHandValue < 17) {
//       const card = this.drawCard();
//       this.players[0].hand.cards.push(card);
//       dealerHandValue = this.calculateHandValue(this.players[0].hand.cards);
//       this.update();
//     }
//   }

//   calculateHandValue(cards: Card[]) {
//     let value = 0;
//     let numAces = 0;

//     for (const card of cards) {
//       const cardValue = card.weight;
//       value += cardValue;

//       if (card.value === "A") {
//         numAces++;
//       }
//     }

//     // TODO: by default A = 1; User should be able to pick.
//     while (numAces > 0 && value > 21) {
//       value -= 10; // Change the value of an Ace from 11 to 1
//       numAces--;
//     }

//     return value;
//   }

//   async waitDelay() {
//     await new Promise((resolve) => setTimeout(resolve, this.delay));
//     this.update();
//   }

//   getPlayers() {
//     return this.players;
//   }
// }

export class BlackJackUtils {
  public deck: Card[] = [];

  constructor(decksAmount: number = 6) {
    this.deck = this.regenerateDeck(decksAmount);
  }

  static shuffleDeck(deck: Deck) {
    const shuffledDeck = [...deck]; // Create a copy of the original deck to shuffle
    let currentIndex = shuffledDeck.length;
    let randomIndex, tempValue;

    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      tempValue = shuffledDeck[currentIndex];
      shuffledDeck[currentIndex] = shuffledDeck[randomIndex];
      shuffledDeck[randomIndex] = tempValue;
    }

    return shuffledDeck; // Return the shuffled deck without modifying the original
  }

  static buildSingleDeck(): Card[] {
    return symbols.flatMap((symbol) => {
      return cardValues.map((value) => {
        return {
          symbol,
          value,
          weight: BlackJackUtils.getCardWeight(value),
        };
      });
    });
  }

  static calculateHandValue(cards: Card[]) {
    let value = 0;
    let numAces = 0;

    for (const card of cards) {
      const cardValue = card.weight;
      value += cardValue;

      if (card.value === "A") {
        numAces++;
      }
    }

    // TODO: User should be able to pick 1 or 11
    while (numAces > 0 && value > 21) {
      value -= 10; // Change the value of an Ace from 11 to 1
      numAces--;
    }

    return value;
  }

  static getCardWeight(value: string) {
    if (Number.isNaN(Number(value))) {
      return ["J", "Q", "K"].includes(value) ? 10 : 11;
    }
    return Number(value);
  }

  regenerateDeck = (decksAmount: number = 6): Card[] => {
    const newDeck = BlackJackUtils.shuffleDeck(
      Array.from({ length: decksAmount }, BlackJackUtils.buildSingleDeck).flat()
    );
    return newDeck;
  };

  /**
   * @description Pops the last card from deck
   * @returns Card
   */
  drawCard(): Card {
    if (this.deck.length < MIN_DECK_LENGTH) this.regenerateDeck();
    return this.deck.pop() as Card;
  }

  static getSymbol = (symbol: string) => {
    return {
      Spades: "♠",
      Hearts: "♥",
      Diamonds: "♦",
      Clubs: "♣",
    }[symbol];
  };
}
