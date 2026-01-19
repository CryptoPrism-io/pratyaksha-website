/**
 * Extract high-quality frames from Veo videos
 * Uses FFmpeg to extract frames at maximum quality
 */

import ffmpeg from 'fluent-ffmpeg'
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
import { mkdir, rm } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegInstaller.path)

const CONFIG = {
  videos: [
    { name: '1-logo', source: 'video/logo.mp4' },
    { name: '2-logo-brain', source: 'video/logo to brain.mp4' },
    { name: '3-brain-agent', source: 'video/brain to agent.mp4' },
    { name: '4-agent-viz', source: 'video/agent to viz.mp4' },
  ],
  outputBase: 'public/animations/scroll',
  // Extract every Nth frame (2 = every other frame for 96 frames from ~8 sec video)
  frameRate: 12, // 12 fps extraction = 96 frames from 8 sec video
  // Output quality (2 = best, 31 = worst for JPEG)
  quality: 2,
  // Output format
  format: 'jpg',
  // For mobile: smaller resolution
  mobile: {
    enabled: true,
    scale: '640:-1', // 640px wide, maintain aspect ratio
    frameRate: 6, // 6 fps = 48 frames from 8 sec video
    quality: 4,
  }
}

async function getVideoInfo(videoPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) reject(err)
      else resolve(metadata)
    })
  })
}

async function extractFrames(video, isMobile = false) {
  const outputDir = path.join(
    CONFIG.outputBase,
    video.name,
    isMobile ? 'mobile' : ''
  )

  // Clean and create output directory
  if (existsSync(outputDir)) {
    await rm(outputDir, { recursive: true })
  }
  await mkdir(outputDir, { recursive: true })

  const outputPattern = path.join(outputDir, `frame-%03d.${CONFIG.format}`)
  const frameRate = isMobile ? CONFIG.mobile.frameRate : CONFIG.frameRate
  const quality = isMobile ? CONFIG.mobile.quality : CONFIG.quality

  console.log(`\nExtracting ${isMobile ? 'mobile' : 'desktop'} frames from ${video.source}...`)
  console.log(`  Output: ${outputDir}`)
  console.log(`  Frame rate: ${frameRate} fps`)
  console.log(`  Quality: ${quality} (lower = better)`)

  return new Promise((resolve, reject) => {
    let command = ffmpeg(video.source)
      .outputOptions([
        `-vf fps=${frameRate}${isMobile ? `,scale=${CONFIG.mobile.scale}` : ''}`,
        `-q:v ${quality}`,
      ])
      .output(outputPattern)

    command
      .on('start', (cmd) => {
        console.log(`  Command: ${cmd}`)
      })
      .on('progress', (progress) => {
        if (progress.frames) {
          process.stdout.write(`\r  Extracted ${progress.frames} frames...`)
        }
      })
      .on('end', () => {
        console.log('\n  Done!')
        resolve()
      })
      .on('error', (err) => {
        console.error(`\n  Error: ${err.message}`)
        reject(err)
      })
      .run()
  })
}

async function main() {
  console.log('='.repeat(60))
  console.log('High-Quality Frame Extraction')
  console.log('='.repeat(60))

  // Get video info for the first video
  try {
    const info = await getVideoInfo(CONFIG.videos[0].source)
    const videoStream = info.streams.find(s => s.codec_type === 'video')
    console.log(`\nVideo info:`)
    console.log(`  Resolution: ${videoStream.width}x${videoStream.height}`)
    console.log(`  Duration: ${info.format.duration}s`)
    console.log(`  Frame rate: ${videoStream.r_frame_rate}`)
  } catch (err) {
    console.log('Could not get video info:', err.message)
  }

  // Process each video
  for (const video of CONFIG.videos) {
    // Desktop frames
    await extractFrames(video, false)

    // Mobile frames
    if (CONFIG.mobile.enabled) {
      await extractFrames(video, true)
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('Extraction complete!')
  console.log('='.repeat(60))

  // Generate manifest
  const manifest = {
    sections: CONFIG.videos.map(v => v.name),
    desktop: {
      framesPerSection: Math.round(8 * CONFIG.frameRate), // ~8 sec videos
      format: CONFIG.format,
    },
    mobile: {
      framesPerSection: Math.round(8 * CONFIG.mobile.frameRate),
      format: CONFIG.format,
    },
    generated: new Date().toISOString(),
  }

  const manifestPath = path.join(CONFIG.outputBase, 'manifest.json')
  const { writeFile } = await import('fs/promises')
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2))
  console.log(`\nManifest written to ${manifestPath}`)
}

main().catch(console.error)
