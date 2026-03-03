import { salvarDado, buscarDados, limparColecao, inserirMuitos } from './db'
import { Workbook } from 'exceljs'

export async function getHealth() {
  return { status: 'healthy' }
}

export async function addResponse(payload) {
  const now = new Date().toISOString()
  const item = { ...payload, created_at: now }
  await salvarDado('responses', item)
  return { ok: true }
}

export async function getResponses() {
  const rows = await buscarDados('responses')
  return rows || []
}

export async function addMember(payload) {
  const ts = new Date().toISOString()
  const item = { nome: payload?.nome || null, whatsapp: payload?.telefone || payload?.whatsapp || null, ts }
  await salvarDado('members', item)
  return { ok: true }
}

export async function getMembers() {
  const rows = await buscarDados('members')
  return rows || []
}

export async function getSupabaseStatus() {
  return { enabled: true, ok: true }
}

export async function exportAll() {
  const members = await getMembers()
  const responses = await getResponses()
  const data = { members, responses }
  const json = JSON.stringify(data)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `backup_${new Date().toISOString()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export async function importAll(file) {
  const text = await file.text()
  const data = JSON.parse(text || '{}')
  const members = Array.isArray(data.members) ? data.members : []
  const responses = Array.isArray(data.responses) ? data.responses : []
  await limparColecao('members')
  await limparColecao('responses')
  await inserirMuitos('members', members)
  await inserirMuitos('responses', responses)
  return { ok: true }
}

export async function clearAll() {
  await limparColecao('members')
  await limparColecao('responses')
  return { ok: true }
}

export async function seedLocal() {
  const now = new Date().toISOString()
  const members = [
    { nome: 'Lilith', whatsapp: '5599999999999', ts: now },
    { nome: 'Deckard Cain', whatsapp: '5588888888888', ts: now },
    { nome: 'Arthur', whatsapp: '5585985322374', ts: now },
    { nome: 'Tyrael', whatsapp: '5577777777777', ts: now },
    { nome: 'Malthael', whatsapp: '5566666666666', ts: now }
  ]
  const responses = [
    { nome: 'Lilith', nick: 'Lili', quinta: 'a', sabado: 'b', classe: 'Mago', ressonancia: '4200', tempo: '2h', telefone: '5599999999999', created_at: now },
    { nome: 'Deckard', nick: 'Cain', quinta: 'a', sabado: 'a', classe: 'Bárbaro', ressonancia: '3800', tempo: '1h', telefone: '5588888888888', created_at: now },
    { nome: 'Arthur', nick: 'Art', quinta: 'b', sabado: 'a', classe: 'Monge', ressonancia: '2500', tempo: '3h', telefone: '5585985322374', created_at: now },
    { nome: 'Tyrael', nick: 'Ty', quinta: 'a', sabado: 'c', classe: 'Cruzado', ressonancia: '8000', tempo: '4h', telefone: '5577777777777', created_at: now },
    { nome: 'Malthael', nick: 'Mal', quinta: 'c', sabado: 'b', classe: 'Necro', ressonancia: '6000', tempo: '2h', telefone: '5566666666666', created_at: now }
  ]
  await limparColecao('members')
  await limparColecao('responses')
  await inserirMuitos('members', members)
  await inserirMuitos('responses', responses)
  return { ok: true }
}

export async function exportExcel() {
  const members = await getMembers()
  const responses = await getResponses()
  const wb = new Workbook()
  wb.creator = 'The Crows'
  wb.created = new Date()
  const resumo = wb.addWorksheet('Resumo')
  const wsM = wb.addWorksheet('Membros')
  const wsR = wb.addWorksheet('Respostas')
  resumo.columns = [
    { header: 'Métrica', key: 'k', width: 25 },
    { header: 'Valor', key: 'v', width: 20 }
  ]
  const quintaSim = responses.filter(r => r.quinta === 'a').length
  const sabadoSim = responses.filter(r => r.sabado === 'a').length
  const mediaRes = Math.round((responses.reduce((acc, r) => acc + Number(r.ressonancia || 0), 0)) / (responses.length || 1))
  resumo.addRow({ k: 'Total de Membros', v: members.length })
  resumo.addRow({ k: 'Total de Respostas', v: responses.length })
  resumo.addRow({ k: 'Quinta (Sim)', v: quintaSim })
  resumo.addRow({ k: 'Sábado (Sim)', v: sabadoSim })
  resumo.addRow({ k: 'Média Ressonância', v: mediaRes })
  resumo.getRow(1).eachCell(c => { c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEEE8F8' } }; c.font = { bold: true } })
  resumo.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: 2 } }
  resumo.views = [{ state: 'frozen', ySplit: 1 }]
  wsM.columns = [
    { header: 'ID', key: 'id', width: 8 },
    { header: 'Nome', key: 'nome', width: 24 },
    { header: 'WhatsApp', key: 'whatsapp', width: 18 },
    { header: 'Timestamp', key: 'ts', width: 24 }
  ]
  members.forEach(m => wsM.addRow({ id: m.id || '', nome: m.nome || '', whatsapp: m.whatsapp || '', ts: m.ts || '' }))
  wsM.getRow(1).eachCell(c => { c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE7F0F7' } }; c.font = { bold: true } })
  wsM.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: wsM.columnCount } }
  wsM.views = [{ state: 'frozen', ySplit: 1 }]
  wsR.columns = [
    { header: 'ID', key: 'id', width: 8 },
    { header: 'Nome', key: 'nome', width: 16 },
    { header: 'Nick', key: 'nick', width: 14 },
    { header: 'Quinta', key: 'quinta', width: 8 },
    { header: 'Sábado', key: 'sabado', width: 8 },
    { header: 'Classe', key: 'classe', width: 12 },
    { header: 'Ressonância', key: 'ressonancia', width: 14 },
    { header: 'Tempo', key: 'tempo', width: 10 },
    { header: 'Telefone', key: 'telefone', width: 16 },
    { header: 'Criado em', key: 'created_at', width: 24 }
  ]
  responses.forEach(r => wsR.addRow({
    id: r.id || '',
    nome: r.nome || '',
    nick: r.nick || '',
    quinta: r.quinta || '',
    sabado: r.sabado || '',
    classe: r.classe || '',
    ressonancia: r.ressonancia || '',
    tempo: r.tempo || '',
    telefone: r.telefone || '',
    created_at: r.created_at || ''
  }))
  wsR.getRow(1).eachCell(c => { c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE7F7ED' } }; c.font = { bold: true } })
  wsR.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: wsR.columnCount } }
  wsR.views = [{ state: 'frozen', ySplit: 1 }]
  const avg = mediaRes
  const resCol = wsR.getColumn('ressonancia')
  resCol.eachCell((cell, rowNumber) => {
    if (rowNumber === 1) return
    const v = Number(cell.value || 0)
    if (v > avg) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDFF7DF' } }
    if (v && v < avg) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFDEDED' } }
  })
  const quintaCol = wsR.getColumn('quinta')
  const sabadoCol = wsR.getColumn('sabado')
  for (let r = 2; r <= wsR.rowCount; r++) {
    quintaCol.getCell(r).dataValidation = { type: 'list', allowBlank: true, formulae: ['"a,b,c"'] }
    sabadoCol.getCell(r).dataValidation = { type: 'list', allowBlank: true, formulae: ['"a,b,c"'] }
  }
  const buf = await wb.xlsx.writeBuffer()
  const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `crows_export_${new Date().toISOString()}.xlsx`
  a.click()
  URL.revokeObjectURL(url)
}

export async function exportCSV() {
  const members = await getMembers()
  const responses = await getResponses()
  const mHeader = 'id,nome,whatsapp,ts\n'
  const mBody = (members || []).map(m => `${m.id || ''},${m.nome || ''},${m.whatsapp || ''},${m.ts || ''}`).join('\n') + '\n'
  const rHeader = 'id,nome,nick,quinta,sabado,classe,ressonancia,tempo,telefone,created_at\n'
  const rBody = (responses || []).map(r => `${r.id || ''},${r.nome || ''},${r.nick || ''},${r.quinta || ''},${r.sabado || ''},${r.classe || ''},${r.ressonancia || ''},${r.tempo || ''},${r.telefone || ''},${r.created_at || ''}`).join('\n') + '\n'
  const save = (name, text) => {
    const blob = new Blob([text], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    URL.revokeObjectURL(url)
  }
  save(`members_${new Date().toISOString()}.csv`, mHeader + mBody)
  save(`responses_${new Date().toISOString()}.csv`, rHeader + rBody)
}
