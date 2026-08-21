# Fractal Servers Manager — releases

Downloads for **Fractal Servers Manager**. This repository holds no source code: only tags and
the files attached to each release.

👉 **[Download the latest release](https://github.com/FRACTAL-GAME-STUDIOS/fsm-releases/releases/latest)**

## What to download

FSM is two programs, and you probably do not need both on the same machine.

| File | Install it on | What it is |
| --- | --- | --- |
| `Fractal Servers Manager Setup <version>.exe` | Every machine that administers servers | The panel. A normal Windows app, installed per user — no administrator rights needed. |
| `fsm-agent-win-x64.zip` | The Windows machine that hosts the game servers | The agent. Runs as a Windows service and supervises the servers. |
| `fsm-agent-linux-x64.tar.gz` | The Linux machine that hosts the game servers | The agent, for x86-64 Linux. Runs under systemd. |
| `fsm-agent-linux-arm64.tar.gz` | An ARM Linux machine (Raspberry Pi, Ampere VPS) | The agent, for arm64 Linux. |

Admins and subadmins install only the panel. The agent goes on the one machine holding the
servers, and everybody's panel connects to it.

## Updating

You do not normally download anything from here twice. Both halves check this page on their own
and offer the update: the panel updates itself, and the agent can be updated from the panel with
one click. Game servers keep running while the agent updates.

## Verifying a release yourself

Every release includes `fsm-release.json` — a description of every file with its SHA-256 — and
`fsm-release.json.sig`, an Ed25519 signature over that description. The panel and the agent
refuse to install anything whose signature does not verify against the key in
[`PUBLIC_KEY.txt`](PUBLIC_KEY.txt), which is also compiled into both programs.

To check by hand, with Node.js installed:

```bash
node verify-release.mjs fsm-release.json fsm-release.json.sig
```

The script is [`verify-release.mjs`](verify-release.mjs) in this repository. It prints the
release version and every artifact's hash, and exits non-zero if the signature is wrong.

To confirm a file you already downloaded matches the manifest:

```bash
sha256sum fsm-agent-linux-x64.tar.gz
```

On Windows PowerShell:

```powershell
Get-FileHash .\fsm-agent-win-x64.zip -Algorithm SHA256
```

## A note on Windows warnings

The installer and the agent are not code-signed yet, so Windows SmartScreen shows a warning the
first time you run them ("Windows protected your PC" → *More info* → *Run anyway*). Some
antivirus products flag unsigned installers for the same reason. Code signing is planned; until
then, the signature described above is how you confirm a download is genuine.

## Issues

Bug reports and questions go to the main repository's issue tracker, not here.

---

## En español

Descargas de **Fractal Servers Manager**. Aquí no hay código fuente: solo las versiones
publicadas y sus archivos.

- **El panel** (`Fractal Servers Manager Setup <versión>.exe`) va en el ordenador de cada
  administrador. Se instala por usuario, sin permisos de administrador.
- **El agente** (`fsm-agent-*`) va únicamente en la máquina donde corren los servidores de juego.

No hace falta volver a descargar nada para actualizar: el panel se actualiza solo y el agente se
actualiza desde el panel con un clic, sin tirar los servidores que estén corriendo.

Windows avisará de que el programa no está firmado; todavía no lo está. La forma de comprobar
que una descarga es auténtica es la firma Ed25519 descrita arriba.
