# Satellite-Ground Secure Communication Simulator

A comprehensive quantum computing simulator that demonstrates Quantum Key Distribution (QKD) and Superdense Coding protocols for secure satellite-ground communication.

## 🌟 Features

- **Dual Backend System**: Separate testing and application phases
- **QKD Simulation**: BB84 protocol implementation with Eve detection
- **Superdense Coding**: 2-bit message transmission using entangled qubits
- **Full End-to-End Simulation**: Complete satellite-ground communication flow
- **Interactive UI**: Modern React frontend with real-time visualizations
- **Quantum Visualizations**: Circuit diagrams, Bloch spheres, and density matrices

## 🏗️ Project Structure

```
SuperDensee/
├── superdense-backend/
│   ├── app.py              # Testing Phase Backend (Port 5000)
│   ├── application.py      # Application Phase Backend (Port 5001)
│   └── requirements.txt    # Python Dependencies
├── superdense-frontend/
│   ├── src/
│   │   ├── App.jsx         # Main Router
│   │   ├── NavigationPage.jsx
│   │   ├── QKDSimulation.jsx
│   │   ├── SuperdenseCoding.jsx
│   │   ├── FullSimulation.jsx
│   │   ├── Simulator.jsx   # Testing Phase
│   │   └── config.js       # Backend Configuration
│   ├── package.json        # Node.js Dependencies
│   └── vite.config.js
├── start_backends.bat      # Windows Backend Starter
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** with pip
- **Node.js 16+** with npm
- **Git**

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd superdense-backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   ```bash
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

4. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Start both backends:**
   ```bash
   # Option 1: Use the batch file (Windows)
   start_backends.bat
   
   # Option 2: Manual start (two separate terminals)
   # Terminal 1 - Testing Phase (Port 5000)
   python app.py
   
   # Terminal 2 - Application Phase (Port 5001)
   python application.py
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd superdense-frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:5173
   ```

## 🔧 Backend Configuration

### Testing Phase (`app.py` - Port 5000)
- **Purpose**: Local and IBM Quantum simulations
- **Endpoints**:
  - `POST /api/run_simulation` - Run superdense coding simulation
  - `GET /api/health` - Health check

### Application Phase (`application.py` - Port 5001)
- **Purpose**: Full satellite-ground communication simulator
- **Endpoints**:
  - `POST /qkd` - BB84 QKD simulation
  - `POST /sdc` - Superdense coding simulation
  - `POST /full-simulation` - End-to-end simulation
  - `GET /health` - Health check

## 🎯 Usage Guide

### 1. Navigation
- Visit `http://localhost:5173/navigation`
- Choose between "Testing Phase" and "Application Phase"

### 2. Testing Phase
- **Local Simulation**: Run superdense coding on local quantum simulator
- **IBM Simulation**: Run on IBM Quantum hardware (requires API token)

### 3. Application Phase
- **QKD Simulation**: Generate quantum keys using BB84 protocol
- **Superdense Coding**: Encode and transmit 2-bit messages
- **Full Simulation**: Complete end-to-end communication flow

## 📊 Features by Page

### QKD Simulation
- Select number of qubit pairs (10, 50, 100)
- Toggle Eve presence for security testing
- View QKD key, QBER, and measurement comparisons
- Interactive Bloch sphere visualizations

### Superdense Coding
- Input 2-bit messages (00, 01, 10, 11)
- Real-time encryption using QKD keys
- Circuit diagrams and measurement histograms
- Density matrix visualization

### Full Simulation
- Step-by-step simulation cards
- QKD key generation and validation
- Message encryption and transmission
- Final decryption and verification

## 🛠️ Development

### Backend Development
```bash
cd superdense-backend
# Activate virtual environment
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Install development dependencies
pip install pytest requests

# Run tests
pytest
```

### Frontend Development
```bash
cd superdense-frontend
npm install
npm run dev
npm run build
npm run lint
```

## 🔍 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   netstat -ano | findstr :5000
   netstat -ano | findstr :5001
   
   # Kill the process
   taskkill /PID <process_id> /F
   ```

2. **CORS Errors**
   - Ensure both backends are running
   - Check that CORS is enabled in both Flask apps
   - Verify frontend is connecting to correct backend URLs

3. **Qiskit Import Errors**
   ```bash
   pip install --upgrade qiskit
   pip install --upgrade qiskit-aer
   ```

4. **Frontend Build Issues**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📝 API Documentation

### Testing Phase Endpoints

#### `POST /api/run_simulation`
```json
{
  "message": "01",
  "shots": 1024,
  "backend": "local" | "ibm"
}
```

### Application Phase Endpoints

#### `POST /qkd`
```json
{
  "num_qubits": 50,
  "eve": false
}
```

#### `POST /sdc`
```json
{
  "message": "01",
  "qkd_key": "1010",
  "eve": false
}
```

#### `POST /full-simulation`
```json
{
  "message": "01",
  "num_qubits": 50
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Qiskit Team** for the quantum computing framework
- **IBM Quantum** for providing quantum hardware access
- **React Team** for the frontend framework
- **Vite Team** for the build tool

**Happy Quantum Computing! 🚀**
