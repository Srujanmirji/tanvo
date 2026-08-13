#!/usr/bin/env node
/**
 * Generates the PBKDF2 hash + salt pair for the admin gate.
 *
 *   npm run admin:hash                 → prompts for a password
 *   npm run admin:hash -- "my secret"  → non-interactive
 *
 * Copy the printed lines into your .env file. The plaintext password
 * is never written to disk by this script.
 *
 * Must stay byte-identical to `derive()` in src/lib/auth.js:
 * PBKDF2-HMAC-SHA256, 210,000 iterations, 32-byte output, UTF-8 salt.
 */
import { pbkdf2Sync, randomBytes } from 'node:crypto';
import { createInterface } from 'node:readline';
import { stdin, stdout, argv, exit } from 'node:process';

const ITERATIONS = 210_000;
const KEY_LENGTH = 32;

function derive(password, salt) {
  return pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, 'sha256').toString('hex');
}

function ask(question) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: stdin, output: stdout });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

function assess(password) {
  const issues = [];
  if (password.length < 12) issues.push('use at least 12 characters');
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password))
    issues.push('mix upper and lower case');
  if (!/\d/.test(password)) issues.push('include a digit');
  if (!/[^A-Za-z0-9]/.test(password)) issues.push('include a symbol');
  return issues;
}

const password = argv[2] ?? (await ask('Admin password: '));

if (!password || !password.trim()) {
  console.error('\n  No password provided. Aborting.\n');
  exit(1);
}

const issues = assess(password);
if (issues.length) {
  console.warn(`\n  ⚠  Weak password — consider: ${issues.join(', ')}.`);
}

const salt = randomBytes(16).toString('hex');
const hash = derive(password, salt);

console.log(`
  Add these two lines to your .env file (never commit it):

  VITE_ADMIN_SALT=${salt}
  VITE_ADMIN_PASSWORD_HASH=${hash}

  Reminder: this hash ships inside the client bundle. It keeps /admin
  private from the public and from search engines, but it is not a
  substitute for server-side auth. See README → "Hardening the admin route".
`);
