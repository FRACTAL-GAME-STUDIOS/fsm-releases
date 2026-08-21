#!/usr/bin/env node
// Verifies a Fractal Servers Manager release manifest against the project's
// Ed25519 public key. The panel and the agent do exactly this before they
// install anything; this script exists so you can do it yourself.
//
//   node verify-release.mjs fsm-release.json fsm-release.json.sig
//
// Exits 0 and prints the release contents if the signature is genuine,
// non-zero otherwise. No dependencies — plain Node.js 18 or newer.

import { createPublicKey, verify } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))

// An Ed25519 SPKI document is a fixed 12-byte header followed by the 32-byte
// key, so a raw key can be turned into something crypto accepts by prefixing it.
const SPKI_ED25519_HEADER = Buffer.from('302a300506032b6570032100', 'hex')

function loadPublicKey() {
  const raw = readFileSync(join(HERE, 'PUBLIC_KEY.txt'), 'utf8').trim()
  const bytes = Buffer.from(raw, 'base64')
  if (bytes.length !== 32) {
    throw new Error(`PUBLIC_KEY.txt is not a 32-byte Ed25519 key (got ${bytes.length} bytes)`)
  }
  return createPublicKey({
    key: Buffer.concat([SPKI_ED25519_HEADER, bytes]),
    format: 'der',
    type: 'spki',
  })
}

function fail(message) {
  console.error(`FAILED: ${message}`)
  process.exit(1)
}

const [manifestPath, signaturePath] = process.argv.slice(2)
if (!manifestPath || !signaturePath) {
  console.error('usage: node verify-release.mjs <fsm-release.json> <fsm-release.json.sig>')
  process.exit(2)
}

const manifestBytes = readFileSync(manifestPath)
const signatureText = readFileSync(signaturePath, 'utf8').trim()
const signature = Buffer.from(signatureText, 'base64')

// Signature over the raw bytes first. Parsing a manifest before knowing it is
// genuine means parsing an attacker's input, so this order is not negotiable.
if (!verify(null, manifestBytes, loadPublicKey(), signature)) {
  fail('the signature does not match this manifest. Do not install these files.')
}

let manifest
try {
  manifest = JSON.parse(manifestBytes.toString('utf8'))
} catch {
  fail('the signature is valid but the manifest is not readable JSON.')
}

console.log(`Signature OK — release ${manifest.version}, published ${manifest.publishedAt}`)
console.log(`Changelog: ${manifest.changelogUrl}`)
console.log('')
for (const [id, artifact] of Object.entries(manifest.artifacts ?? {})) {
  console.log(`${id}`)
  console.log(`  file    ${artifact.file}`)
  console.log(`  size    ${artifact.size} bytes`)
  console.log(`  sha256  ${artifact.sha256}`)
}
console.log('')
console.log('Compare the sha256 above with the file you downloaded:')
console.log('  sha256sum <file>            (Linux/macOS)')
console.log('  Get-FileHash <file> -Algorithm SHA256   (Windows PowerShell)')
