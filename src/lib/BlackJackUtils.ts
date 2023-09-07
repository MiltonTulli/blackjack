import { symbols, cardValues, MIN_DECK_LENGTH } from "@/utils/constants";
import { Card, Deck } from "@/types";
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
