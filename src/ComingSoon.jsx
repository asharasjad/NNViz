import React from 'react';

const ComingSoon = ({ title }) => {
    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#444'
        }}>
            <h2 style={{ fontSize: '4rem', margin: 0, opacity: 0.1, fontWeight: 900 }}>{title}</h2>
            <p style={{ letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '1rem', color: '#666' }}>
                Visualization Coming Soon
            </p>
        </div>
    );
};

export default ComingSoon;
