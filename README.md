# Notarium — Dein digitales Notizbuch

Notarium ist eine eigenständige, browserbasierte Notizbuch-App: Ordner & Notizbücher,
Freihandzeichnen mit mehreren Stiftarten, Text, Bilder, Geometrie-Werkzeuge (Lineal,
Geodreieck, Winkelmesser, Zirkel), PDF-Import/-Export und volle DIN-Formatunterstützung
(A4/A5/A3, mehrere Papierarten). Alle Daten bleiben **lokal auf dem jeweiligen Gerät**
(IndexedDB) — es gibt keinen Server, keine Anmeldung, kein Tracking.

Die komplette App steckt in **einer einzigen Datei**: `index.html`. `manifest.json`,
`sw.js` und die Icons machen sie zusätzlich als installierbare Progressive Web App (PWA)
nutzbar.

---

## 1. Schnellstart ohne GitHub

Einfach `index.html` doppelklicken und im Browser öffnen. Alles funktioniert sofort,
auch offline. Für die "App installieren"-Funktion (Symbol auf Homescreen/Desktop)
müssen die Dateien allerdings über `http(s)://` statt `file://` ausgeliefert werden —
dafür ist GitHub Pages (siehe unten) der einfachste Weg.

---

## 2. Projekt auf GitHub bringen

Vorausgesetzt: [Git](https://git-scm.com/downloads) ist installiert und du hast ein
GitHub-Konto.

### Repository lokal vorbereiten

Dieses Projekt ist bereits ein lokales Git-Repository mit einem ersten Commit
(`git log` zeigt ihn dir). Du musst es nur noch mit einem Repository auf GitHub
verbinden.

**Option A — mit der GitHub-Website (kein zusätzliches Tool nötig):**

1. Auf [github.com/new](https://github.com/new) ein neues Repository anlegen, z. B.
   Name `notarium`. **Kein** README/`.gitignore`/Lizenz von GitHub erzeugen lassen
   (sonst gibt es beim ersten Push einen Konflikt) — dieses Projekt bringt das schon mit.
2. Im Terminal, im Projektordner:

   ```bash
   git remote add origin https://github.com/DEIN-BENUTZERNAME/notarium.git
   git branch -M main
   git push -u origin main
   ```

**Option B — mit der GitHub CLI (`gh`):**

```bash
gh repo create notarium --public --source=. --remote=origin --push
```

Das legt das Repository direkt an und pusht in einem Schritt.

### GitHub Pages aktivieren (Hosting + installierbare App)

1. Im Repository auf GitHub: **Settings → Pages**.
2. Unter „Build and deployment" → „Source": **Deploy from a branch** auswählen.
3. Branch: `main`, Ordner: `/ (root)` → **Save**.
4. Nach ein bis zwei Minuten ist die App erreichbar unter:
   `https://DEIN-BENUTZERNAME.github.io/notarium/`

Über diese `https://`-Adresse zeigt der Browser jetzt auch "App installieren" an
(Chrome/Edge: Symbol in der Adressleiste; iOS Safari: Teilen → „Zum Home-Bildschirm";
Android Chrome: Menü → „App installieren").

---

## 3. Das Projekt künftig über das Terminal aktualisieren

Ganz normaler Git-Workflow — nachdem du Änderungen an `index.html` (oder anderen
Dateien) gemacht hast:

```bash
git add .
git commit -m "Kurze Beschreibung der Änderung"
git push
```

Falls GitHub Pages aktiviert ist, wird die veröffentlichte Version automatisch
innerhalb von ein bis zwei Minuten aktualisiert — kein weiterer Schritt nötig.

Nützliche weitere Befehle:

```bash
git status              # Was hat sich geändert?
git diff                # Änderungen im Detail ansehen
git log --oneline        # Verlauf aller Commits
git checkout -- DATEI    # Änderungen an einer Datei verwerfen
```

### Auf einem anderen Rechner weiterarbeiten

```bash
git clone https://github.com/DEIN-BENUTZERNAME/notarium.git
cd notarium
# Datei(en) bearbeiten, dann wie gewohnt:
git add .
git commit -m "..."
git push
```

---

## 4. Projektstruktur

```
notarium/
├── index.html          # Die komplette App (HTML + CSS + JavaScript)
├── manifest.json        # Web-App-Manifest (Name, Icons, Farben) für die PWA-Installation
├── sw.js                 # Service Worker für Offline-Nutzung
├── icon-192.png          # App-Icon (klein)
├── icon-512.png          # App-Icon (groß)
├── icon-512-maskable.png # App-Icon, randlos zuschneidbar (Android)
├── .gitignore
└── README.md
```

Alle Notizen/Notizbücher liegen **nicht** in diesem Repository — sie werden im Browser
jedes Nutzers lokal gespeichert (IndexedDB). Über das „•••"-Menü in der App kannst du
jederzeit ein Backup als `.json`-Datei exportieren bzw. wiederherstellen.

---

## 5. Eigene Änderungen vornehmen

Die gesamte Anwendungslogik befindet sich in `index.html` in einem einzigen
`<script>`-Block, grob unterteilt in: Utils, IndexedDB-Speicherschicht, Datenmodell
(Ordner/Notizbücher/Seiten), Bibliotheks-/Notizbuch-Ansichten, Zeichen-Engine,
Werkzeugleiste, Geometrie-Werkzeuge, PDF-Import/-Export und Bootstrap. Style-Regeln
stehen im `<style>`-Block direkt darüber. Nach jeder Änderung reicht `index.html`
im Browser neu laden (Strg+Shift+R / Cmd+Shift+R für ein hartes Neuladen ohne Cache).
