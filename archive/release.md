# CreativeHack 2022 archive release — 17 October 2026

Public URL: https://creativehack.ilyamedve.dev/.
Original source: `252bb49cecc2fd53281612da33594e3b62f99f92` (30 October 2022).
Original tag: `creativehack-2022-original`.
Archive branch: `archive/creativehack-2022`.
Release tag: `creativehack-2022-archive-20261017`.

Deployed image: `creativehack:archive-20261017-252bb49`.
Docker image ID:
`sha256:7d08fcbdeab95a9b4d2052ec37f2633ad2c329e84f241817153ec283a82508ed`.
The image is built and retained on big-one; it is not uploaded to a public
container registry. A Docker-save copy is retained at
`/home/me/.local/state/creativehack-releases/20261017/creativehack-image.tar`.
Git plus pinned base digests and npm lockfile provide the independent rebuild path.

## Preservation

All 47 source files in the original fork were compared to upstream
`a74b90891f71e436263c7e04a1f5ab713c950c1b`: 47/47 identical. No upstream
changes were merged. The comparison hashes and exact source revision are
in [origin.json](origin.json). Author metadata and historical Git history remain.

The 37 original artwork/font/block-style files are unchanged. Original
colors, typefaces, outlined headings, blur, cards, prizes, event dates and
winners remain. Twenty orbs move with the original desktop/mobile speeds,
blur/grayscale filters and delays. Logo hover, smooth anchors, case selection,
FAQ arrow transitions, mobile overlay and header scroll behavior are retained.

The archive annotation, closed form, disabled submission and updated technical
URLs are deliberate differences. reCAPTCHA, POST /team and the old success
notification were removed. Historical email is text, and the registration FAQ
is marked as a 2022 answer. The original public PDFs are stored locally.
Menu/FAQ keyboard support, background-height recalculation and the narrow-screen
archive-button fit are small repairs; the original block style files remain intact.

## Evidence

- [Preview browser result](browser-preview.json): **170 passed** on
  1440, 768, 390 and 320 px, real Chromium on big-one.
- [Public HTTPS browser result](browser-public.json): **170 passed**, the
  same widths and interactions after publication.
- Both runs: **0 page/console errors, 0 failed requests, 0 third-party automatic
  requests**. Every request was same-origin GET/HEAD. Real CSS animation advances;
  each FAQ opens/closes; all navigation anchors/menu controls and both cases work.
- All registration fields and the button are disabled. requestSubmit, a submit
  event and Enter create **no network request**; no reCAPTCHA/mail handlers exist.
- **45 HTTP checks** before and after release: all 29 static files match SHA-256,
  PDFs have valid PDF signatures/MIME, og image/robots/sitemap resolve, unknown and
  source paths are 404, empty synthetic POST probes are 405. CSP blocks connect,
  forms, third-party scripts and frames. No personal data was submitted.
- [Independent clean rebuild](reproducibility.json): **29/29 files byte-identical**;
  [SHA-256 manifest](static-sha256.txt), aggregate
  `7113fb1eab42cfc2fe91c1e57342581100532363dd966b01887dbe90bc613686`.
- Production `creativehack` is healthy, zero restarts, UID 101, read-only rootfs,
  32 MiB memory, 0.25 CPU, 32 PID, 8 MiB tmpfs, caddy_net only, no host port.
- DNS A resolves to `94.126.204.131`, no AAAA was returned. HTTP redirects with
  308 to HTTPS; TLS is trusted by curl/Chromium and the certificate is monitored.
- Gatus `apps / CreativeHack 2022` and `containers / creativehack` returned
  real successful results. Gatus/Caddy were not restarted for this release.
- The source portal catalog includes CreativeHack in Russian and English.
  The running portal was verified to contain it with matching catalog revision,
  healthy status and unchanged auth fingerprint; anonymous auth status stays 401.
  Concurrent portal releases were detected before changes and preserved.
- Bootstrap registry/recovery and all 37 Compose configurations validated.
  An earlier drift check found two unrelated pending neighbor manifests. After
  their parallel launches, the final full check passed (all 37 stacks, exit 0);
  only historical Compose config-hash warnings remained.
- 72 containers retained their IDs, StartedAt and restart counts. Other changes
  were the authorized portal catalog update and concurrent QA/neighbor releases;
  Caddy and Gatus container identities were unchanged.

Screenshots: [desktop](screenshots/desktop.png), [mobile](screenshots/mobile.png),
[closed form](screenshots/registration-mobile.png). Original and preview full-page
screenshots remain on big-one under `/tmp/creativehack-qa-original` and
`/tmp/creativehack-qa-preview`; public screenshots are in `/tmp/creativehack-qa-public`.
The disposable original/preview web containers were removed after verification.

## Recovery

The site has no application data, secrets, volumes or scheduled jobs. All source,
artwork, fonts, original PDFs, the npm lockfile and Compose configuration are in
Git. Restore from the recorded archive branch/tag and rebuild the pinned image,
or load the retained Docker image. DE application backup exclusion is explicit
in server BACKUPS.md and recovery.yml.

No site-specific data backup, new encrypted secrets export or manual Bitwarden
update is required for CreativeHack. The server-wide recovery export covers
other services and credentials; no new credentials were introduced here.
The saved Git bundle and Docker archive are optional additional recovery copies.
See the [recovery instructions](../README.md).

First-release rollback removes only creativehack/web and its Caddy route.
Subsequent releases should keep the old immutable image tag and switch only
this service. Portal rollback uses the exact image recorded immediately before
its update, preserving concurrent catalog work. No database migration exists.
