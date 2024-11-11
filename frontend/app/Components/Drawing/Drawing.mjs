'use client'
import React, { useEffect, useState, useRef } from 'react';
import ReactCanvasDraw from "react-canvas-draw";
import "./Drawing.css";

export default function Drawing() {
    const canvasRef = useRef(null);
    const [mode, setMode] = useState("pen");
    const [penSize, setPenSize] = useState(2);
    const [penColor, setPenColor] = useState("#000000");
    const [backgroundColor, setBackgroundColor] = useState("#ffffff");
    const [tempColor, setTempColor] = useState("#000000");
    const [tempSize, setTempSize] = useState(2);
    const [undo, setUndo] = useState([]);

    const selectTextMode = () => setMode("text");

    const selectPenMode = () => {
        setMode("pen");
        setPenColor(tempColor);
        setPenSize(tempSize);
    }
    const selectEraserMode = () =>{
        setMode("eraser");
        setTempColor(penColor);
        setTempSize(penSize);

        setPenColor(backgroundColor);
        setPenSize(penSize * 5);
    }
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

    const setCanvas = (data) => {
        try {
            canvasRef.current.loadSaveData(data);
        } catch (e) {
            throw new Error(e);
        }
    }
    
    const handleUndo = () =>{
        const saveData = canvasRef.current.getSaveData();
        setUndo([saveData, ...undo]);
        canvasRef.current.undo();
    }

    const handleRedo = () =>{
        if (undo.length > 0){
            const lastinfo = undo[0];
            try{
                setUndo(undo.slice(1));
                canvasRef.current.loadSaveData(lastinfo, true);
            }
            catch{
                return;
            }
        }
    }

    const stopUndo = () => {
        setUndo([])
    };

    return (
        <div className="total">
            <div className="canvasContainer">
                <div className="controlContainer">
                    <button onClick={selectPenMode}>Pen</button>
                    <button onClick={selectEraserMode}>Eraser</button>
                    <label>{mode} Size:</label>
                    <input 
                        type="range" 
                        min="1" 
                        max="20" 
                        value={penSize} 
                        onChange={(e) => setPenSize(parseInt(e.target.value))} 
                    />
                    <label>Pen Color:</label>
                    {mode !== "eraser" && <input 
                        type="color" 
                        value={penColor} 
                        onChange={(e) => setPenColor(e.target.value)} 
                    />
                    }
                    <button onClick={handleUndo}>Undo</button>
                    <button onClick={handleRedo}>Redo</button>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleLoad}>Load</button>

                </div>
                <div className = "canvas"  onPointerUp={stopUndo}>
                    <ReactCanvasDraw
                            ref={canvasRef}
                            brushColor={penColor}
                            brushRadius={penSize}
                            hideGrid={true}
                            lazyRadius={4}
                            canvasWidth={2800}  
                            canvasHeight={1200} 
                            style={{
                                width: `1400px`,
                                height: `600px`,
                                backgroundColor:backgroundColor,
                            }}
                        />
                </div>
              
            </div>
        </div>
    );
}
