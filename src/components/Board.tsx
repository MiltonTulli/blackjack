"use client";
import React, { useEffect } from "react";

import { useGame } from "@/context/gameContext";
import { Button } from "@nextui-org/react";
import { Card } from "@/components/Card";
import { Setup } from "./Setup";
import { DateTime } from "luxon";
import { RoundsTable } from "@/components/RoundsTable";
import { useSecondsCounter } from "@/hooks/counter";

import { FallbackCard } from "@/components/FallbackCard";
import {
  Badge,
  Avatar,
  Spinner,
  Divider,
  ButtonGroup,
  Chip,
} from "@nextui-org/react";
import { Action } from "@/types";
import { DEALER_ID } from "@/utils";

interface Props {
  children?: React.ReactNode;
}

export const Board: React.FC<Props> = ({ children }) => {
  const game = useGame();
  const { seconds, reset } = useSecondsCounter();
  const round = game.getCurrentRound();
  const loading = game.isLoading;
  const isRoundFinished = round?.done;
  const isDraw = round?.draw;

  useEffect(() => {
    reset();
  }, [game.currentPlayerTurn]); // eslint-disable-line

  return (
    <div className="border-1 p-8 border-slate-600">
      <div className="flex justify-center">
        <h1
          style={{
            textShadow: "white 3px 6px 50px",
          }}
          className="mb-8 m-auto text-6xl font-sans"
        >
          BlackJack
        </h1>
      </div>
      {!game.booted && <Setup />}
      <div className="grid gap-3 grid-flow-col-dense">
        {game.players.map((player) => {
          const myTurn = game.currentPlayerTurn === player.order;
          const isWinner =
            isRoundFinished && !isDraw && round.winner?.id === player.id;
          const isDealer = player.id === DEALER_ID;
          return (
            <div
              key={player.id}
              className={`shadow-2xl border-1 border-slate-600 gap-3 p-6 relative ${
                isWinner && isRoundFinished ? "bg-green-900" : ""
              }
              ${isDraw ? "bg-yellow-00" : ""}
              ${!isWinner && !isDraw && isRoundFinished ? "bg-red-900" : ""}
              rounded-2xl
              `}
            >
              {myTurn && !isRoundFinished && (
                <>
                  <Chip
                    color="success"
                    variant="dot"
                    className="absolute top-2 right-2 border-green-500"
                  >
                    Playing..
                  </Chip>
                  <Chip
                    color="warning"
                    className="absolute bottom-2 right-2 border-green-500"
                  >
                    timer: {seconds}
                  </Chip>
                </>
              )}

              <div className="flex gap-1">
                {player.hand.cards.length > 0
                  ? player.hand.cards.map((card, idx) => {
                      return (
                        <Card
                          key={idx}
                          card={card}
                          hidden={isDealer && idx === 0 && !myTurn}
                          index={Number(idx)}
                        />
                      );
                    })
                  : [0, 1].map((i) => <FallbackCard key={i} idx={i} />)}
              </div>
              <Divider className="bg-slate-500 my-5" />
              <div className="py-0 flex justify-start items-center gap-2">
                <Avatar
                  src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${player.name}`}
                  className="w-20 h-20 text-large"
                />
                <div>
                  <p className="text-3xl">{player.name}</p>
                  <p className="text-2xl">
                    {isDealer
                      ? game.displayDealerCard
                        ? player.hand.value + " Points"
                        : null
                      : player.hand.value + " Points"}
                  </p>
                </div>
              </div>
              {player.id !== 0 && myTurn && (
                <ButtonGroup className="py-4">
                  <Button
                    size="lg"
                    onClick={() => game.play(player.id, Action.HIT)}
                    color="primary"
                  >
                    Hit
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => game.play(player.id, Action.STAY)}
                    color="warning"
                  >
                    Stay
                  </Button>
                </ButtonGroup>
              )}
              {isDealer && loading && (
                <div className="py-4">
                  <Button isLoading isDisabled disabled size="lg">
                    Dealing / thinking
                  </Button>
                </div>
              )}

              {isRoundFinished && (
                <Chip variant="shadow" className="my-3">
                  {isDraw ? "Draw" : isWinner ? "Won the round!" : "Lost!"}
                </Chip>
              )}
            </div>
          );
        })}
      </div>

      {game.booted && (
        <div className="flex gap-2 my-8">
          <Button isDisabled={!isRoundFinished} onClick={game.newRound}>
            New Round
          </Button>
          <Button onClick={game.reset}>Reset players</Button>
        </div>
      )}

      {game.booted && <Divider className="bg-slate-500 my-5" />}

      <RoundsTable />
    </div>
  );
};
