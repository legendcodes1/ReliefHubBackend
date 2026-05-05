import { requestJson } from '../../lib/apiClient'
import type { BodyPart, DiscomfortType } from './catalogTypes'

export async function getBodyParts() {
  return requestJson<BodyPart[]>('/api/v1/body-parts', {
    withAuth: true,
  })
}

export async function getDiscomfortTypes() {
  return requestJson<DiscomfortType[]>('/api/v1/discomfort-types', {
    withAuth: true,
  })
}
