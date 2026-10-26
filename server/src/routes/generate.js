const express = require('express')
const sharp = require('sharp')
const { GoogleGenAI } = require('@google/genai')


const router = express.Router()

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})

router.post('/', async (req, res) => {
    const { name, description, style, drawing } = req.body

    try {
        if (!process.env.IMAGEKIT_PRIVATE_KEY) {
            return res.status(503).json({ error: 'Image storage is not configured' })
        }

        if (!name || !drawing) {
            return res.status(400).json({
                error: 'Character name and drawing are required'
            })
        }

        // 1. Convert the canvas Base64 data into a Buffer

        const [header, base64Data] = drawing.split(',')

        const mimeMatch = header.match(/data:(.*);base64/)

        if (!mimeMatch) {
            return res.status(400).json({
                error: 'Invalid drawing format'
            })
        }

        const imageBuffer = Buffer.from(base64Data, 'base64')

        // 2. Resize the sketch for FLUX.2

        const resizedImage = await sharp(imageBuffer)
            .resize({
                width: 512,
                height: 512,
                fit: 'inside'
            })
            .png()
            .toBuffer()

        // 3. Create the prompt

        const prompt = `
Create a polished fantasy RPG character illustration based on the provided sketch.

Character name: ${name}

Character description:
${description || 'No additional description provided.'}

Visual style:
${style || 'fantasy RPG character art'}

Use the sketch as the primary reference for the character's
shape, silhouette, pose, and recognizable features.

Transform the rough sketch into a finished, detailed,
professional character illustration.

Keep the character clearly recognizable as the character
drawn in the original sketch.
        `.trim()

        const textResponse = await ai.models.generateContent({
            model: 'gemini-3.5-flash-lite',
            contents: `
Create a short fantasy character profile.

Character name: ${name}

User description:
${description || 'No description provided.'}

Visual style:
${style || 'fantasy RPG'}

Write 2-3 engaging sentences describing:
- the character's appearance
- personality
- abilities
- role in the world

Do not mention AI, image generation, prompts, or the user.
    `.trim()
        })

        const aiInfo = textResponse.text

        // 4. Create multipart form data

        const formData = new FormData()

        formData.append('prompt', prompt)

        formData.append(
            'input_image_0',
            new Blob([resizedImage], {
                type: 'image/png'
            }),
            'sketch.png'
        )

        formData.append('width', '1024')
        formData.append('height', '1024')

        // 5. Send request to Cloudflare

        const cloudflareResponse = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/black-forest-labs/flux-2-klein-4b`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`
                },
                body: formData
            }
        )

        // 6. Check for Cloudflare errors

        if (!cloudflareResponse.ok) {
            const errorText = await cloudflareResponse.text()

            console.error(
                'Cloudflare AI Error:',
                cloudflareResponse.status,
                errorText
            )

            return res.status(500).json({
                error: 'Image generation failed'
            })
        }

        // 7. Read Cloudflare response

        const contentType =
            cloudflareResponse.headers.get('content-type') || ''

        let generatedImageBase64
        let generatedImageType = 'image/png'

        if (contentType.includes('application/json')) {

            const data = await cloudflareResponse.json()

            console.log('Cloudflare response received')

            generatedImageBase64 = data.result?.image

            if (!generatedImageBase64) {
                console.error(
                    'Cloudflare response did not contain an image:',
                    data
                )

                return res.status(500).json({
                    error: 'Cloudflare did not return an image'
                })
            }

        } else {

            // Some image-generation endpoints may return
            // the image directly as binary data.

            const generatedImageBuffer = Buffer.from(
                await cloudflareResponse.arrayBuffer()
            )

            generatedImageBase64 =
                generatedImageBuffer.toString('base64')

            generatedImageType =
                contentType || 'image/png'
        }

        // 8. Store the generated image in ImageKit and send its URL back to React

        const imageKitForm = new FormData()
        imageKitForm.append('file', `data:${generatedImageType};base64,${generatedImageBase64}`)
        imageKitForm.append(
            'fileName',
            `${name.trim().replace(/[^a-z0-9_-]+/gi, '-').slice(0, 60) || 'character'}-${Date.now()}.png`
        )
        imageKitForm.append('useUniqueFileName', 'true')

        const imageKitResponse = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
            method: 'POST',
            headers: {
                Authorization: `Basic ${Buffer.from(`${process.env.IMAGEKIT_PRIVATE_KEY}:`).toString('base64')}`
            },
            body: imageKitForm
        })

        if (!imageKitResponse.ok) {
            console.error('ImageKit upload failed:', imageKitResponse.status, await imageKitResponse.text())
            return res.status(502).json({ error: 'Generated image could not be stored' })
        }

        const uploadedImage = await imageKitResponse.json()

        res.json({
            aiInfo,
            image: uploadedImage.url
        })

    } catch (error) {

        console.error('Image generation error:', error)

        res.status(500).json({
            error: 'Image generation failed'
        })
    }
})

module.exports = router
