import { Liveblocks } from "@liveblocks/node"

const globalForLiveblocks = globalThis as unknown as {
  liveblocks: Liveblocks | undefined
}

function getLiveblocksClient(): Liveblocks {
  if (!globalForLiveblocks.liveblocks) {
    globalForLiveblocks.liveblocks = new Liveblocks({
      secret: process.env.LIVEBLOCKS_SECRET_KEY!,
    })
  }

  return globalForLiveblocks.liveblocks
}

const CURSOR_COLORS = [
  "#00C8D4",
  "#6457F9",
  "#FF6166",
  "#62C073",
  "#FF990A",
  "#BF7AF0",
  "#F75F8F",
  "#52A8FF",
] as const

function getCursorColorForUser(userId: string): string {
  let hash = 0

  for (let i = 0; i < userId.length; i++) {
    hash = (hash << 5) - hash + userId.charCodeAt(i)
    hash |= 0
  }

  return CURSOR_COLORS[Math.abs(hash) % CURSOR_COLORS.length]
}

export { getCursorColorForUser, getLiveblocksClient }
