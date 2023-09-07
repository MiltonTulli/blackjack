import React, { ChangeEvent, HTMLAttributeAnchorTarget } from "react";
import { Input, Button } from "@nextui-org/react";
import { useGame } from "@/context/gameContext";
import { IconUserPlus } from "@tabler/icons-react";
import { Listbox, ListboxItem } from "@nextui-org/react";

interface Player {
  name: string;
  key: string;
}
export function Setup() {
  const game = useGame();

  const [players, setPlayers] = React.useState<Player[]>([]);
  const [newPlayer, setNewPlayer] = React.useState("");

  const updatePlayerName = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewPlayer(e.target.value);

  const handleAddNewPlayer = () => {
    setPlayers((prev) => [
      ...prev,
      { name: newPlayer.trim(), key: String(prev.length + 1) },
    ]);
    setNewPlayer("");
  };

  const handleremovePlayer = (key: string) => {
    setPlayers((prev) => prev.filter((player) => player.key !== key));
  };

  const handleBoot = () => {
    game.create(3000, players);
  };

  return (
    <div className="flex justify-center align-middle">
      <div className="w-60 grid  gap-4">
        <Input
          type="text"
          label="Name"
          placeholder="Enter Player name"
          onChange={updatePlayerName}
          name={"playerName"}
          value={newPlayer}
          fullWidth
        />

        <Button
          variant="bordered"
          startContent={<IconUserPlus />}
          onClick={handleAddNewPlayer}
          isDisabled={!newPlayer.trim().length}
        >
          Add Player
        </Button>

        {!!players.length && (
          <>
            <p className="font-sans">Players Ready!</p>
            <div className="w-full max-w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
              <Listbox
                aria-label="Remove"
                onAction={(key) => handleremovePlayer(String(key))}
              >
                {players?.map((player) => {
                  return (
                    <ListboxItem key={player.key}>
                      {player.key}: {player.name}
                    </ListboxItem>
                  );
                })}
              </Listbox>
            </div>
          </>
        )}

        {!!players.length && (
          <Button onClick={handleBoot} color="primary">
            Start Blackjack
          </Button>
        )}
      </div>
    </div>
  );
}
