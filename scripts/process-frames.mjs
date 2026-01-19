#!/usr/bin/env node
/**
 * Frame Processing Script for Pratyaksha Scroll Animation
 *
 * Processes the raw frames from scroll/ folder:
 * - Samples every Nth frame (configurable)
 * - Converts to WebP format
 * - Compresses for web delivery
 * - Generates manifest.json for preloader
 */

import sharp from 'sharp'
import { readdir, mkdir, writeFile, copyFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const CONFIG = {
  // Source directories (raw frames)
  sourceDirs: [
    { name: '1-logo', source: 'scroll/1.logo' },
    { name: '2-logo-brain', source: 'scroll/2.logo to brain' },
    { name: '3-brain-agent', source: 'scroll/3.brain to agent' },
    { name: '4-agent-viz', source: 'scroll/4.agent to viz' },
  ],

  // Output directory
  outputBase: 'public/animations/scroll',

  // Sampling: take every Nth frame
  sampleRate: 2, // 192/2 = 96 frames per section

  // Image settings - USE ORIGINAL QUALITY
  useOriginal: true,   // Copy original JPGs without re-encoding
  width: null,         // null = keep original size
  quality: 95,         // Only used if useOriginal is false

  // Also generate mobile-optimized versions
  mobile: {
    enabled: true,
    width: 640,
    quality: 85,
    sampleRate: 4,  // 192/4 = 48 frames per section on mobile
  }
}

async function processFrames() {
  const manifest = {
    generated: new Date().toISOString(),
    sections: [],
    totalFrames: { desktop: 0, mobile: 0 }
  }

  console.log('🎬 Starting frame processing...\n')

  for (const section of CONFIG.sourceDirs) {
    console.log(`📁 Processing section: ${section.name}`)

    const sourcePath = path.join(process.cwd(), section.source)
    const destPath = path.join(process.cwd(), CONFIG.outputBase, section.name)
    const mobileDestPath = path.join(destPath, 'mobile')

    // Create output directories
    if (!existsSync(destPath)) {
      await mkdir(destPath, { recursive: true })
    }
    if (CONFIG.mobile.enabled && !existsSync(mobileDestPath)) {
      await mkdir(mobileDestPath, { recursive: true })
    }

    // Get all frames
    const files = await readdir(sourcePath)
    const frames = files
      .filter(f => f.endsWith('.jpg') || f.endsWith('.png'))
      .sort()

    console.log(`   Found ${frames.length} frames`)

    const sectionManifest = {
      name: section.name,
      desktop: { frames: [], count: 0 },
      mobile: { frames: [], count: 0 }
    }

    // Process desktop frames (every Nth frame)
    let desktopCount = 0
    for (let i = 0; i < frames.length; i += CONFIG.sampleRate) {
      const sourceFile = path.join(sourcePath, frames[i])
      const ext = CONFIG.useOriginal ? '.jpg' : '.webp'
      const outputName = `frame-${String(desktopCount + 1).padStart(3, '0')}${ext}`
      const outputFile = path.join(destPath, outputName)

      try {
        if (CONFIG.useOriginal) {
          // Copy original file without re-encoding
          await copyFile(sourceFile, outputFile)
        } else {
          // Convert and compress
          let pipeline = sharp(sourceFile)
          if (CONFIG.width) {
            pipeline = pipeline.resize(CONFIG.width, null, { fit: 'inside' })
          }
          await pipeline.webp({ quality: CONFIG.quality }).toFile(outputFile)
        }

        sectionManifest.desktop.frames.push(outputName)
        desktopCount++

        // Progress indicator
        if (desktopCount % 20 === 0) {
          process.stdout.write(`   Desktop: ${desktopCount} frames processed\r`)
        }
      } catch (err) {
        console.error(`   Error processing ${frames[i]}: ${err.message}`)
      }
    }
    console.log(`   Desktop: ${desktopCount} frames processed ✓`)
    sectionManifest.desktop.count = desktopCount

    // Process mobile frames (every Mth frame)
    if (CONFIG.mobile.enabled) {
      let mobileCount = 0
      for (let i = 0; i < frames.length; i += CONFIG.mobile.sampleRate) {
        const sourceFile = path.join(sourcePath, frames[i])
        const outputName = `frame-${String(mobileCount + 1).padStart(3, '0')}.webp`
        const outputFile = path.join(mobileDestPath, outputName)

        try {
          await sharp(sourceFile)
            .resize(CONFIG.mobile.width, null, { fit: 'inside' })
            .webp({ quality: CONFIG.mobile.quality })
            .toFile(outputFile)

          sectionManifest.mobile.frames.push(`mobile/${outputName}`)
          mobileCount++
        } catch (err) {
          console.error(`   Error processing mobile ${frames[i]}: ${err.message}`)
        }
      }
      console.log(`   Mobile: ${mobileCount} frames processed ✓`)
      sectionManifest.mobile.count = mobileCount
    }

    manifest.sections.push(sectionManifest)
    manifest.totalFrames.desktop += sectionManifest.desktop.count
    manifest.totalFrames.mobile += sectionManifest.mobile.count

    console.log('')
  }

  // Write manifest
  const manifestPath = path.join(process.cwd(), CONFIG.outputBase, 'manifest.json')
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2))
  console.log(`📋 Manifest written to ${manifestPath}`)

  // Summary
  console.log('\n✅ Processing complete!')
  console.log(`   Desktop frames: ${manifest.totalFrames.desktop}`)
  console.log(`   Mobile frames: ${manifest.totalFrames.mobile}`)

  // Estimate file sizes
  const avgSize = 50 // KB estimate per frame
  console.log(`   Estimated size: ~${Math.round(manifest.totalFrames.desktop * avgSize / 1024)}MB (desktop)`)
}

processFrames().catch(console.error)
