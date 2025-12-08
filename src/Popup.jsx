import React from 'react';

const Popup = ({ selected, data, position, onClose }) => {
  if (!selected) return null;

  const f = (n) => n?.toFixed(3);

  // Calculate position style
  // We want it strictly near the click.
  // Add a small offset so it doesn't block the cursor immediately.
  const style = {
    position: 'absolute',
    top: position ? position.y : '50%',
    left: position ? position.x : '50%',
    transform: position ? 'translate(20px, -20px)' : 'translate(-50%, -50%)',
    zIndex: 100
  };

  let content = null;

  if (selected.type === 'input') {
    content = (
      <>
        <div className="popover-header">
          <span className="step-badge">STEP 1</span>
          <h3>Input</h3>
        </div>
        <p>Raw value entering the network.</p>
        <div className="math-row">
          <span>Value</span>
          <strong>{f(data.input)}</strong>
        </div>
      </>
    );
  } else if (selected.type === 'hidden') {
    const idx = selected.index;
    const w = data.weights.w1[idx];
    const b = data.biases.b1[idx];
    const inputVal = data.input;
    const weightedSum = inputVal * w;
    const z = weightedSum + b;

    content = (
      <>
        <div className="popover-header">
          <span className="step-badge">STEP 2</span>
          <h3>Hidden Neuron {idx + 1}</h3>
        </div>

        <p>This neuron receives the input signal, weighs it, adds a bias, and fires.</p>

        <div className="math-section">
          <h4>1. Incoming Connection</h4>
          <div className="math-row">
            <span>Input</span>
            <span>{f(inputVal)}</span>
          </div>
          <div className="math-row">
            <span>× Weight</span>
            <span>{f(w)}</span>
          </div>
          <div className="math-row sum-row">
            <span>Weighted Input</span>
            <span>{f(weightedSum)}</span>
          </div>
        </div>

        <div className="math-section">
          <h4>2. Apply Bias</h4>
          <div className="math-row">
            <span>Weighted Input</span>
            <span>{f(weightedSum)}</span>
          </div>
          <div className="math-row">
            <span>+ Bias</span>
            <span>{f(b)}</span>
          </div>
          <div className="math-row sum-row">
            <span>Result (z)</span>
            <span>{f(z)}</span>
          </div>
        </div>

        <div className="math-section">
          <h4>3. Activate (Sigmoid)</h4>
          <div className="math-formula">
            σ(z) = 1 / (1 + e⁻ᶻ)
          </div>
          <div className="math-row sum-row" style={{ marginTop: '0.5rem' }}>
            <span>Output (a)</span>
            <strong>{f(data.hidden[idx])}</strong>
          </div>
        </div>
      </>
    );
  } else if (selected.type === 'output') {
    content = (
      <>
        <div className="popover-header">
          <span className="step-badge">STEP 3</span>
          <h3>Output</h3>
        </div>
        <p>Aggregating hidden signals.</p>
        <div className="math-row">
          <span>Final Prediction</span>
          <strong>{f(data.output)}</strong>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Invisible backdrop to catch clicks and close */}
      <div
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 99 }}
        onClick={onClose}
      ></div>

      <div className="popover-card" style={style} onClick={e => e.stopPropagation()}>
        {content}
      </div>
    </>
  );
};

export default Popup;
