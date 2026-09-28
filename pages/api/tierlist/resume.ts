import type { NextApiRequest, NextApiResponse } from "next"
import { withRateLimit } from "@/config/lib/rateLimit"
import { getResumeData } from "@/features/home/actions/get-resume.server"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" })
  }

  try {
    // Sección en vivo: sin `getCache`/`setCache` ni cache de CDN, o el home
    // volvería a mostrar resultados desfasados.
    res.setHeader("Cache-Control", "no-store")
    return res.status(200).json(await getResumeData())
  } catch (error) {
    console.error("[api/tierlist/resume] GET failed:", error)
    return res.status(500).json({ message: "Error al obtener los resultados" })
  }
}

export default withRateLimit(handler)
