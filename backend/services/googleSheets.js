import axios from "axios"

const GAS_URL = process.env.GAS_URL

async function callGAS(action, data = {}) {
  const res = await axios.post(GAS_URL, { action, data }, { timeout: 15000 })
  return res.data
}

export async function addMember(payload) {
  return callGAS("addMember", payload)
}

export async function getMembers() {
  return callGAS("getMembers")
}

export async function addResponse(payload) {
  return callGAS("addResponse", payload)
}

export async function getResponses() {
  return callGAS("getResponses")
}

export async function ping() {
  return callGAS("ping")
}
