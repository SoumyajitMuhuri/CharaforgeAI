import { useRef, useState } from "react";
import { Brush, Palette, Trash2 } from "lucide-react";

function DrawingCanvas({ onDrawingChange }) {
    const canvasRef = useRef(null);
    const isDrawing = useRef(false);

    const [brushSize, setBrushSize] = useState(5);
    const [brushColor, setBrushColor] = useState("#000000");
    const [hasDrawing, setHasDrawing] = useState(false);


    function getCanvasCoordinates(event) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (event.clientX - rect.left) * scaleX,
            y: (event.clientY - rect.top) * scaleY,
        };
    }


    function startDrawing(event) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        isDrawing.current = true;
        setHasDrawing(true);

        canvas.setPointerCapture(event.pointerId);

        const { x, y } = getCanvasCoordinates(event);

        ctx.beginPath();
        ctx.moveTo(x, y);

        ctx.beginPath();
        ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = brushColor;
        ctx.fill();
    }


    function draw(event) {
        if (!isDrawing.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const { x, y } = getCanvasCoordinates(event);

        ctx.lineWidth = brushSize;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = brushColor;

        ctx.lineTo(x, y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x, y);
    }


    function stopDrawing() {
        if (!isDrawing.current) return;

        isDrawing.current = false;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        ctx.beginPath();

        const drawing = canvas.toDataURL();
        onDrawingChange(drawing);
    }


    function clearCanvas() {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        setHasDrawing(false);
        onDrawingChange(null);
    }


    return (
        <div className="w-full">

            {/* Canvas */}

            <div className="relative w-full">

                <canvas
                    ref={canvasRef}
                    width={600}
                    height={400}
                    onPointerDown={startDrawing}
                    onPointerMove={draw}
                    onPointerUp={stopDrawing}
                    onPointerCancel={stopDrawing}
                    className="block aspect-3/2 w-full touch-none rounded-lg bg-white"
                />

                {!hasDrawing && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <p className="text-center text-sm text-gray-400 sm:text-base">
                            Doodle your character here
                        </p>
                    </div>
                )}

            </div>


            {/* Controls */}

            <div className="mt-2 px-3 py-2 flex flex-wrap items-center gap-4">


                {/* Clear */}

                <button
                    type="button"
                    onClick={clearCanvas}
                    className="flex items-center gap-2 rounded-lg bg-gray-200 px-3 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                >
                    <Trash2 size={17} />
                    Clear
                </button>


                {/* Brush size */}

                <div className="flex min-w-0 flex-1 items-center gap-2">

                    <Brush
                        size={18}
                        className="shrink-0"
                    />

                    <input
                        id="brush-size"
                        type="range"
                        min="1"
                        max="30"
                        value={brushSize}
                        onChange={(event) =>
                            setBrushSize(Number(event.target.value))
                        }
                        className="min-w-20 max-w-65  flex-1 accent-pink-500"
                    />

                    {/* Visual brush size */}

                    <span
                        className="shrink-0 rounded-full bg-black dark:bg-white"
                        style={{
                            width: `${Math.max(brushSize, 4)}px`,
                            height: `${Math.max(brushSize, 4)}px`,
                        }}
                    />

                </div>


                {/* Colour */}

                <div className="flex items-center gap-2 ">

                    <Palette size={18} />

                    <div
                        className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border-2 border-gray-300 dark:border-gray-600"
                        style={{ backgroundColor: brushColor }}
                    >
                        <input
                            id="brush-color"
                            type="color"
                            value={brushColor}
                            onChange={(event) => setBrushColor(event.target.value)}
                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        />
                    </div>

                </div>

            </div>

        </div>
    );
}

export default DrawingCanvas;