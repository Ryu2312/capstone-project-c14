import { Seeds } from "../scripts/dbSeed";

export const up: Seeds = async (params) => {
  params.context.query(`RAISE EXCEPTION 'up seed not implemented'`);
};
export const down: Seeds = async (params) => {
  params.context.query(`RAISE EXCEPTION 'down seed not implemented'`);
};