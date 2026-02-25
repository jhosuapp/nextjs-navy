type RateRecord = {
    count: number
    start: number
  }
  
  const rateLimitMap = new Map<string, RateRecord>()
  
  const WINDOW_MS = 60 * 1000
  const MAX_REQUESTS = 40
  
export function withRateLimit(handler: any) {
    return async (req: any, res: any) => {
        const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.socket.remoteAddress || "unknown";
    
        const now = Date.now()
        const record = rateLimitMap.get(ip)
    
        if (!record) {
            rateLimitMap.set(ip, { count: 1, start: now })
        } else {
            if (now - record.start > WINDOW_MS) {
                rateLimitMap.set(ip, { count: 1, start: now })
            } else {
                record.count++
                if (record.count > MAX_REQUESTS) {
                    return res.status(429).json({
                        message: "Too many requests",
                    })
                }
            }
        }

        return handler(req, res)
    }
}