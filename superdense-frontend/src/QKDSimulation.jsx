import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Particles from './Particles';
import HoloToggle from './HoloToggle';
import config from './config';
import './QKDSimulation.css';

export default function QKDSimulation() {
  const navigate = useNavigate();
  const [numPairs, setNumPairs] = useState(50);   // E91 uses entangled pairs
  const [simulateEve, setSimulateEve] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const runQKD = async (eveFlag) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    try {
      const response = await fetch(`${config.application.baseURL}${config.application.endpoints.qkdSimulation}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ num_pairs: numPairs, eve: eveFlag }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('QKD Backend Response:', data); // Debug log
        setResults(data);
        if (!data.secure) {
          setError('⚠ E91 key compromised! Eve is present. Generate another key.');
        }
      } else {
        setError(data.error || 'Failed to run QKD simulation');
      }
    } catch {
      setError('Network error: Unable to connect to backend');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunQKD = async () => runQKD(simulateEve);

  const handleGenerateSecureKey = async () => {
    setSimulateEve(false);
    await runQKD(false);
  };

  const handleProceedToSuperdense = () => {
    if (results) {
      // Store QKD key in localStorage for use in FullSimulation
      localStorage.setItem('qkdKey', results.qkd_key);
      localStorage.setItem('qkdSecure', results.secure);
      localStorage.setItem('qkdEvePresent', simulateEve);
      
      navigate('/aircraft-navigation', {
        state: {
          qkdKey: results.qkd_key,
          qkdSecure: results.secure,
          sdcEve: simulateEve,
        },
      });
    }
  };

  // Histogram for Alice-Bob bit matches based on entangled pairs
  const histogramData =
    results?.entangled_pairs?.reduce(
      (acc, pair) => {
        const key = pair.correlated ? 'Anti-correlated' : 'Correlated';
        const existing = acc.find((item) => item.name === key);
        if (existing) existing.value += 1;
        else acc.push({ name: key, value: 1 });
        return acc;
      },
      []
    ) || [];

  const blochPairs = results?.bloch_spheres?.slice(0, 2) || [];

  return (
    <>
      <Particles
        particleCount={600}
        particleSpread={20}
        speed={0.4}
        particleColors={['#667eea', '#764ba2', '#f093fb', '#22d3ee', '#a855f7', '#06b6d4', '#ff6b6b', '#4ecdc4']}
        moveParticlesOnHover
        particleHoverFactor={4}
        alphaParticles={false}
        particleBaseSize={120}
        sizeRandomness={1.2}
        cameraDistance={15}
      />

      <div className="qkd-page">
        <motion.div
          className="qkd-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <header className="qkd-header">
            <motion.h1
              className="qkd-title"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Quantum Key Distribution (E91 Protocol)
            </motion.h1>
            <motion.p
              className="qkd-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Generate a secure quantum key using the E91 protocol. Ground station and
              Satellite share entangled photon pairs to establish a shared secret key.
            </motion.p>
          </header>

          {/* Controls */}
          <motion.div
            className="controls-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="control-group">
              <label className="control-label">Number of Pairs:</label>
              <select
                value={numPairs}
                onChange={(e) => setNumPairs(parseInt(e.target.value))}
                className="control-select"
              >
                <option value={10}>10</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <div className="control-group">
              <label className="control-label">Simulate Eve:</label>
              <HoloToggle checked={simulateEve} onChange={setSimulateEve} labelOn="Yes" labelOff="No" />
            </div>
            <button className="run-qkd-button" onClick={handleRunQKD} disabled={isLoading}>
              {isLoading ? 'Running E91 QKD...' : 'Run QKD'}
            </button>
          </motion.div>

          {/* Error */}
          {error && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              ❌ {error}
            </motion.div>
          )}

          {/* Results */}
          {results && (
            <motion.div
              className="results-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="results-title">QKD Results</h2>

              <div className="results-grid">
                {/* QKD Key */}
                <div className="result-card">
                  <h3>QKD Key</h3>
                  <div className="key-display">
                    {results.qkd_key.split('').map((bit, i) => (
                      <span key={i} className="key-bit">
                        {bit}
                      </span>
                    ))}
                  </div>
                  <p className="key-length">Length: {results.qkd_key.length} bits</p>
                </div>

                {/* QBER */}
                <div className="result-card">
                  <h3>Quantum Bit Error Rate (QBER)</h3>
                  <div className="qber-display">
                    <div className="qber-bar">
                      <div
                        className="qber-fill"
                        style={{ width: `${results.qber_percentage || (results.qber * 100)}%` }}
                      ></div>
                    </div>
                    <span className="qber-value">{results.qber_percentage ? results.qber_percentage.toFixed(2) : (results.qber * 100).toFixed(2)}%</span>
                  </div>
                  <p className="qber-status">
                    {results.secure ? '✅ Secure' : '⚠ Insecure'}
                  </p>
                </div>

                {/* Statistics */}
                <div className="result-card">
                  <h3>Statistics</h3>
                  <div className="stats-list">
                    <div className="stat-item">
                      <span className="stat-label">Total Pairs:</span>{' '}
                      <span className="stat-value">{numPairs}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Sifted Bits:</span>{' '}
                      <span className="stat-value">{results.sifted_bits_count || 0}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Eve Present:</span>{' '}
                      <span className="stat-value">{simulateEve ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">QKD Secure:</span>{' '}
                      <span className="stat-value">{results.secure ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alice vs Bob Table */}
              {results.alice_measurements && results.bob_measurements && (
                <div className="comparison-section">
                  <h3>Satellite vs Ground Station – First 10 Pairs</h3>
                  <div className="table-container">
                    <table className="comparison-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Satellite Basis</th>
                          <th>Satellite Bit</th>
                          <th>Ground Basis</th>
                          <th>Ground Bit</th>
                          <th>Basis Match</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.alice_measurements.slice(0, 10).map((aliceMeasurement, i) => {
                          const bobMeasurement = results.bob_measurements[i];
                          return (
                            <tr key={i}>
                              <td>{i + 1}</td>
                              <td>{aliceMeasurement.basis}</td>
                              <td>{aliceMeasurement.bit}</td>
                              <td>{bobMeasurement.basis}</td>
                              <td>{bobMeasurement.bit}</td>
                              <td
                                className={
                                  aliceMeasurement.basis === bobMeasurement.basis ? 'match-yes' : 'match-no'
                                }
                              >
                                {aliceMeasurement.basis === bobMeasurement.basis ? '✓' : '✗'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Circuit */}
              {results.circuit_image && (
                <div className="circuit-section">
                  <h3>Quantum Circuit</h3>
                  <img
                    src={`data:image/png;base64,${results.circuit_image}`}
                    alt="Quantum Circuit"
                    className="circuit-image"
                  />
                </div>
              )}

              {/* Histogram */}
              {histogramData.length > 0 && (
                <div className="histogram-section">
                  <h3>Satellite-Ground Matching Histogram</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={histogramData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#667eea" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Bloch Spheres */}
              {blochPairs.length > 0 && (
                <div className="bloch-section">
                  <h3>Bloch Spheres (First 2 Pairs)</h3>
                  <div className="bloch-gallery">
                    {blochPairs.map((pair, index) => (
                      <div className="bloch-pair" key={index}>
                        <div className="bloch-item">
                          <img
                            src={`data:image/png;base64,${pair.alice}`}
                            alt={`Alice Qubit ${index + 1}`}
                          />
                          <p className="bloch-label">Alice Qubit {index + 1}</p>
                        </div>
                        <div className="bloch-item">
                          <img
                            src={`data:image/png;base64,${pair.bob}`}
                            alt={`Bob Qubit ${index + 1}`}
                          />
                          <p className="bloch-label">Bob Qubit {index + 1}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Regenerate if insecure */}
              {!results.secure && (
                <div className="proceed-section">
                  <button className="run-qkd-button" onClick={handleGenerateSecureKey} disabled={isLoading}>
                    Generate Another Key
                  </button>
                </div>
              )}

              {/* SuperDense Coding Button */}
              <div className="proceed-section" style={{ marginTop: '30px', textAlign: 'center' }}>
                <button 
                  className="run-qkd-button" 
                  onClick={handleProceedToSuperdense}
                  style={{
                    background: 'linear-gradient(45deg, #4f46e5, #7c3aed)',
                    color: 'white',
                    padding: '12px 24px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    margin: '20px auto',
                    display: 'block',
                    maxWidth: '300px',
                    width: '100%'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  Proceed to SuperDense Coding
                </button>
              </div>
            </motion.div>
          )}

          {/* Back */}
          <div className="navigation-section">
            <button onClick={() => navigate('/home')} className="back-button">
              ← Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
