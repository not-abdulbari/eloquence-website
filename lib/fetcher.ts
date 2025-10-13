import { SiteData } from './types'

export default async function fetcher<T = any>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`)
  }
  return res.json()
}

export async function fetchSiteData(): Promise<SiteData> {
  return fetcher<SiteData>('/data/site-data.json')
}
