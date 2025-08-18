import fs from 'fs/promises'
import path from 'path'

export async function findShots(pubDir = 'public') {
  const list = await fs.readdir(pubDir)
  const shots = list
    .filter(f => /^shot\d+\.(jpe?g|png|webp)$/i.test(f))
    .sort((a, b) => {
      const ai = parseInt(a.match(/\d+/)[0], 10)
      const bi = parseInt(b.match(/\d+/)[0], 10)
      return ai - bi
    })
    .map(f => '/' + f)

  if (shots.length) {
    shots.forEach(s => console.log(`🖼️  Found gallery image: ${s}`))
  } else {
    console.log('⚠️  No gallery images found; using placeholders.')
  }
  return shots
}

export function placeholders(n = 3) {
  return Array.from({ length: n }, (_, i) =>
    `Drop <code>/shot${i + 1}.jpg</code> (or .png/.webp) into <code>public/</code> and replace me.`
  )
}

