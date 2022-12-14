import express from "express"
import cors from "cors"
import { PrismaClient } from "@prisma/client"
import { convertHourStringToMinutes } from "./utils/ConvertHour"
import { convertMinutesToHoursString } from "./utils/ConvertMin"

const app = express()
app.use(express.json())
app.use(cors())

const prisma = new PrismaClient()

app.get('/games', async (req, res) => {
    const games = await prisma.game.findMany({
        include: {
            _count:{
                select: {
                    ads: true,
                }
            }
        }
    })

    return res.json(games)
})

app.post('/games/:id/ads', async (req, res) => {
    const gameId = req.params.id
    const body = req.body

    const ad = prisma.ad.create({
        data:{
            gameId,
            name: body.name,
            yearsPlaying: body.discord,    
            discord: body.discord,         
            weekDays: body.weekDays.join(','),        
            hourStart: convertHourStringToMinutes(body.hourStart), 
            hourEnd: convertHourStringToMinutes(body.hourEnd),
            useVoiceChannel: body.useVoiceChannel,
        }
    })

    return res.status(201).json(ad)
})

app.get('/games/:id/ads', async (req, res) => {
    const gameId = req.params.id
    
    const ads = await prisma.ad.findMany({
        select:{
            id: true,
            name: true,
            useVoiceChannel: true,
            weekDays: true,
            hourStart: true,
            hourEnd: true,
            yearsPlaying: true,
        },
        where: {
            gameId,
        },
        orderBy:{
            createdAt: "desc"
        }
    })
    return res.json(ads.map(ad => {
        return {
            ...ad,
            weekDays: ad.weekDays.split(','),
            hourStart: convertMinutesToHoursString(ad.hourStart),
            hourEnd: convertMinutesToHoursString(ad.hourEnd),
        }
    }))
})

app.get('/ads/:id/discord', async (req, res) => {
    const adId = req.params.id
    const ad = await prisma.ad.findUniqueOrThrow({
        select:{
            discord: true,
        },
        where: {
            id: adId
        }
    })

    return res.json({
        discord: ad.discord,
    })
})

app.listen(3000)