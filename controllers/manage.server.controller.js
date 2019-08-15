// eslint-disable-next-line import/no-unresolved
const { getIO } = require('utils');
const { access } = require('fs');
const { resolve } = require('path');
const { promisify } = require('util');
const find$ = require('find-process');

const { npmCmd } = require('../helpers/npm.server.helper');
const { TASKS } = require('../helpers/task.server.helper');

const access$ = promisify(access);

/**
 * Get process tree
 * @controller Process tree
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.processTree = async function processTree(req, res, next) {
  const list = await find$('name', 'node');
  const tree = [];
  let current = list.find(one => one.pid === process.pid);

  function isPpid(one) {
    return one.pid === current.ppid;
  }

  while (current) {
    tree.push(current);
    current = list.find(isPpid);
  }

  req.data = {
    ...req.data,
    tree,
  };

  return next();
};

/**
 * Return process tree
 * @controller Process Tree Result
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.processTreeResult = async function processTreeResult(req, res) {
  res.json(req.data.tree);
};

/**
 * Restart current process
 * @controller Restart
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.restart = async function restart(req, res) {
  const { tree } = req.data;
  const nodemon = tree.find(one => one.cmd.includes('nodemon'));

  if (!nodemon) {
    return res.status(400).json({
      message: req.t('MANAGE_PROCESS_NOT_NODEMON'),
    });
  }

  try {
    process.kill(nodemon.pid, 'SIGHUP');
  } catch (e) {
    return res.status(400).json({
      message: req.t('MANAGE_PROCESS_WINDOWS_SUPPORT'),
    });
  }

  return res.status(204).end();
};

/**
 * Check the server is up and running
 * @controller Check
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.check = async function check(req, res) {
  res.status(204).end();
};

/**
 * Generate new module
 * @controller New Module
 * @param {IncommingMessage} req The request
 * @param {OutcommingMessage} res The response
 * @param {Function} next Go to the next middleware
 */
exports.addModule = async function addModule(req, res) {
  const { name, git, install } = req.body;

  try {
    await access$(resolve('modules', name));
    return res.status(400).json({
      message: req.t('FOLDER_ALREDY_EXIST'),
    });
  } catch (e) {
    // Do nothing, everything is fine, just proceed
  }

  const io = getIO();
  const t = TASKS.add({
    cmd: npmCmd,
    cmdArgs: [
      'run',
      'generate:module',
      '--',
      '--',
      `--name=${name}`,
      `--git=${git === true}`,
      `--install=${install === true}`,
    ],
    cmdOpts: {
      cwd: resolve(),
      encoding: 'utf8',
    },
    user: req.user,
  });

  const rooms = [
    'tasks',
    `tasks:${t.key}`,
  ];

  t.process.stdout.on('data', (data) => {
    [
      ...rooms,
      `tasks:${t.key}:stdout`,
    ].forEach((room) => {
      io.to(room).emit('tasks', {
        task: t.key,
        event: 'data',
        data: data.toString(),
      });
    });
  });

  t.process.stderr.on('error', (data) => {
    [
      ...rooms,
      `tasks:${t.key}:stdout`,
    ].forEach((room) => {
      io.to(room).emit('tasks', {
        task: t.key,
        event: 'error',
        data: data.toString(),
      });
    });
  });

  t.process.on('exit', (data) => {
    [
      ...rooms,
      `tasks:${t.key}:exit`,
    ].forEach((room) => {
      io.to(room).emit('tasks', {
        data,
        task: t.key,
        event: 'exit',
      });
    });
  });

  return res.status(202).json(t.toJSON());
};
