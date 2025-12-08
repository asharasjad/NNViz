import React from 'react';

const ExplanationPanel = ({ selected, data }) => {
    if (!selected) {
        return (
            <div className="card" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p>Click on a node in the diagram to explore its calculation.</p>
            </div>
        );
    }

    // Helper to format numbers usually to 2 decimal places
    const f = (n) => n?.toFixed(3);

    const getContent = () => {
        switch (selected.type) {
            case 'input':
                return (
                    <div>
                        <h3>Input Node</h3>
                        <p>This is the entry point of data into the network.</p>
                        <div className="math-block">
                            Input = {f(data.input)}
                        </div>
                    </div>
                );

            case 'hidden':
                const idx = selected.index;
                const weights = data.weights.w1; // [w_to_h1, w_to_h2] ... wait, w1 is usually sized [Hidden x Input] in matrix form.
                // In our simple model:
                // h1 depends on input * w1[0] + b1[0]
                // h2 depends on input * w1[1] + b1[1]

                const w = weights[idx];
                const b = data.biases.b1[idx];
                const rawSum = (data.input * w) + b;
                const activated = data.hidden[idx];

                return (
                    <div>
                        <h3>Hidden Neuron {idx + 1}</h3>
                        <p>Calculates a weighted sum of the input and passes it through the Sigmoid activation function.</p>

                        <p className="font-heading" style={{ fontSize: '0.9rem', marginTop: '1rem' }}>1. Weighted Sum (z)</p>
                        <div className="math-block">
                            z = ({f(data.input)} × {f(w)}) + {f(b)} <br />
                            z = {f(rawSum)}
                        </div>

                        <p className="font-heading" style={{ fontSize: '0.9rem', marginTop: '1rem' }}>2. Activation (Sigmoid)</p>
                        <div className="math-block">
                            a = σ({f(rawSum)}) <br />
                            a = 1 / (1 + e<sup>-{f(rawSum)}</sup>) <br />
                            a = <strong>{f(activated)}</strong>
                        </div>
                    </div>
                );

            case 'output':
                // Output depends on h1 and h2
                // o_in = (h1 * w2[0]) + (h2 * w2[1]) + b2[0]
                const h1 = data.hidden[0];
                const h2 = data.hidden[1];
                const w_h1 = data.weights.w2[0];
                const w_h2 = data.weights.w2[1];
                const b_out = data.biases.b2[0];
                // Reverse calculate sum before activation
                // We can just reconstruct it for display
                const sum = (h1 * w_h1) + (h2 * w_h2) + b_out;

                return (
                    <div>
                        <h3>Output Node</h3>
                        <p>Aggregates signals from the hidden layer to produce the final prediction.</p>

                        <p className="font-heading" style={{ fontSize: '0.9rem', marginTop: '1rem' }}>1. Weighted Sum</p>
                        <div className="math-block">
                            ({f(h1)} × {f(w_h1)}) <br />
                            + ({f(h2)} × {f(w_h2)}) <br />
                            + {f(b_out)} (bias) <br />
                            = {f(sum)}
                        </div>

                        <p className="font-heading" style={{ fontSize: '0.9rem', marginTop: '1rem' }}>2. Final Activation</p>
                        <div className="math-block">
                            Output = σ({f(sum)}) <br />
                            Output = <strong>{f(data.output)}</strong>
                        </div>
                    </div>
                );

            default:
                return <p>Select a node.</p>;
        }
    };

    return (
        <div className="card">
            <div style={{ borderBottom: '1px solid var(--border-color)', marginBottom: '1rem', paddingBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)' }}>
                    Component Analysis
                </span>
            </div>
            {getContent()}
        </div>
    );
};

export default ExplanationPanel;
