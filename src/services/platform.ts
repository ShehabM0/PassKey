import type { ListPaginationParams, ListPaginatedResult } from '../db/pagination.ts'
import { logger } from '../config/logger.ts'
import * as simpleIcons from 'simple-icons'

interface Platform {
  slug: string;
  name: string;
  path: string;
  aliases: string[];
}

export class managePlatform {
  private list: Platform[] = []
  private map: Map<string, Platform> = new Map()

  init(): number{
    this.list = Object.values(simpleIcons).map((icon: any) => ({
      slug: icon.slug,
      name: icon.title,
      path: icon.path,
      aliases: icon.aliases || []
    }))

    const set = new Set<string>();
    this.list.forEach(platform => {
      set.add(platform.slug.toLowerCase())
      set.add(platform.name.toLowerCase())
      platform.aliases.forEach(p => set.add(p.toLocaleLowerCase()))

      set.forEach((title: string) => { this.map.set(title, platform) })
      
      set.clear()
    })

    return this.list.length
  }

  search(query: string): Platform[] {
    if (!this.list.length)
      throw new Error('Platforms not initialized. Call init() first!');
    const q = query?.toLowerCase().trim();
    if (!q || !q.length)
      return this.list
    
    const platforms = this.list.filter((platform) =>
      platform.name.toLocaleLowerCase().includes(q) ||
      platform.slug.toLocaleLowerCase().includes(q) ||
      platform.aliases.filter(alias => alias.toLowerCase().includes(q) ).length > 0
    )

    platforms.sort((a, b) => {
      let scoreA = scorePlatform(a, q)
      let scoreB = scorePlatform(b, q)

      return scoreB - scoreA
    })

    return platforms
  }

  fetch(params: ListPaginationParams): ListPaginatedResult<Platform>{
    if (!this.list.length)
      throw new Error('Platforms not initialized. Call init() first!');

    const total = this.list.length
    const offset = params?.offset ?? 0, limit = params?.limit ?? total

    const from = offset
    const to = Math.min(from + limit, total)

    const data = this.list.slice(offset, to)

    const pagination: ListPaginatedResult<Platform> = {
      data: data,
      pagination: {
        nextOffset: to,
        limit: limit,
        totalItems: total,
        hasNextPage: to < total,
      }
    }

    return pagination
  }

  // slug, name or alias.
  get(title: string): Platform | undefined {
    if (!this.map.size)
      throw new Error('Platforms not initialized. Call init() first!');
    
    title = title?.toLocaleLowerCase().trim()
    return this.map.get(title)
  }
}

function scorePlatform(p: Platform, q: string): number {
  let score = 0;

  const name = p.name.toLowerCase();
  const slug = p.slug.toLowerCase();
  const aliases = (p.aliases ?? []).map(a => a.toLowerCase());

  if (name === q) score += 32;
  if (name.startsWith(q)) score += 16;
  if (name.includes(q)) score += 8;
  if (slug.includes(q)) score += 4;
  if (aliases.some(a => a.includes(q))) score += 2;

  const lengthDiff = Math.abs(slug.length - q.length)
  const maxLengthScore = 10
  score += Math.max(0, maxLengthScore - lengthDiff)

  return score
}

const platforms = new managePlatform()
export { platforms }