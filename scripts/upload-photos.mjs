/**
 * Загрузка фото туров в Supabase Storage (bucket "media")
 * и обновление записей tours (cover_url + gallery).
 *
 * Запуск:  node scripts/upload-photos.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, readdirSync, existsSync } from 'fs'
import { resolve } from 'path'

// Load .env.local
const envPath = resolve(import.meta.dirname, '..', '.env.local')
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) process.env[m[1].trim()] = m[2].trim()
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_KEY. Set them in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const PHOTOS_DIR = 'D:\\Downloads\\Telegram Desktop\\ChatExport_2026-06-22 (1)\\photos'

const TOUR_PHOTOS = {
  'istoricheskiy-tokio': {
    photos: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
  },
  'tokio-posle-zakata': {
    photos: [20, 21, 22, 23, 24, 25],
  },
  'odavara': {
    photos: [26, 27, 28, 29, 30, 31, 32, 33, 34],
  },
  'idzu': {
    photos: [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54],
  },
  'fudzi': {
    photos: [55, 56, 57, 58, 59, 60, 61, 62, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85],
  },
  'kamakura': {
    photos: [],
  },
  'hakone': {
    photos: [63, 64, 65, 66, 67, 68, 69, 70, 81, 86, 87, 88, 89, 90, 91],
  },
  'nikko': {
    photos: [],
  },
}

const allFiles = readdirSync(PHOTOS_DIR).filter(
  (f) => f.endsWith('.jpg') && !f.includes('_thumb')
)

function findFile(num) {
  const prefix = `photo_${num}@`
  return allFiles.find((f) => f.startsWith(prefix))
}

async function uploadPhoto(slug, filename, index) {
  const localPath = `${PHOTOS_DIR}\\${filename}`
  if (!existsSync(localPath)) {
    console.warn(`  SKIP: ${filename} not found`)
    return null
  }

  const fileBuffer = readFileSync(localPath)
  const ext = filename.split('.').pop()
  const storagePath = `tours/${slug}/${String(index).padStart(2, '0')}.${ext}`

  const { error } = await supabase.storage
    .from('media')
    .upload(storagePath, fileBuffer, {
      contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
      upsert: true,
    })

  if (error) {
    console.warn(`  ERROR uploading ${storagePath}: ${error.message}`)
    return null
  }

  const { data } = supabase.storage.from('media').getPublicUrl(storagePath)
  console.log(`  ✓ ${storagePath}`)
  return data.publicUrl
}

async function main() {
  console.log('Uploading tour photos to Supabase Storage...\n')

  for (const [slug, config] of Object.entries(TOUR_PHOTOS)) {
    const { photos } = config
    if (photos.length === 0) {
      console.log(`${slug}: no photos, skipping`)
      continue
    }

    console.log(`${slug}: ${photos.length} photos`)

    const urls = []
    for (let i = 0; i < photos.length; i++) {
      const filename = findFile(photos[i])
      if (!filename) {
        console.warn(`  SKIP: photo_${photos[i]} not found in directory`)
        continue
      }
      const url = await uploadPhoto(slug, filename, i + 1)
      if (url) urls.push(url)
    }

    if (urls.length === 0) {
      console.log(`  No photos uploaded for ${slug}`)
      continue
    }

    // First photo = cover, all = gallery
    const cover_url = urls[0]
    const gallery = urls

    const { error } = await supabase
      .from('tours')
      .update({ cover_url, gallery })
      .eq('slug', slug)

    if (error) {
      console.error(`  DB update error for ${slug}: ${error.message}`)
    } else {
      console.log(`  DB updated: cover + ${gallery.length} gallery photos\n`)
    }
  }

  console.log('\nDone!')
}

main().catch(console.error)
