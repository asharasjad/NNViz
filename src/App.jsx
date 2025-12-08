import { useState } from 'react'
import SimpleMLP from './SimpleMLP'
import ComingSoon from './ComingSoon'
import './index.css'

function App() {
    const [activeTab, setActiveTab] = useState('simple');

    const tabs = [
        { id: 'simple', label: 'Simple MLP' },
        { id: 'deep', label: 'Deep MLP' },
        { id: 'cnn', label: 'CNN' },
        { id: 'rnn', label: 'RNN' },
        { id: 'transformer', label: 'Transformer' }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'simple': return <SimpleMLP />;
            case 'deep': return <ComingSoon title="DEEP MLP" />;
            case 'cnn': return <ComingSoon title="CNN" />;
            case 'rnn': return <ComingSoon title="RNN" />;
            case 'transformer': return <ComingSoon title="TRANSFORMER" />;
            default: return <SimpleMLP />;
        }
    };

    return (
        <div className="app-shell">
            <header className="main-header">
                <div className="logo">Neural Viz</div>
                <nav className="tab-nav">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </header>

            <main className="main-content">
                {renderContent()}
            </main>
        </div>
    )
}

export default App
