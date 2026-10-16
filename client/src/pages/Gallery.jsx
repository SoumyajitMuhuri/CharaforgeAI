import { useEffect, useState } from 'react'
import {
    ArrowDownUp,
    Heart,
    RefreshCw,
    X
} from 'lucide-react'


function Gallery() {

    const [characters, setCharacters] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [sortBy, setSortBy] = useState('latest')
    const [selectedCharacter, setSelectedCharacter] = useState(null)


    async function fetchCharacters() {

        setLoading(true)
        setError(false)

        try {

            const response = await fetch(
                '/api/characters'
            )

            if (!response.ok) {
                throw new Error('Failed to fetch characters')
            }

            const data = await response.json()

            const publishedCharacters = data.filter(
                (character) => character.published
            )

            setCharacters(publishedCharacters)

        } catch (error) {

            console.error(error)
            setError(true)

        } finally {

            setLoading(false)

        }
    }


    useEffect(() => {
        fetchCharacters()
    }, [])


    function sortCharacters(charactersToSort) {

        const sorted = [...charactersToSort]

        if (sortBy === 'latest') {

            sorted.sort(
                (a, b) =>
                    new Date(b.created_at) -
                    new Date(a.created_at)
            )

        }

        if (sortBy === 'oldest') {

            sorted.sort(
                (a, b) =>
                    new Date(a.created_at) -
                    new Date(b.created_at)
            )

        }

        if (sortBy === 'most-liked') {

            sorted.sort(
                (a, b) => b.likes - a.likes
            )

        }

        return sorted
    }


    async function handleLike(id) {

        try {

            const response = await fetch(
                `/api/characters/${id}/like`,
                {
                    method: 'PATCH'
                }
            )

            if (!response.ok) {
                throw new Error('Failed to like character')
            }

            const updatedCharacter = await response.json()

            setCharacters((previousCharacters) =>
                previousCharacters.map((character) =>
                    character.id === updatedCharacter.id
                        ? updatedCharacter
                        : character
                )
            )

            setSelectedCharacter(updatedCharacter)

        } catch (error) {

            console.error(error)

        }
    }


    function handleDownload() {

        if (!selectedCharacter?.image_url) return

        const link = document.createElement('a')

        link.href = selectedCharacter.image_url

        link.download = `${selectedCharacter.name || 'charaforge-character'}.png`

        link.click()
    }


    async function handleShare() {

        if (!selectedCharacter) return

        const shareData = {
            title: selectedCharacter.name,
            text: selectedCharacter.ai_info || 'Check out this character created with CharaforgeAI!'
        }

        if (navigator.share) {

            try {

                await navigator.share(shareData)

            } catch (error) {

                console.log('Share cancelled')

            }

        } else {

            try {

                await navigator.clipboard.writeText(
                    window.location.href
                )

                alert('Gallery link copied to clipboard!')

            } catch (error) {

                console.error('Unable to share:', error)

            }

        }
    }


    const sortedCharacters = sortCharacters(characters)


    return (
        <main className="min-h-screen bg-gray-50 px-4 py-6 text-gray-900 dark:bg-gray-950 dark:text-white">

            <div className="mx-auto w-full max-w-7xl">


                {/* =========================
                    HEADER
                ========================= */}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <h1 className="text-3xl font-bold">
                            Gallery
                        </h1>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Explore characters created with CharaforgeAI.
                        </p>

                    </div>


                    {/* Controls */}

                    <div className="flex items-center gap-3">


                        {/* Sort */}

                        <div className="flex items-center gap-2">

                            <ArrowDownUp size={18} />

                            <select
                                value={sortBy}
                                onChange={(event) =>
                                    setSortBy(event.target.value)
                                }
                                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-pink-500 dark:border-gray-700 dark:bg-gray-900"
                            >

                                <option value="latest">
                                    Latest
                                </option>

                                <option value="oldest">
                                    Oldest
                                </option>

                                <option value="most-liked">
                                    Most liked
                                </option>

                            </select>

                        </div>


                        {/* Refresh */}

                        <button
                            onClick={fetchCharacters}
                            disabled={loading}
                            className="flex items-center gap-2 rounded-lg bg-pink-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            <RefreshCw
                                size={17}
                                className={
                                    loading
                                        ? 'animate-spin'
                                        : ''
                                }
                            />

                            <span className="hidden sm:inline">
                                Refresh
                            </span>

                        </button>

                    </div>

                </div>


                {/* =========================
                    LOADING
                ========================= */}

                {loading && (

                    <div className="flex min-h-64 items-center justify-center">

                        <RefreshCw
                            size={32}
                            className="animate-spin text-pink-500"
                        />

                    </div>

                )}


                {/* =========================
                    ERROR
                ========================= */}

                {!loading && error && (

                    <div className="mt-10 rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600 dark:border-red-900 dark:bg-red-950/30">

                        Something went wrong while loading the gallery.

                    </div>

                )}


                {/* =========================
                    EMPTY
                ========================= */}

                {!loading &&
                    !error &&
                    sortedCharacters.length === 0 && (

                        <div className="mt-10 rounded-xl border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">

                            <p className="text-gray-500 dark:text-gray-400">
                                No published characters yet.
                            </p>

                        </div>

                    )}


                {/* =========================
                    GALLERY GRID
                ========================= */}

                {!loading &&
                    !error &&
                    sortedCharacters.length > 0 && (

                        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

                            {sortedCharacters.map((character) => (

                                <article
                                    key={character.id}
                                    onClick={() =>
                                        setSelectedCharacter(character)
                                    }
                                    className="cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
                                >

                                    <div className="aspect-square bg-gray-100 dark:bg-gray-800">

                                        <img
                                            src={character.image_url}
                                            alt={character.name}
                                            className="h-full w-full object-cover"
                                        />

                                    </div>

                                    <div className="p-3">

                                        <h2 className="truncate font-medium">
                                            {character.name}
                                        </h2>

                                    </div>

                                </article>

                            ))}

                        </div>

                    )}


                {/* =========================
                    CHARACTER DETAIL MODAL
                ========================= */}

                {selectedCharacter && (

                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
                        onClick={() =>
                            setSelectedCharacter(null)
                        }
                    >

                        <div
                            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 dark:bg-gray-900 sm:p-6"
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                        >


                            {/* Close */}

                            <button
                                onClick={() =>
                                    setSelectedCharacter(null)
                                }
                                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/10 transition hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
                                aria-label="Close"
                            >

                                <X size={20} />

                            </button>


                            {/* Image */}

                            <div className="overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">

                                <img
                                    src={selectedCharacter.image_url}
                                    alt={selectedCharacter.name}
                                    className="max-h-[60vh] w-full object-contain"
                                />

                            </div>


                            {/* Character information */}

                            <div className="mt-5">

                                <h2 className="text-2xl font-bold">
                                    {selectedCharacter.name}
                                </h2>


                                {selectedCharacter.ai_info && (

                                    <p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-300">
                                        {selectedCharacter.ai_info}
                                    </p>

                                )}


                                {/* Actions */}

                                <div className="mt-5 flex flex-wrap gap-3">


                                    {/* Like */}

                                    <button
                                        onClick={() =>
                                            handleLike(
                                                selectedCharacter.id
                                            )
                                        }
                                        className="flex items-center gap-2 rounded-lg bg-pink-500 px-4 py-2.5 font-medium text-white transition hover:bg-pink-600"
                                    >

                                        <Heart
                                            size={18}
                                            fill="currentColor"
                                        />

                                        {selectedCharacter.likes}

                                    </button>


                                    {/* Download */}

                                    <button
                                        onClick={handleDownload}
                                        className="rounded-lg border border-gray-300 px-4 py-2.5 font-medium transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                                    >

                                        Download

                                    </button>


                                    {/* Share */}

                                    <button
                                        onClick={handleShare}
                                        className="rounded-lg border border-gray-300 px-4 py-2.5 font-medium transition hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                                    >

                                        Share

                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </main>
    )
}

export default Gallery
