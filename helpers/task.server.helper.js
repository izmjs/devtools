/* eslint-disable max-classes-per-file */

const { v4 } = require('uuid');
const { EventEmitter } = require('events');
const { spawn } = require('child_process');

class CmdTask {
  constructor(opts) {
    this.init(opts);
  }

  init({
    cmd,
    name,
    user,
    cmdArgs,
    cmdOpts,
  }) {
    this.name = name || 'New Task';
    this.key = v4();
    this.created_at = new Date();
    this.created_by = user ? {
      id: user.id,
      name: user.name,
    } : {
      name: 'guest',
    };
    this.created_by_uid = user ? user.id : null;
    this.progress = 0;
    this.output = '';
    this.error = '';
    this.status = 'INITIALIZED';

    this.process = spawn(cmd, cmdArgs, cmdOpts);

    this.process.on('data', (data) => {
      this.output += data;
    });

    this.process.on('error', (err) => {
      this.error += err;
    });

    this.process.on('close', () => {
      this.status = 'CLOSED';
    });
  }

  toJSON() {
    return {
      key: this.key,
      name: this.name,
      status: this.status,
      created_at: this.created_at,
      created_by: this.created_by,
    };
  }
}

class TaskList extends EventEmitter {
  constructor() {
    super();
    this.LIST = [];
  }

  /**
   * Adds a new task to the list
   * @param {Object} opts Task options
   */
  add(opts) {
    const task = new CmdTask(opts);
    this.LIST.push(task);
    return task;
  }
}

exports.TASKS = new TaskList();
