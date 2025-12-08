import { useState, useMemo } from 'react'
import { MLPModel } from './MLPModel'
import NetworkGraph from './NetworkGraph'
import RichDetailPanel from './RichDetailPanel'

function SimpleMLP() {
    const [inputValue, setInputValue] = useState(0.5);
    const [model] = useState(() => new MLPModel());
    const [runId, setRunId] = useState(0);
    const [selectedNode, setSelectedNode] = useState(null);

    const handleRandomize = () => {
        model.randomize();
        setRunId(prev => prev + 1);
    };

    const data = useMemo(() => model.forward(inputValue), [inputValue, runId]);

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {/* Background visualization */}
            <NetworkGraph
                data={data}
                onSelectNode={setSelectedNode}
                selectedNodeId={selectedNode?.id}
            />

            {/* Floating Controls (Bottom) */}
            <div className="overlay-controls">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>INPUT: {inputValue.toFixed(2)}</span>
                    <input
                        type="range"
                        min="-2"
                        max="2"
                        step="0.05"
                        value={inputValue}
                        onChange={e => setInputValue(parseFloat(e.target.value))}
                    />
                </div>
                <div style={{ width: '1px', background: '#333' }}></div>
                <button className="btn" style={{ border: 'none', padding: '0' }} onClick={handleRandomize}>
                    Randomize
                </button>
            </div>

            {/* Rich Detail Panel (SideDock) */}
            {selectedNode && (
                <div style={{
                    position: 'absolute',
                    right: '2rem',
                    top: '2rem',
                    bottom: '2rem',
                    zIndex: 200,
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <RichDetailPanel
                        selected={selectedNode}
                        data={data}
                        onClose={() => setSelectedNode(null)}
                    />
                </div>
            )}
        </div>
    )
}

export default SimpleMLP
