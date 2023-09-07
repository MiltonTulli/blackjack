import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useRef,
  Component,
} from "react";
import { DateTime } from "luxon";
import { BlackJackUtils } from "@/lib/BlackJackUtils";
import { DEALER_ORDER, DEALER_ID, uuid, TIMEZONE } from "@/utils";
import { Card, Deck, Player, Round, InitPlayer, Action, IGame } from "@/types";

const dealer = new Player("Dealer", DEALER_ORDER, DEALER_ID);
const blackJack = new BlackJackUtils();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface GameContextReturn {
  players: Player[];
  rounds: Round[];
  isLoading: boolean;
  booted: boolean;
  currentPlayerTurn: number;
  displayDealerCard: boolean;
  create: (delay: number, players: InitPlayer[]) => void;
  play: (playerId: number, action: Action) => void;
  start: () => Promise<void>;
  newRound: () => void;
  reset: () => void;
  getCurrentRound: () => Round | undefined;
}

const defaultContext = {
  players: [],
  rounds: [],
  isLoading: false,
  booted: false,
  currentPlayerTurn: DEALER_ORDER,
  displayDealerCard: false,
  create: (delay: number, players: InitPlayer[]) => {},
  play: (playerId: number, action: Action) => {},
  start: async () => Promise.resolve(),
  newRound: () => {},
  reset: () => {},
  getCurrentRound: () => undefined,
};

const GameContext = createContext<GameContextReturn>(defaultContext);

interface GameProviderProps {
  children: ReactNode;
}
interface GameProviderState {
  rounds: Round[];
  players: Player[]; // I decided to build in this way instead of just playerName since it's more flexible
  delay: number;
  currentPlayerTurn: number;
  booted: boolean;
  isLoading: boolean;
  currentRound: string;
  displayDealerCard: boolean;
}

const initialState = {
  rounds: [],
  players: [], // I decided to build in this way instead of just playerName since it's more flexible
  delay: 0,
  currentPlayerTurn: 0,
  isLoading: false,
  booted: false,
  currentRound: "",
  displayDealerCard: false,
};
export class GameProvider extends Component<
  GameProviderProps,
  GameProviderState
