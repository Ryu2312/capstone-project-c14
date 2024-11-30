"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const __1 = require("..");
const umzug_1 = require("umzug");
const seeds = new umzug_1.Umzug({
    migrations: { glob: node_path_1.default.join(__dirname, "..", "seeds", "*.ts") },
    context: { query: __1.query },
    storage: new umzug_1.JSONStorage({
        path: node_path_1.default.join(__dirname, "..", "seeds", "migrations.json"),
    }),
    logger: console,
    create: {
        folder: node_path_1.default.join(__dirname, "..", "seeds"),
        template: (filepath) => [
            [
                filepath,
                node_fs_1.default
                    .readFileSync(node_path_1.default.join(__dirname, "..", "template/seeds-template.ts"))
                    .toString(),
            ],
        ],
    },
});
seeds.runAsCLI().then(() => __1.pool.end());
