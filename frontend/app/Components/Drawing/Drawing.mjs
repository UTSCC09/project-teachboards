'use client'
import React, { useEffect, useState, useRef } from 'react';
import ReactCanvasDraw from "react-canvas-draw";
import "./Drawing.css";

export default function Drawing() {
    const canvasRef = useRef(null);
    const [mode, setMode] = useState("pen");
    const [penSize, setPenSize] = useState(2);
    const [penColor, setPenColor] = useState("#000000");

    const [width, setWidth] = useState(null);
    const [height, setHeight] = useState(null);

    const selectTextMode = () => setMode("text");
    const selectPenMode = () => setMode("pen");

    const handleSave = () => {
        const saveData = canvasRef.current.getSaveData();
        localStorage.setItem("drawing", saveData); 
    };

    const handleLoad = () => {
        const savedData = localStorage.getItem("drawing");
        if (savedData) {
            canvasRef.current.loadSaveData(savedData);
        }
    };


    useEffect(()=>{

        const handleResize = () => {
            setWidth(window.innerWidth * 0.9);
            setHeight(window.innerHeight * 0.7);
        }

        window.addEventListener('resize', handleResize);
        handleResize();
        return () =>{
            window.removeEventListener("resize",handleResize);
        }
    },[])
    return (
        <div className="total">
            <div className="canvasContainer">
                <div className="controlContainer">
                    <button onClick={selectPenMode}>Pen</button>
                    <label>Pen Size:</label>
                    <input 
                        type="range" 
                        min="1" 
                        max="20" 
                        value={penSize} 
                        onChange={(e) => setPenSize(parseInt(e.target.value))} 
                    />
                    <label>Pen Color:</label>
                    <input 
                        type="color" 
                        value={penColor} 
                        onChange={(e) => setPenColor(e.target.value)} 
                    />
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleLoad}>Load</button>

                </div>
                <div className = "canvas">
                    <ReactCanvasDraw
                            ref={canvasRef}
                            brushColor={penColor}
                            brushRadius={penSize}
                            lazyRadius={4}
                            canvasWidth={2800}  
                            canvasHeight={1200} 
                            style={{
                                width: `${width}px`,
                                height: `${height}px`,
                            }}
                        />
                </div>
              
            </div>
        </div>
    );
}
