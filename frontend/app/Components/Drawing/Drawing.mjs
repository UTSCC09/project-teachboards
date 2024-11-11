'use client'
import React, { useEffect, useState, useRef, forwardRef } from 'react';
import ReactCanvasDraw from "react-canvas-draw";
import "./Drawing.css";

const Drawing = forwardRef(({canvasWidth, canvasHeight, noControls}) => {
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
            canvasRef.current.loadSaveData(savedData, true);
        }
    };

    const setCanvas = (data) => {
        try {
            canvasRef.current.loadSaveData(data, true);
        } catch (e) {
            throw new Error(e);
        }
    }
    useEffect(handleLoad, []);
    
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
    console.log(noControls)

    return (
        <div className="total">
            <div className="canvasContainer">
                <div className={`controlContainer ${noControls ? 'hidden' : ''}`}>
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
                            canvasWidth={canvasWidth || 2800}  
                            canvasHeight={canvasHeight || 1200} 
                            style={{
                                width: `${canvasWidth || 1600}px`,
                                height:`${canvasHeight || 600}px`,
                                backgroundColor:backgroundColor,
                            }}
                        />
                </div>
              
            </div>
        </div>
    );
});


export default Drawing;