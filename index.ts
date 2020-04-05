import { BufReader } from "https://deno.land/std/io/bufio.ts";

const bufReader = new BufReader(Deno.stdin);
let line: any; // TODO: Fix this type cast

let commands: string[] = [];
while ((line = await bufReader.readString("\n")) != Deno.EOF) {
  commands = commands.concat(line);
}

// Task = Sub Process

class Job {
  private _tasks: Task[];

  private _logs: {
    [key: string]: string;
  } = {};

  constructor(tasks: Task[], delay = 0) {
    this._tasks = tasks;
  }

  async logs() {
    return this._logs;
  }

  async getLog(id: string) {
    return this._logs[id];
  }

  async execute() {
    return Promise.allSettled(this._tasks.map(task => {
      return task.execute().then(async (code) => {
        this._logs[task.id()] = await task.log();
      });
    }));
  }
}

class Task {
  private _command: string;
  private _task: Deno.Process;
  private _id: string;

  constructor(id: string, command: string) {
    this._command = command;
    this._task = Deno.run({
      // TODO: Make this run arbitrary shell code. Currently, it can only run shell executables
      args: this._command.split(" "),
      stdin: "piped",
      stdout: "piped",
      stderr: "piped"
    });
    this._id = id;
  }

  id() {
    return this._id;
  }

  async status() {
    const taskStatus = await this._task.status();
    return taskStatus;
  }

  async execute() {
    const taskStatus = await this.status();
    const { code } = taskStatus;
    return code;
  }

  async log() {
    const output = await this._task.output();
    return new TextDecoder().decode(output);
  }
}

const tasks = commands.map((command, index) =>
  new Task(index.toString(), command)
);
const job = new Job(tasks);
await job.execute();
console.log(await job.logs());
