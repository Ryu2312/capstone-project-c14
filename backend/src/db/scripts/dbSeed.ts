import path from "node:path";
import fs from "node:fs";
import { query, pool } from "..";
import { JSONStorage, Umzug } from "umzug";


const seeds = new Umzug({
  migrations: { glob: path.join(__dirname, "..", "seeds", "*.ts") },
  context: { query },
  storage: new JSONStorage({
    path: path.join(__dirname, "..", "seeds", "migrations.json"),
  }),
  logger: console,
  create: {
    folder: path.join(__dirname, "..", "seeds"),
    template: (filepath) => [
      [
        filepath,
        fs
          .readFileSync(
            path.join(__dirname, "..", "template/seeds-template.ts")
          )
          .toString(),
      ],
    ],
  },
});

export type Seeds = typeof seeds._types.migration;

seeds.runAsCLI().then(() => pool.end());