import { BufReader } from "https://deno.land/std/io/bufio.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";

import Job from "./Job.ts";
import Task from "./Task.ts";

const { DEBUG } = Deno.env();

const parsedArgs = parse(Deno.args);
const { delay, timeout } = parsedArgs;

if (DEBUG) {
  console.log(`Parameters: `, { delay, timeout });
}

const bufReader = new BufReader(Deno.stdin);
let line: any // TODO: Fix this type cast
;

let commands: string[] = [];
while ((line = await bufReader.readString("\n")) != Deno.EOF) {
  commands = commands.concat(line);
}

const tasks = commands.map((command, index) =>
  new Task({ id: index.toString(), command, delay, timeout })
);
const job = new Job({ tasks });
await job.execute();
const logs = await job.logs();
Object.values(logs).forEach((log) => {
  console.log(log);
});
