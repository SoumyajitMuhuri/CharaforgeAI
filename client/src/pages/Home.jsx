import { useState } from 'react'
import {
    AlertCircle,
    Download,
    LoaderCircle,
} from 'lucide-react'

import DrawingCanvas from '../components/DrawingCanvas'

function Home() {

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [style, setStyle] = useState('')
    const [drawing, setDrawing] = useState(null)

    const [generatedCharacter, setGeneratedCharacter] = useState(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [isPublishing, setIsPublishing] = useState(false)

    //ERROR HANDLING STATES
    const [generationError, setGenerationError] = useState(false)
    const [formError, setFormError] = useState('')
    const [publishError, setPublishError] = useState('')


    async function handleGenerate() {

        if (!name.trim()) {
            setFormError('Please enter a character name.')
            return
        }

        if (!drawing) {
            setFormError('Please draw your character first.')
            return
        }

        setFormError('')
        setIsGenerating(true)
        setGenerationError(false)
        setGeneratedCharacter(null)

        try {
            const response = await fetch(
                '/api/generate',
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name,
                        description,
                        style,
                        drawing
                    })
                }
            )

            if (!response.ok) {
                throw new Error('Generation failed')
            }

            const data = await response.json()

            setGeneratedCharacter({
                name,
                description,
                style,
                drawing,
                aiInfo: data.aiInfo,
                image: data.image
            })

        } catch (err) {
            console.error(err)
            setGenerationError(true)

        } finally {
            setIsGenerating(false)
        }
    }

    function handleDownload() {

        if (!generatedCharacter?.image) return

        const link = document.createElement('a')

        link.href = generatedCharacter.image
        link.download = `${generatedCharacter.name || 'charaforge-character'}.png`

        link.click()
    }


    async function handlePublish() {

        if (!generatedCharacter || generatedCharacter.published) {
            return
        }

        setIsPublishing(true)
        setPublishError('')

        try {

            const response = await fetch(
                '/api/characters',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: generatedCharacter.name,
                        description: generatedCharacter.description,
                        aiInfo: generatedCharacter.aiInfo,
                        imageUrl: generatedCharacter.image,
                        published: true
                    })
                }
            )

            if (!response.ok) {
                throw new Error('Failed to publish character')
            }

            const publishedCharacter = await response.json()

            setGeneratedCharacter((previous) => ({
                ...previous,
                id: publishedCharacter.id,
                published: true
            }))

        } catch (error) {

            console.error(error)

            setPublishError(
                'Unable to publish your character right now.'
            )

        } finally {

            setIsPublishing(false)

        }
    }

    return (
        <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-white">

            <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 p-4 sm:p-6 lg:grid-cols-2 lg:gap-8 lg:p-8">


                {/* Generator(Left) */}

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">

                    <div className="mb-6">

                        <h2 className="text-2xl font-semibold">
                            Create your character
                        </h2>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Sketch your idea and bring it to life.
                        </p>

                    </div>


                    {/* Drawing canvas */}

                    <div className="w-full overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">

                        <DrawingCanvas
                            onDrawingChange={setDrawing}
                        />

                    </div>


                    {/* Character name */}

                    <div className="mt-5">

                        <label className="mb-2 block text-sm font-medium">
                            Character name
                        </label>

                        <input
                            type="text"
                            placeholder="Name your character"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 dark:border-gray-700 dark:bg-gray-800"
                        />

                    </div>


                    {/* Description */}

                    <div className="mt-4">

                        <label className="mb-2 block text-sm font-medium">
                            Character description <span className="text-gray-400">(optional)</span>
                        </label>

                        <textarea
                            placeholder="Describe your character..."
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            rows="4"
                            className="w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
                        />

                    </div>


                    {/* Style */}

                    <div className="mt-4">

                        <label className="mb-2 block text-sm font-medium">
                            Visual style <span className="text-gray-400">(optional)</span>
                        </label>

                        <select
                            value={style}
                            onChange={(event) => setStyle(event.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 dark:border-gray-700 dark:bg-gray-800"
                        >

                            <option value="">
                                Choose a style
                            </option>

                            <option value="anime">
                                Anime
                            </option>

                            <option value="retro(16-bit)">
                                Retro 16-bit
                            </option>

                            <option value="minecraft">
                                Minecraft
                            </option>

                            <option value="cartoon">
                                Cartoon
                            </option>

                            <option value="pixel art">
                                Pixel Art
                            </option>

                            <option value="comic book">
                                Comic book
                            </option>

                            <option value="photorealistic">
                                Photorealistic
                            </option>

                            <option value="steampunk">
                                Steampunk
                            </option>

                            <option value="pokemon">
                                Pokemon
                            </option>

                            <option value="fantasy">
                                Fantasy
                            </option>

                        </select>

                    </div>


                    {/* Generate */}

                    {formError && (
                        <p className="mt-4 text-sm font-medium text-red-500">
                            {formError}
                        </p>
                    )}

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-600 px-5 py-3.5 font-semibold text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        {isGenerating ? (
                            <>
                                <LoaderCircle
                                    size={20}
                                    className="animate-spin"
                                />

                                Generating...
                            </>
                        ) : (
                            <>

                                Generate Character
                            </>
                        )}

                    </button>

                </div>


                {/* =========================
                    RESULT PANEL
                ========================= */}

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">

                    <div className="mb-6">

                        <h2 className="text-2xl font-semibold">
                            Your character
                        </h2>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Your generated creation will appear here.
                        </p>

                    </div>


                    {/* IMAGE / RESULT AREA */}

                    <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">


                        {/* Loading */}

                        {isGenerating && (

                            <div className="flex flex-col items-center gap-3 text-gray-500 dark:text-gray-400">

                                <LoaderCircle
                                    size={42}
                                    className="animate-spin text-pink-500"
                                />

                                <p className="font-medium">
                                    Generating...
                                </p>

                            </div>

                        )}


                        {/* Error */}

                        {!isGenerating && generationError && (

                            <div className="flex max-w-xs flex-col items-center gap-3 px-6 text-center">

                                <AlertCircle
                                    size={42}
                                    className="text-shadow-blue-950"
                                />

                                <p className="font-medium">
                                    Oops! Looks like something is broken right now!
                                </p>

                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Try generating again in a moment.
                                </p>

                            </div>

                        )}


                        {/* Empty */}

                        {!isGenerating &&
                            !generationError &&
                            !generatedCharacter && (

                                <p className="px-6 text-center text-gray-400">
                                    Your generated image will appear here
                                </p>

                            )}


                        {/* Generated image */}

                        {!isGenerating &&
                            !generationError &&
                            generatedCharacter?.image && (

                                <img
                                    src={generatedCharacter.image}
                                    alt={generatedCharacter.name}
                                    className="h-full w-full object-contain"
                                />

                            )}

                    </div>


                    {/* RESULT INFORMATION */}

                    {generatedCharacter && !isGenerating && !generationError && (

                        <div className="mt-5">

                            <h3 className="text-xl font-semibold">
                                {generatedCharacter.name}
                            </h3>

                            {generatedCharacter.aiInfo && (

                                <p className="mt-2 leading-relaxed text-gray-600 dark:text-gray-300">
                                    {generatedCharacter.aiInfo}
                                </p>

                            )}


                            {/* ACTIONS */}

                            <div className="mt-5 flex flex-wrap gap-3">

                                <button
                                    onClick={handlePublish}
                                    disabled={isPublishing || generatedCharacter?.published}
                                    className="flex items-center justify-center gap-2 rounded-lg bg-blue-950 px-4 py-2.5 font-medium text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isPublishing
                                        ? 'Publishing...'
                                        : generatedCharacter?.published
                                            ? 'Published'
                                            : 'Publish'
                                    }
                                </button>

                                <button
                                    onClick={handleDownload}
                                    className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 font-medium transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                                >
                                    <Download size={18} />
                                </button>

                                {publishError && (
                                    <p className="mt-3 text-sm font-medium text-red-500">
                                        {publishError}
                                    </p>
                                )}

                            </div>

                        </div>

                    )}

                </div>

            </section>

        </main>
    )
}

export default Home
