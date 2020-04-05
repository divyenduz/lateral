export default class Task {
  private _command: string;
  private _task: Deno.Process;
  private _id: string;
  private _delay: number = 0;

  constructor(id: string, command: string, delay = 0) {
    this._command = command;
    this._task = Deno.run({
      // TODO: Make this run arbitrary shell code. Currently, it can only run shell executables
      args: this._command.split(" "),
      stdin: "piped",
      stdout: "piped",
      stderr: "piped"
    });
    this._id = id;
    this._delay = delay;
  }

  id() {
    return this._id;
  }

  async status() {
    const taskStatus = await this._task.status();
    return taskStatus;
  }

  async execute() {
    if (Boolean(this._delay)) {
      await this._sleep(this._delay);
    }
    const taskStatus = await this.status();
    const { code } = taskStatus;
    return code;
  }

  async log() {
    const output = await this._task.output();
    return new TextDecoder().decode(output);
  }

  // Timeout in seconds
  private async _sleep(timeout: number) {
    return new Promise(resolve => {
      setTimeout(resolve, timeout * 1000);
    });
  }
}
