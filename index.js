const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const fs = require('fs');
const path = require('path');

// Configure le chemin de FFmpeg automatiquement
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const app = express();
const port = process.env.PORT || 3000;

// Création du dossier qui va stocker les fichiers .m3u8 et .ts
const streamDir = path.join(__dirname, 'public');
if (!fs.existsSync(streamDir)) {
    fs.mkdirSync(streamDir);
}

// Autoriser l'accès public à ce dossier
app.use(express.static(streamDir));

// Ton lien source
const sourceUrl = 'http://31.59.212.107/WFJobG5hOCtUSHh5VVpDQWJmL2tsemtuQ0VtMEFLbjh1aUZXUzNaUWRsT2UyaE5RQis5eFhYLzMzeUN3eWE0RVlaVHl6bVF3bVNTSXQzVE53V1FRaitJVWM3Z2xSRjVXMXBmTlpZMXFJdzVGQ0MzcGRTbWRqTTgwOU1NOU1VLzhnWWxySzJRa202b0xPQ0ZwbFZyQVg2UTQ3K0ZlelFCTC9xSS9GcjAyeHQ2dWorQ05BSDF5WXhUZ2tqYm9JTkpCMmJlUHJLSEpnRURJaTdLOXgvekRqeE8ycUVnZjE4QjRxcGZsRWZUbEkwSGFUdmxhcHRkWVVYOXljVGRGL0ZoMmRIQmNrMXN6cHFacFdWUUJHc01mdVVUUGx3REtOblIxU1poT0MxaEFtTUFOYXY2YmQ4cEJqVm1ORXpGc28rNThVekszUmdsL2VwRk1PbTluSk9SUjZjc2p4Rktqb053eTJFaVpaeHBhL2dVPQ';

console.log('Démarrage du découpage HLS...');

// Commande FFmpeg pour générer le m3u8
ffmpeg(sourceUrl)
  .outputOptions([
    '-c copy',                     // Copie le flux vidéo/audio sans ré-encoder (Sauve le CPU)
    '-hls_time 10',                // Durée de chaque segment .ts en secondes
    '-hls_list_size 5',            // Garde uniquement les 5 derniers segments dans le m3u8
    '-hls_flags delete_segments'   // Supprime physiquement les vieux segments du disque
  ])
  .output(path.join(streamDir, 'index.m3u8'))
  .on('end', () => console.log('Flux terminé.'))
  .on('error', (err) => console.error('Erreur FFmpeg :', err.message))
  .run();

// Lancement du serveur Web
app.listen(port, () => {
    console.log(`Serveur actif sur le port ${port}`);
    console.log(`Ton lien M3U8 sera : /index.m3u8`);
});