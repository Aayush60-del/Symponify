const fs = require('fs')
const path = require('path')

const pagesDir = path.join(__dirname, 'client', 'src', 'pages')
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'))

for (const file of files) {
  const filePath = path.join(pagesDir, file)
  let content = fs.readFileSync(filePath, 'utf8')
  
  if (content.includes('bg-gradient-to-b from-background to-black')) {
    // Modify wrapper classes and style
    content = content.replace(
      /className="min-h-screen bg-gradient-to-b from-background to-black(.*?)"/g, 
      'className="min-h-screen$1" style={{ background: \'var(--bg)\', color: \'var(--text)\' }}'
    )
    
    // Modify card/border styles
    content = content.replace(/bg-white\/5/g, 'bg-[var(--surface-2)]')
    content = content.replace(/border-white\/10/g, 'border-[var(--line)]')
    
    // Modify text muted
    content = content.replace(/text-muted-foreground/g, 'text-[var(--text-2)]')
    
    // Modify text-white/50 and text-white/70
    content = content.replace(/text-white\/70/g, 'text-[var(--text-2)]')
    content = content.replace(/text-white\/50/g, 'text-[var(--text-3)]')

    // Optional: remove strict text-white where it clashes with light bg
    content = content.replace(/text-white/g, 'text-[var(--text)]')

    fs.writeFileSync(filePath, content)
    console.log(`Updated ${file}`)
  }
}
