import { BufReader } from "https://deno.land/std/io/bufio.ts";

import Job from './Job.ts'
import Task from './Task.ts'

const bufReader = new BufReader(Deno.stdin);
let line: any; // TODO: Fix this type cast

let commands: string[] = [];
while ((line = await bufReader.readString("\n")) != Deno.EOF) {
  commands = commands.concat(line);
}

const tasks = commands.map((command, index) =>
  new Task(index.toString(), command, 1)
);
const job = new Job(tasks);
await job.execute();
const logs = await job.logs();
Object.values(logs).forEach(log => {
  console.log(log);
});
