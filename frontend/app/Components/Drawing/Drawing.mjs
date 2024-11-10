'use client'
import React, { useState, useRef, useEffect } from 'react';
import "./Drawing.css";

export default function Drawing() {
    const canvasRef = useRef(null);
    const [mode, setMode] = useState("pen");
    const [isDrawing, setIsDrawing] = useState(false);
    const [penSize, setPenSize] = useState(5);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const scale = window.devicePixelRatio || 1;
        
        canvas.width = 1400 * scale;
        canvas.height = 600 * scale;
    
        context.scale(scale, scale);
    }, []);

    const getCoordinates = (event) => {
        const rect = canvasRef.current.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    };

    const startDrawing = (e) => {
        if (mode === "pen") {
            setIsDrawing(true);
            const board = canvasRef.current.getContext('2d');
            const { x, y } = getCoordinates(e);
            board.beginPath();
            board.moveTo(x, y);
        }
    };

    const draw = (e) => {
        if (mode === "pen" && isDrawing) {
            const board = canvasRef.current.getContext('2d');
            const { x, y } = getCoordinates(e);
            board.lineJoin = 'round';
            board.lineCap = 'round';
            const scale = window.devicePixelRatio || 1;
            board.lineWidth = penSize * scale;
            
            board.lineTo(x, y);
            board.stroke();
        }
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const selectTextMode = () => {
        setMode("text");
    };

    const selectPenMode = () => {
        setMode("pen");
    };

    return (
        <div className="total">
            <div className="canvasContainer">
                <div className="controlContainer">
                    <button onClick={selectPenMode}>Pen</button>
                    <button onClick={selectTextMode}>Text</button>
                </div>
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseUp={stopDrawing}
                    onMouseMove={draw}
                    style={{
                        width: '1400px', 
                        height: '600px',
                        cursor: mode === "pen" ? 'crosshair' : 'text',
                    }}
                />
            </div>
        </div>
    );
}
