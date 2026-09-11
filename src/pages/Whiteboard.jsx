import { useRef, useState, useEffect } from "react";

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [tool, setTool] = useState("brush");
  const [lineWidth, setLineWidth] = useState(3);

  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 0.8;
    canvas.height = 500;

    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.lineJoin = "round";
    contextRef.current = context;
  }, []);

  const saveState = () => {
    const canvas = canvasRef.current;
    setHistory([...history, canvas.toDataURL()]);
    setRedoStack([]);
  };

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    const ctx = contextRef.current;

    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    saveState();
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = nativeEvent;
    const ctx = contextRef.current;

    ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
    ctx.lineWidth = lineWidth;

    if (tool === "brush" || tool === "eraser") {
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
    }
  };

  const drawShape = ({ nativeEvent }) => {
    if (!isDrawing || tool === "brush" || tool === "eraser") return;

    const { offsetX, offsetY } = nativeEvent;
    const ctx = contextRef.current;

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    if (tool === "line") {
      ctx.lineTo(offsetX, offsetY);
      ctx.stroke();
    }

    if (tool === "rectangle") {
      ctx.strokeRect(offsetX - 50, offsetY - 30, 100, 60);
    }

    if (tool === "circle") {
      ctx.beginPath();
      ctx.arc(offsetX, offsetY, 40, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (tool === "triangle") {
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY - 40);
      ctx.lineTo(offsetX - 40, offsetY + 40);
      ctx.lineTo(offsetX + 40, offsetY + 40);
      ctx.closePath();
      ctx.stroke();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
  };

  const undo = () => {
    if (history.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = contextRef.current;

    const previous = history[history.length - 1];
    setRedoStack([...redoStack, canvas.toDataURL()]);
    setHistory(history.slice(0, -1));

    const img = new Image();
    img.src = previous;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  };

  const redo = () => {
    if (redoStack.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = contextRef.current;

    const next = redoStack[redoStack.length - 1];
    setHistory([...history, canvas.toDataURL()]);
    setRedoStack(redoStack.slice(0, -1));

    const img = new Image();
    img.src = next;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "whiteboard.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 to-slate-200 py-6 sm:py-8 md:py-10 px-3 sm:px-6 overflow-x-hidden">
      <div className="max-w-6xl mx-auto w-full">
        
        {/* Responsive Heading Grid */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-indigo-600 mb-4 sm:mb-6 text-center sm:text-left tracking-tight">
          🎨 Advanced Whiteboard
        </h2>

        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 border border-slate-100">

          {/* Toolbar - Perfectly flows and wraps cleanly on micro mobile views */}
          <div className="flex flex-wrap gap-2.5 sm:gap-4 items-center justify-center sm:justify-start mb-5 sm:mb-6 w-full">

            <select
              value={tool}
              onChange={(e) => setTool(e.target.value)}
              className="border border-slate-200 p-2 rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50 cursor-pointer"
            >
              <option value="brush">Brush</option>
              <option value="eraser">Eraser</option>
              <option value="line">Line</option>
              <option value="rectangle">Rectangle</option>
              <option value="circle">Circle</option>
              <option value="triangle">Triangle</option>
            </select>

            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-slate-200 cursor-pointer p-0 bg-transparent"
              />
              
              <input
                type="range"
                min="1"
                max="20"
                value={lineWidth}
                onChange={(e) => setLineWidth(e.target.value)}
                className="w-20 sm:w-28 accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Actions button groupings scaling comfortably */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button 
                type="button"
                onClick={undo} 
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-xl text-xs sm:text-sm font-medium shadow-sm transition active:scale-95"
              >
                Undo
              </button>

              <button 
                type="button"
                onClick={redo} 
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl text-xs sm:text-sm font-medium shadow-sm transition active:scale-95"
              >
                Redo
              </button>

              <button 
                type="button"
                onClick={clearCanvas} 
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs sm:text-sm font-medium shadow-sm transition active:scale-95"
              >
                Clear
              </button>

              <button 
                type="button"
                onClick={saveImage} 
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-medium shadow-sm transition active:scale-95"
              >
                Save
              </button>
            </div>
          </div>

          {/* Canvas Wrapper - Enforces flexible width limits on tiny viewports */}
          <div className="border border-slate-200 rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-inner max-w-full touch-none">
            <canvas
              ref={canvasRef}
              /* Mouse Handlers */
              onMouseDown={startDrawing}
              onMouseUp={finishDrawing}
              onMouseMove={(e) => {
                draw(e);
                drawShape(e);
              }}
              onMouseLeave={finishDrawing}
              
              /* Mobile/Tablet Touch Support Hooks (Critically Added) */
              onTouchStart={(e) => {
                if (e.touches.length === 1) {
                  // Standardizes mobile touch point mapping to mimic standard mouse clicks
                  const touch = e.touches[0];
                  const mouseEvent = new MouseEvent("mousedown", {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                  });
                  canvasRef.current.dispatchEvent(mouseEvent);
                }
              }}
              onTouchEnd={() => {
                const mouseEvent = new MouseEvent("mouseup", {});
                canvasRef.current.dispatchEvent(mouseEvent);
              }}
              onTouchMove={(e) => {
                if (e.touches.length === 1) {
                  const touch = e.touches[0];
                  const mouseEvent = new MouseEvent("mousemove", {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                  });
                  canvasRef.current.dispatchEvent(mouseEvent);
                }
              }}
              className="bg-white block w-full cursor-crosshair min-h-[400px] sm:min-h-[500px]"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Whiteboard;





// import { useRef, useState, useEffect } from "react";

// const Whiteboard = () => {
//   const canvasRef = useRef(null);
//   const contextRef = useRef(null);

//   const [isDrawing, setIsDrawing] = useState(false);
//   const [color, setColor] = useState("#000000");
//   const [tool, setTool] = useState("brush");
//   const [lineWidth, setLineWidth] = useState(3);

//   const [history, setHistory] = useState([]);
//   const [redoStack, setRedoStack] = useState([]);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     canvas.width = window.innerWidth * 0.8;
//     canvas.height = 500;

//     const context = canvas.getContext("2d");
//     context.lineCap = "round";
//     context.lineJoin = "round";
//     contextRef.current = context;
//   }, []);

//   const saveState = () => {
//     const canvas = canvasRef.current;
//     setHistory([...history, canvas.toDataURL()]);
//     setRedoStack([]);
//   };

//   const startDrawing = ({ nativeEvent }) => {
//     const { offsetX, offsetY } = nativeEvent;
//     const ctx = contextRef.current;

//     ctx.beginPath();
//     ctx.moveTo(offsetX, offsetY);
//     setIsDrawing(true);
//     saveState();
//   };

//   const finishDrawing = () => {
//     contextRef.current.closePath();
//     setIsDrawing(false);
//   };

//   const draw = ({ nativeEvent }) => {
//     if (!isDrawing) return;

//     const { offsetX, offsetY } = nativeEvent;
//     const ctx = contextRef.current;

//     ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
//     ctx.lineWidth = lineWidth;

//     if (tool === "brush" || tool === "eraser") {
//       ctx.lineTo(offsetX, offsetY);
//       ctx.stroke();
//     }
//   };

//   const drawShape = ({ nativeEvent }) => {
//     if (!isDrawing || tool === "brush" || tool === "eraser") return;

//     const { offsetX, offsetY } = nativeEvent;
//     const ctx = contextRef.current;

//     ctx.strokeStyle = color;
//     ctx.lineWidth = lineWidth;

//     if (tool === "line") {
//       ctx.lineTo(offsetX, offsetY);
//       ctx.stroke();
//     }

//     if (tool === "rectangle") {
//       ctx.strokeRect(offsetX - 50, offsetY - 30, 100, 60);
//     }

//     if (tool === "circle") {
//       ctx.beginPath();
//       ctx.arc(offsetX, offsetY, 40, 0, Math.PI * 2);
//       ctx.stroke();
//     }

//     if (tool === "triangle") {
//       ctx.beginPath();
//       ctx.moveTo(offsetX, offsetY - 40);
//       ctx.lineTo(offsetX - 40, offsetY + 40);
//       ctx.lineTo(offsetX + 40, offsetY + 40);
//       ctx.closePath();
//       ctx.stroke();
//     }
//   };

//   const clearCanvas = () => {
//     const canvas = canvasRef.current;
//     contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
//   };

//   const undo = () => {
//     if (history.length === 0) return;

//     const canvas = canvasRef.current;
//     const ctx = contextRef.current;

//     const previous = history[history.length - 1];
//     setRedoStack([...redoStack, canvas.toDataURL()]);
//     setHistory(history.slice(0, -1));

//     const img = new Image();
//     img.src = previous;
//     img.onload = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       ctx.drawImage(img, 0, 0);
//     };
//   };

//   const redo = () => {
//     if (redoStack.length === 0) return;

//     const canvas = canvasRef.current;
//     const ctx = contextRef.current;

//     const next = redoStack[redoStack.length - 1];
//     setHistory([...history, canvas.toDataURL()]);
//     setRedoStack(redoStack.slice(0, -1));

//     const img = new Image();
//     img.src = next;
//     img.onload = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       ctx.drawImage(img, 0, 0);
//     };
//   };

//   const saveImage = () => {
//     const canvas = canvasRef.current;
//     const link = document.createElement("a");
//     link.download = "whiteboard.png";
//     link.href = canvas.toDataURL();
//     link.click();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-10">
//       <div className="max-w-6xl mx-auto">
//         <h2 className="text-3xl font-bold text-indigo-600 mb-6">
//           🎨 Advanced Whiteboard
//         </h2>

//         <div className="bg-white rounded-3xl shadow-2xl p-6">

//           {/* Toolbar */}
//           <div className="flex flex-wrap gap-4 items-center mb-6">

//             <select
//               value={tool}
//               onChange={(e) => setTool(e.target.value)}
//               className="border p-2 rounded-xl"
//             >
//               <option value="brush">Brush</option>
//               <option value="eraser">Eraser</option>
//               <option value="line">Line</option>
//               <option value="rectangle">Rectangle</option>
//               <option value="circle">Circle</option>
//               <option value="triangle">Triangle</option>
//             </select>

//             <input
//               type="color"
//               value={color}
//               onChange={(e) => setColor(e.target.value)}
//               className="w-10 h-10 rounded-lg border"
//             />

//             <input
//               type="range"
//               min="1"
//               max="20"
//               value={lineWidth}
//               onChange={(e) => setLineWidth(e.target.value)}
//             />

//             <button onClick={undo} className="px-4 py-2 bg-gray-500 text-white rounded-xl">
//               Undo
//             </button>

//             <button onClick={redo} className="px-4 py-2 bg-gray-600 text-white rounded-xl">
//               Redo
//             </button>

//             <button onClick={clearCanvas} className="px-4 py-2 bg-red-500 text-white rounded-xl">
//               Clear
//             </button>

//             <button onClick={saveImage} className="px-4 py-2 bg-indigo-600 text-white rounded-xl">
//               Save
//             </button>
//           </div>

//           {/* Canvas */}
//           <div className="border rounded-2xl overflow-hidden">
//             <canvas
//               ref={canvasRef}
//               onMouseDown={startDrawing}
//               onMouseUp={finishDrawing}
//               onMouseMove={(e) => {
//                 draw(e);
//                 drawShape(e);
//               }}
//               onMouseLeave={finishDrawing}
//               className="bg-white"
//             />
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Whiteboard;
