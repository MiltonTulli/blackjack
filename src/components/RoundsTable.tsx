import React, { useEffect } from "react";
import { DateTime } from "luxon";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Avatar,
  AvatarGroup,
} from "@nextui-org/react";
import { useGame } from "@/context/gameContext";
import { DEALER_ID, TIMEZONE } from "@/utils";
import { BlackJackUtils } from "@/lib/BlackJackUtils";
import { Round } from "@/types";

const columns = [
  { name: "Date", uid: "date" },
  { name: "Players", uid: "players" },
  { name: "Result", uid: "result" },
];

export function RoundsTable() {
  const [oldRounds, setOldRounds] = React.useState<Round[]>([]);
  const game = useGame();

  const gameData = React.useMemo(
    () => game.rounds.filter((round) => round.done),
    [game.rounds.length] // eslint-disable-line
  );

  useEffect(() => {
    const fetchPreviousRounds = async () => {
      const playerNames: string[] = game.players
        .filter((player) => player.id !== DEALER_ID)
        .map((player) => player.name);
      try {
        // Just for this example I will fetch only first player data
        const response = await fetch(`/api/user/${playerNames[0]}/rounds`);
        const json: { data: Round[] } = await response.json();
        setOldRounds(json.data);
      } catch (e) {
        // TODO: handle error
      }
    };
    fetchPreviousRounds();
  }, [game.players.length]); // eslint-disable-line

  const data = [...gameData, ...oldRounds];

  const renderCell = React.useCallback((rowData: Round, columnKey: any) => {
    switch (columnKey) {
      case "date":
        return DateTime.fromMillis(rowData.timestamp)
          .setZone(TIMEZONE)
          .toFormat("FF");
      case "players":
        return (
          <AvatarGroup isBordered className="flex flex-row justify-start">
            {rowData.players.map((player) => {
              const cards = player.hand.cards
                .map(
                  (card) =>
                    `${card.value}${BlackJackUtils.getSymbol(card.symbol)}`
                )
                .join("  ");
              const label = `${player.name} | ${cards} | ${player.hand.value} Points`;
              return (
                <Tooltip key={player.id} content={label}>
                  <Avatar
                    src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${player.name}`}
                  />
                </Tooltip>
              );
            })}
          </AvatarGroup>
        );
      case "result":
        const hasWinner = !rowData.draw;
        return hasWinner
          ? `${rowData?.winner?.name} won | ${rowData?.winnerValue} Points`
          : "Draw";

      default:
        return " - ";
    }
  }, []);
  if (!game.booted) return null;
  return (
    <>
      <div className="flex container justify-start items-start">
        <span className="mb-2  text-lg  font-sans">Recent rounds:</span>
      </div>
      <Table aria-label="Example table with custom cells">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={"start"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={data} emptyContent={"No previous rounds found"}>
          {(rowData) => (
            <TableRow key={rowData.id}>
              {(columnKey) => {
                return <TableCell>{renderCell(rowData, columnKey)}</TableCell>;
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
