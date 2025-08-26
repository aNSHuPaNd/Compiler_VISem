import React, { useState, useRef } from "react";
import { SplitPane } from "@rexxars/react-split-pane";
import "./App.css";

//import ParseTree from "./ParseTree"; //  Parse tree visual component
//import { extractParseTreeFromOutput } from "./extractParseTree"; //  Extract JSON tree

function App() {
  const [code, setCode] = useState(`val x=2;\nval y=x+8;\nprt(y);`);
  const [output, setOutput] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  //const [parseTree, setParseTree] = useState(null); //  Parse Tree state
  const outputRef = useRef(null);

  const handleRun = async () => {
    setLoading(true);
    setOutput("");
    setIsError(false);
   // setParseTree(null); //  Reset parse tree before each run

    try {
      const response = await fetch("http://localhost:5000/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      setIsError(data.type === "error");
      setOutput(data.output || "No output");

     // const tree = extractParseTreeFromOutput(data.output); //  Get tree from output
      //setParseTree(tree);

      if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      }
    } catch (error) {
      setOutput("❌ Network Error: Could not reach compiler");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="app">
    <h1 className="split-title">Marvels Compiler</h1>

    {/* Top section: Code and Output in split pane */}
    <div style={{ height: "60vh" }}>
      <SplitPane split="vertical" minSize={300} defaultSize="50%">
        {/* Code Editor */}
        <div className="pane editor-pane">
          <div className="pane-header">📝 Write your code</div>
          <textarea value={code} onChange={(e) => setCode(e.target.value)}
            className="editor"
            spellCheck="false"
            placeholder="Enter your code here..."
          />
          <button
            className={`run-btn ${loading ? "loading" : ""}`}
            onClick={handleRun}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span> Compiling...
              </>
            ) : (
              "Run Code"
            )}
          </button>
        </div>

        {/* Output */}
        <div className="pane output-pane">
          <div className="pane-header">📤 Output</div>
          <div
            ref={outputRef}
            className={`output-box ${isError ? "error" : "success"}`}
          >
            {output || (
              <span className="placeholder">Output will appear here...</span>
            )}
          </div>
        </div>
      </SplitPane>
    </div>

    {/* Bottom section: Parse Tree */}
    {/* {parseTree && (
      <div style={{ marginTop: "20px", padding: "0 20px 30px" }}>
     
      </div>
    )}*/}
  </div>
);

}

export default App;