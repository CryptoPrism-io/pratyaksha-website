import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegStatic);

const VIDEOS = [
  { input: 'public/videos/transition-1.mp4', output: 'public/frames/t1', fps: 15 },
  { input: 'public/videos/transition-2.mp4', output: 'public/frames/t2', fps: 15 },
  { input: 'public/videos/transition-3.mp4', output: 'public/frames/t3', fps: 15 },
  { input: 'public/videos/transition-4.mp4', output: 'public/frames/t4', fps: 15 },
];

async function extractFrames(video) {
  const inputPath = path.join(ROOT, video.input);
  const outputDir = path.join(ROOT, video.output);

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  const outputPattern = path.join(outputDir, 'frame-%04d.jpg');

  console.log(`\nExtracting frames from ${video.input}...`);
  console.log(`Output: ${outputDir}`);
  console.log(`FPS: ${video.fps}`);

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        `-vf fps=${video.fps},scale=1920:-1`,  // 15 fps, 1920px width
        '-q:v 2',  // High quality JPEG
      ])
      .output(outputPattern)
      .on('start', (cmd) => {
        console.log('FFmpeg command:', cmd);
      })
      .on('progress', (progress) => {
        if (progress.percent) {
          process.stdout.write(`\rProgress: ${progress.percent.toFixed(1)}%`);
        }
      })
      .on('end', () => {
        console.log('\n✓ Done');
        resolve();
      })
      .on('error', (err) => {
        console.error('\n✗ Error:', err.message);
        reject(err);
      })
      .run();
  });
}

async function countFrames(dir) {
  const outputDir = path.join(ROOT, dir);
  try {
    const files = await fs.readdir(outputDir);
    return files.filter(f => f.endsWith('.jpg')).length;
  } catch {
    return 0;
  }
}

async function generateManifest() {
  const manifest = {};

  for (let i = 1; i <= 4; i++) {
    const dir = `public/frames/t${i}`;
    const count = await countFrames(dir);
    manifest[`t${i}`] = {
      path: `/frames/t${i}`,
      count,
      pattern: 'frame-%04d.jpg',
    };
    console.log(`t${i}: ${count} frames`);
  }

  const manifestPath = path.join(ROOT, 'src/lib/frame-manifest.json');
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\nManifest written to ${manifestPath}`);

  return manifest;
}

async function main() {
  console.log('=== Frame Extraction ===\n');

  for (const video of VIDEOS) {
    await extractFrames(video);
  }

  console.log('\n=== Generating Manifest ===\n');
  await generateManifest();

  console.log('\n=== Complete ===');
}

main().catch(console.error);
