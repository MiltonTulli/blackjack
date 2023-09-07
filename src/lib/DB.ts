import * as fs from "fs";
import * as path from "path";
import { Round } from "@/types";

interface IDB {
  rounds?: Round[];
}
export class FakeDb {
  private dbFilePath: string;

  constructor() {
    this.dbFilePath = path.join(process.cwd(), "/src/db.json");
  }

  private readDb(): IDB {
    try {
      const dbData = fs.readFileSync(this.dbFilePath, "utf-8");
      return JSON.parse(dbData);
    } catch (error) {
      console.log("error reading db", error);
      return {};
    }
  }

  private writeDbRounds(rounds: Round[]): void {
    fs.writeFileSync(this.dbFilePath, JSON.stringify({ rounds }, null, 2));
  }

  public drop(): Promise<void> {
    return new Promise(async (resolve) => {
      this.writeDbRounds([]);
      resolve(); // returns all rounds
    });
  }

  public async getRounds(): Promise<Round[]> {
    return new Promise((resolve) => {
      return resolve(this.readDb()?.rounds ?? []);
    });
  }

  public async saveRound(round: Round): Promise<Round[]> {
    return new Promise(async (resolve) => {
      const rounds = await this.getRounds();
      rounds.push(round);
      this.writeDbRounds(rounds);
      resolve(rounds); // returns all rounds
    });
  }

  // TODO: build fetcher to get rounds from multiple users
  public async queryRoundsByUserId(userId: number): Promise<Round[]> {
    return new Promise(async (resolve) => {
      const rounds = await this.getRounds();
      const userRounds = rounds.filter((round) =>
        round.players?.some((player) => player.id === userId)
      );
      resolve(userRounds);
    });
  }
  public async queryRoundsByUserName(userName: string): Promise<Round[]> {
    return new Promise(async (resolve) => {
      const rounds = await this.getRounds();
      const userRounds = rounds.filter((round) =>
        round.players?.some(
          (player) =>
            player.name.trim().toLowerCase() === userName.trim().toLowerCase()
        )
      );
      resolve(userRounds);
    });
  }
}

export const db = new FakeDb();