> {
  state: GameProviderState = {
    ...initialState,
  };

  create = (delay: number, players: InitPlayer[]) => {
    this.setState({
      rounds: [],
      players: [
        dealer,
        ...players.map((p, i) => new Player(p.name, i + 1 /** Skip order=0 */)),
      ],
      delay: delay,
      currentPlayerTurn: DEALER_ORDER,
      booted: true,
    });
    this.start();
  };

  // start the game
  start = async () => {
    this.setState((prevState) => {
      const newRound: Round = {
        players: prevState.players,
        id: uuid(),
        done: false,
        timestamp: DateTime.now().setZone(TIMEZONE).toMillis(),
      };
      return {
        ...prevState,
        rounds: [...prevState.rounds, newRound],
        currentRound: newRound.id,
      };
    });

    await this.waitForDealer();
    this.drawInitialHands();
    await this.setNextPlayerTurn(); // pass to first player
  };

  drawInitialHands = () => {
    const updatedPlayers = this.state.players.map((player) => {
      const card1 = blackJack.drawCard();
      const card2 = blackJack.drawCard();
      const cards = [card1, card2];
      const value = BlackJackUtils.calculateHandValue(cards);
      return {
        ...player,
        hand: {
          ...player.hand,
          cards,
          done: false,
          value,
        },
      };
    });
    this.setState(() => ({ players: updatedPlayers }));
  };

  getNextPlayerOrder = () => {
    const currentPlayerIdx: number = this.state.currentPlayerTurn;
    let next = currentPlayerIdx + 1;
    if (next >= this.state.players.length) {
      next = DEALER_ORDER;
    }
    return next;
  };

  getNextPlayer = () => {
    const nextOrder = this.getNextPlayerOrder();
    return this.state.players.find((player) => player.order === nextOrder);
  };

  getCurrentPlayer = () => {
    return this.state.players.find(
      (player) => player.order === this.state.currentPlayerTurn
    )!; // Always returns a player
  };

  setNextPlayerTurn = async () => {
    const next = this.getNextPlayerOrder();
    this.setState((prev) => ({ currentPlayerTurn: next }));
    if (next === DEALER_ORDER) {
      await this.dealerPlay();
    }
  };

  play = async (playerId: number, action: Action) => {
    let currentPlayer = { ...this.getCurrentPlayer() };
    // Check if is players turn
    if (playerId !== currentPlayer.id) {
      console.error("NOT PLAYER TURN");
      return;
    }

    if (action === Action.HIT) {
      // pick new card
      const newCard = blackJack.drawCard();
      const newCards = [...currentPlayer.hand.cards, newCard];
      const value = BlackJackUtils.calculateHandValue(newCards);
      currentPlayer = {
        ...currentPlayer,
        hand: {
          ...currentPlayer.hand,
          cards: newCards,
          value: value,
          done: value >= 21,
        },
      };
    } else if (action === Action.STAY) {
      currentPlayer.hand.done = true; // user finish playing the current hand
    }

    const updatedPlayers = this.state.players.map((player) =>
      player.id === currentPlayer.id ? currentPlayer : player
    );
    this.setState(
      () => ({ players: updatedPlayers }),
      async () => {
        if (currentPlayer.hand.done) await this.setNextPlayerTurn();
      }
    );
  };

  updatePlayerHandValue = (playerId: number) => {
    this.setState((prev) => ({
      players: prev.players.map((player) => {
        if (player.id === playerId) {
          player.hand.value = BlackJackUtils.calculateHandValue(
            player.hand.cards
          );
        }
        return player;
      }),
    }));
  };

  dealerPlay = async () => {
    const dealer = {
      ...this.state.players.find((player) => player.id === DEALER_ID)!,
    };

    let dealerHandValue = BlackJackUtils.calculateHandValue(
      dealer?.hand?.cards!
    );

    // Show hidden card
    this.setState({
      displayDealerCard: true,
    });

    // Implement the dealer's logic (hit until 17)
    while (dealerHandValue < 17) {
      await this.waitForDealer();
      const card = blackJack.drawCard();
      this.setState(
        (prev) => ({
          players: prev.players.map((player) => {
            if (player.id === dealer.id) {
              return {
                ...player,
                hand: {
                  ...player.hand,
                  cards: [...player.hand.cards, card],
                  value: BlackJackUtils.calculateHandValue([
                    ...player.hand.cards,
                    card,
                  ]),
                },
              };
            }
            return player;
          }),
        }),
        () => {
          dealerHandValue = this.state.players.find((p) => p.id === DEALER_ID)
            ?.hand.value!;
        }
      );
      await this.waitForDealer();
    }

    this.setState((prev) => {
      const updatedPlayers = prev.players.map((p) => {
        if (p.id === DEALER_ID) {
          return {
            ...p,
            hand: {
              ...p.hand,
              done: true,
            },
          };
        }
        return p;
      });
      return {
        players: updatedPlayers,
      };
    });

    // finish round
    this.finishRound();
  };

  storeRound = async (round: Round) => {
    return await fetch("/api/rounds", {
      method: "POST",
      headers: {},
      body: JSON.stringify({ round }),
    });
  };

  finishRound = () => {
    // Determine the winner based on hand values
    let winners: Player[] = [];
    let winningValue = -1;

    for (const player of this.state.players) {
      const playerHandValue = BlackJackUtils.calculateHandValue(
        player.hand.cards
      );
      if (playerHandValue <= 21) {
        if (playerHandValue > winningValue) {
          winners = [player];
          winningValue = playerHandValue;
        } else if (playerHandValue === winningValue) {
          winners.push(player);
        }
      }
    }

    // Update the winner and round status in the state
    const isDraw = winners.length !== 1;
    this.setState(
      (prevState) => {
        const updatedPlayers = prevState.players.map((player) => {
          if (!isDraw && winners.some((winner) => winner.id === player.id)) {
            player.hand.winner = true;
          }
          return player;
        });

        const filteredRounds = prevState.rounds.map((round) => {
          if (round.id === prevState.currentRound) {
            return {
              ...round,
              winner: isDraw ? undefined : winners[0],
              winnerValue: isDraw ? undefined : winners[0].hand.value,
              draw: isDraw,
              done: true,
              players: prevState.players,
            };
          }
          return round;
        });

        return {
          players: updatedPlayers,
          rounds: filteredRounds,
        };
      },
      async () => {
        const currentRound = this.getCurrentRound();
        await this.storeRound(currentRound);
      }
    );
  };

  waitForDealer = async () => {
    this.setState({ isLoading: true });
    await delay(this.state.delay);
    // await new Promise((resolve) => setTimeout(resolve, this.state.delay));
    this.setState({ isLoading: false });
  };

  getPlayers = () => {
    return this.state.players;
  };

  getCurrentRound = (): Round => {
    return this.state.rounds.find(
      (round) => round.id === this.state.currentRound
    )!;
  };

  newRound = () => {
    this.setState((prev) => {
      const updatedPlayers = prev.players.map((player) => ({
        ...player,
        hand: {
          ...player.hand,
          cards: [],
          done: false,
          value: 0,
        },
      }));
      return {
        players: updatedPlayers,
        displayDealerCard: false,
      };
    });
    this.start();
  };

  reset = () => {
    this.setState(initialState);
  };

  render() {
    return (
      <GameContext.Provider
        value={{
          // state
          players: this.state.players,
          isLoading: this.state.isLoading,
          booted: this.state.booted,
          currentPlayerTurn: this.state.currentPlayerTurn,
          rounds: this.state.rounds,
          displayDealerCard: this.state.displayDealerCard,

          // actions
          create: this.create,
          start: this.start,
          play: this.play,
          newRound: this.newRound,
          reset: this.reset,
          getCurrentRound: this.getCurrentRound,
        }}
      >
        {this.props.children}
      </GameContext.Provider>
    );
  }
}

export const useGame = () => useContext(GameContext);
