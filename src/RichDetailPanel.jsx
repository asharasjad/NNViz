import React from 'react';

// Simple SVG Sigmoid Plot
const SigmoidPlot = ({ z, a }) => {
    const width = 200;
    const height = 100;
    // Map x: [-6, 6] -> [0, width]
    // Map y: [0, 1] -> [height, 0]

    const xScale = (val) => ((val + 6) / 12) * width;
    const yScale = (val) => height - (val * height);

    // Generating path
    let pathD = "M 0 " + yScale(1 / (1 + Math.exp(6)));
    for (let i = -6; i <= 6; i += 0.5) {
        pathD += ` L ${xScale(i)} ${yScale(1 / (1 + Math.exp(-i)))}`;
    }

    const focusX = xScale(Math.max(-6, Math.min(6, z)));
    const focusY = yScale(a);

    return (
        <div style={{ margin: '1rem 0' }}>
            <p style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.5rem', textAlign: 'center' }}>
                ACTIVATION FUNCTION (SIGMOID)
            </p>
            <svg width={width} height={height} style={{ overflow: 'visible', borderLeft: '1px solid #444', borderBottom: '1px solid #444' }}>
                {/* Axis Lines */}
                <line x1={0} y1={yScale(0.5)} x2={width} y2={yScale(0.5)} stroke="#333" strokeDasharray="4,4" />
                <line x1={xScale(0)} y1={0} x2={xScale(0)} y2={height} stroke="#333" strokeDasharray="4,4" />

                <path d={pathD} fill="none" stroke="#666" strokeWidth="2" />

                {/* Selected Point */}
                <circle cx={focusX} cy={focusY} r={6} fill="#fff" />
                <text x={focusX} y={focusY - 10} fill="#fff" fontSize="10" textAnchor="middle">
                    {z.toFixed(2)}
                </text>
            </svg>
        </div>
    );
};

const RichDetailPanel = ({ selected, data, onClose }) => {
    if (!selected) return null;
    const f = (n) => n?.toFixed(3);

    let content = null;

    if (selected.type === 'hidden') {
        const idx = selected.index;
        const w = data.weights.w1[idx];
        const b = data.biases.b1[idx];
        const inputVal = data.input;
        const weightedSum = inputVal * w;
        const z = weightedSum + b;
        const a = data.hidden[idx];

        // Bar chart data for contribution
        // Components: Weighted Input, Bias
        const maxVal = Math.max(Math.abs(weightedSum), Math.abs(b), 1); // Normalize
        const scale = (v) => (Math.abs(v) / maxVal) * 100; // Percentage

        content = (
            <div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Neuron Logic</h3>

                {/* Contribution Bars */}
                <div style={{ marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem' }}>CONTRIBUTION BREAKDOWN</p>

                    {/* Weighted Input Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                        <div style={{ width: '80px' }}>Input × W</div>
                        <div style={{ flex: 1, height: '8px', background: '#333', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{
                                width: `${scale(weightedSum)}%`,
                                height: '100%',
                                background: weightedSum > 0 ? '#fff' : '#ff4444'
                            }}></div>
                        </div>
                        <div style={{ width: '40px', textAlign: 'right' }}>{f(weightedSum)}</div>
                    </div>

                    {/* Bias Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.85rem' }}>
                        <div style={{ width: '80px' }}>Bias</div>
                        <div style={{ flex: 1, height: '8px', background: '#333', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{
                                width: `${scale(b)}%`,
                                height: '100%',
                                background: b > 0 ? '#fff' : '#ff4444'
                            }}></div>
                        </div>
                        <div style={{ width: '40px', textAlign: 'right' }}>{f(b)}</div>
                    </div>
                </div>

                <div style={{ textAlign: 'center', padding: '0.5rem', background: '#111', borderRadius: '8px', margin: '1rem 0' }}>
                    Total Sum (z) = <strong>{f(z)}</strong>
                </div>

                <SigmoidPlot z={z} a={a} />

                <div style={{ textAlign: 'center' }}>
                    Final Output (a) = <strong>{f(a)}</strong>
                </div>
            </div>
        );
    } else {
        // Basics for Input/Output
        content = (
            <div>
                <h3>{selected.label}</h3>
                <p style={{ fontSize: '2rem', fontWeight: '300', margin: '1rem 0' }}>{f(selected.val)}</p>
                <p style={{ color: '#888' }}>Current activation value.</p>
            </div>
        );
    }

    return (
        <div className="rich-panel">
            <button className="rich-close-btn" onClick={onClose}>&times;</button>
            {content}
        </div>
    );
};

export default RichDetailPanel;
