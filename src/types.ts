import { Component } from "react";

export interface InitPlayer {
  name: string;
}

export class Player {
  id: number;
  name: string;
  order: number;
  hand: {
    cards: Card[];
    done: boolean;
    value: number;
    winner: boolean;
  };

  constructor(name: string, order: number, id?: number) {
    this.id = id ?? Math.floor(Math.random() * 100000000);
    this.name = name;
    this.order = order;
    this.hand = {
      cards: [],
      done: false,
      value: 0,
      winner: false,
    };
  }
}

export interface Round {
  id: string;
  players: Player[];
  winner?: Player;
  draw?: boolean;
  done: boolean;
  winnerValue?: number;
  timestamp: number;
}

export interface Card {
  symbol: string;
  value: string;
  weight: number;
}

export type Deck = Card[];

export enum Action {
  HIT = "hit",
  STAY = "stay",
}

export interface IGame {
  rounds: Round[];
  players: Player[]; // I decided to build in this way instead of just playerName since it's more flexible
  delay: number;
  deck: Deck;
  currentPlayerTurn: number;
  isLoading: boolean;
  booted: boolean;
  _provider?: Component;
  update(): void;
  new: (delay: number, players: InitPlayer[]) => void;
  start: () => Promise<void>;
  regenerateDeck: () => void;
  drawHands: () => void;
  drawCard: () => Card;
  getNextPlayerIdx: () => number;
  getNextPlayer: () => Player;
  getCurrentPlayer: () => Player;
  setNextPlayerTurn: () => void;
  updatePlayerHandValue: (playerIdx: number) => void;
  play: (player: Player, action: Action) => void;
  dealerPlay: () => void;
  calculateHandValue: (cards: Card[]) => number;
  waitDelay: () => Promise<void>;
  getPlayers: () => Player[];
}
