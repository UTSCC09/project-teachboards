'use client'


import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import ReactCanvasDraw from "react-canvas-draw";
import { jsPDF } from "jspdf";
import "./Drawing.css";

const Drawing = forwardRef(({ canvasWidth, canvasHeight, noControls }, canvasRef) => {
    // const canvasRef = useRef(null);
    const [mode, setMode] = useState("pen");
    const [penSize, setPenSize] = useState(2);
    const [penColor, setPenColor] = useState("#000000");
    const [backgroundColor, setBackgroundColor] = useState("#ffffff");
    const [tempColor, setTempColor] = useState("#000000");
    const [tempSize, setTempSize] = useState(2);
    const [undo, setUndo] = useState([[]]);
    const [uploadState, setUploadState] = useState(0);
    const [canvasIndex, setCanvasIndex] = useState(0);
    const [canvasCount, setCanvasCount] = useState(1);

    const selectTextMode = () => setMode("text");

    const selectPenMode = () => {
        setMode("pen");
        setPenColor(tempColor);
        setPenSize(tempSize);
    }

    const selectEraserMode = () => {
        setMode("eraser");
        setTempColor(penColor);
        setTempSize(penSize);

        setPenColor(backgroundColor);
        setPenSize(penSize * 5);
    }

    const handleSave = () => {
        const saveData = canvasRef.current.getSaveData();
        console.log(saveData);
        localStorage.setItem(`drawing${canvasIndex}`, saveData);
    };

    const handleLoad = () => {
        const savedData = localStorage.getItem(`drawing${canvasIndex}`);
        if (savedData) {
            canvasRef.current.loadSaveData(savedData, true);
        } else {
            canvasRef.current.clear();
        }
    };

    const handleUndo = () => {
        const saveData = canvasRef.current.getSaveData();
        setUndo(prevArrayData => {
            const newArrayData = [...prevArrayData];
    
            // Ensure the array at the current canvasIndex is initialized as an empty array
            if (!newArrayData[canvasIndex]) {
                newArrayData[canvasIndex] = [];  // Initialize it if it's undefined
            }
    
            if (canvasIndex >= canvasCount) {
                newArrayData.push([saveData]);
            } else {
                newArrayData[canvasIndex] = [...newArrayData[canvasIndex], saveData];
            }
            return newArrayData;
        });
        canvasRef.current.undo();
    };

    const handleRedo = () => {
            
    }

    const goLeft = () => {
        handleSave();
        if (canvasIndex > 0) {
            setCanvasIndex(canvasIndex-1);
        }
    }
    const goRight = () => {
        handleSave();
        if (canvasIndex+1 >= canvasCount)setCanvasCount(canvasCount+1)
        setCanvasIndex(canvasIndex+1);
    }

    const clearCanvas = () => {
        canvasRef.current.clear();
    }

    useEffect( () => {
        handleLoad();
    }, [canvasIndex]);


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
                    {/* <button onClick={handleRedo}>Redo</button> */}
                    {/* <button onClick={handleSave}>Save</button>
                    <button onClick={handleLoad}>Load</button> */}
                    <button onClick={goLeft}> {"<"} </button>
                    <button onClick={goRight}> {">"} </button>
                    <button onClick={clearCanvas}>clear</button>
                    <p>{canvasIndex+1} of {canvasCount}</p>

                    { uploadState === 1 ? <p>uploading...</p> : uploadState === 2 ? <p>upload end</p> : <p>not uploading</p>}
                </div>
                <div className="canvas" onPointerUp={() => {handleSave();}}>
                    <ReactCanvasDraw
                        ref={canvasRef}
                        brushColor={penColor}
                        brushRadius={penSize}
                        hideGrid={true}
                        lazyRadius={1}
                        canvasWidth={canvasWidth || 2800}
                        canvasHeight={canvasHeight || 1200}
                        style={{
                            width: `${canvasWidth || 1600}px`,
                            height: `${canvasHeight || 600}px`,
                            backgroundColor: backgroundColor,
                        }}
                    />
                </div>
            </div>
        </div>
    );
});

export default Drawing;
