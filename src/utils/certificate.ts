/** Draws a light, gold-trimmed certificate onto a canvas and returns it as a PNG data URL. */
export function renderCertificate(opts: { student: string; course: string; instructor: string; date: string; id: string }): string {
  const W = 1600
  const H = 1130
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')!
  const serif = 'Georgia, "Times New Roman", serif'
  const sans = 'Inter, system-ui, sans-serif'

  g.fillStyle = '#fbf8ef'
  g.fillRect(0, 0, W, H)

  // blue corner ribbons
  g.fillStyle = '#0b2a6b'
  for (const [x, y, sx, sy] of [[0, 0, 1, 1], [W, 0, -1, 1], [0, H, 1, -1], [W, H, -1, -1]] as const) {
    g.beginPath()
    g.moveTo(x, y)
    g.lineTo(x + sx * 330, y)
    g.lineTo(x, y + sy * 330)
    g.closePath()
    g.fill()
    g.fillStyle = '#c9a24b'
    g.beginPath()
    g.moveTo(x + sx * 330, y)
    g.lineTo(x + sx * 360, y)
    g.lineTo(x, y + sy * 360)
    g.lineTo(x, y + sy * 330)
    g.closePath()
    g.fill()
    g.fillStyle = '#0b2a6b'
  }

  g.strokeStyle = '#c9a24b'
  g.lineWidth = 4
  g.strokeRect(80, 80, W - 160, H - 160)
  g.lineWidth = 1.5
  g.strokeRect(96, 96, W - 192, H - 192)

  g.textAlign = 'center'
  g.fillStyle = '#c9a24b'
  g.font = `600 28px ${sans}`
  g.fillText('★   ★   ★', W / 2, 190)

  g.fillStyle = '#0b1b43'
  g.font = `700 88px ${serif}`
  g.fillText('Certificate of Completion', W / 2, 310)

  g.fillStyle = '#64748b'
  g.font = `400 32px ${serif}`
  g.fillText('This is to certify that', W / 2, 400)

  g.fillStyle = '#1d4ed8'
  g.font = `italic 700 104px ${serif}`
  g.fillText(opts.student, W / 2, 530)
  g.strokeStyle = '#c9a24b'
  g.lineWidth = 2
  g.beginPath()
  g.moveTo(W / 2 - 400, 565)
  g.lineTo(W / 2 + 400, 565)
  g.stroke()

  g.fillStyle = '#64748b'
  g.font = `400 32px ${serif}`
  g.fillText('has successfully completed the course', W / 2, 640)

  g.fillStyle = '#0b1b43'
  g.font = `700 54px ${serif}`
  const words = opts.course.split(' ')
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    const t = line ? `${line} ${w}` : w
    if (g.measureText(t).width > 1000 && line) {
      lines.push(line)
      line = w
    } else line = t
  }
  lines.push(line)
  lines.forEach((l, i) => g.fillText(l, W / 2, 720 + i * 64))

  g.fillStyle = '#64748b'
  g.font = `400 26px ${sans}`
  g.fillText(`Issued ${opts.date}  ·  Instructor: ${opts.instructor}`, W / 2, 720 + lines.length * 64 + 30)

  // gold seal
  const sx = W / 2
  const sy = 905
  const seal = g.createRadialGradient(sx - 15, sy - 15, 5, sx, sy, 70)
  seal.addColorStop(0, '#f6dc8b')
  seal.addColorStop(1, '#b8892b')
  g.fillStyle = seal
  g.beginPath()
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2
    const r = i % 2 ? 62 : 74
    g.lineTo(sx + Math.cos(a) * r, sy + Math.sin(a) * r)
  }
  g.closePath()
  g.fill()
  g.fillStyle = '#fff8dc'
  g.font = `700 54px ${sans}`
  g.fillText('★', sx, sy + 19)

  // brand bottom-left
  g.textAlign = 'left'
  g.fillStyle = '#2563eb'
  g.beginPath()
  g.roundRect(170, 905, 56, 56, 14)
  g.fill()
  g.fillStyle = '#fff'
  g.font = `700 30px ${sans}`
  g.fillText('E', 187, 945)
  g.fillStyle = '#0b1b43'
  g.font = `700 40px ${sans}`
  g.fillText('Edu', 242, 946)
  g.fillStyle = '#2563eb'
  g.fillText('Next', 242 + g.measureText('Edu').width, 946)

  // signature bottom-right
  g.textAlign = 'center'
  g.fillStyle = '#0b1b43'
  g.font = `italic 44px ${serif}`
  g.fillText(opts.instructor, W - 380, 935)
  g.strokeStyle = '#94a3b8'
  g.lineWidth = 1.5
  g.beginPath()
  g.moveTo(W - 540, 955)
  g.lineTo(W - 220, 955)
  g.stroke()
  g.fillStyle = '#64748b'
  g.font = `400 22px ${sans}`
  g.fillText('Authorized Signature', W - 380, 988)

  g.textAlign = 'center'
  g.fillStyle = '#94a3b8'
  g.font = `400 20px ${sans}`
  g.fillText(`Certificate ID: ${opts.id}`, W / 2, H - 112)

  return c.toDataURL('image/png')
}
