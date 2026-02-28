
This project implements a facial recognition system using a Deep Q-Network (DQN) optimized with the Firefly Algorithm. The system is built with FastAPI and a modern web interface.

## Features

- **Deep Q-Network (DQN)**: A neural network-based reinforcement learning agent for decision making.
- **Firefly Algorithm**: Optimizes the DQN model for better performance.
- **FastAPI Backend**: High-performance API for handling image processing and model predictions.
- **Modern UI**: A responsive web interface for easy interaction.

## Prerequisites

- Python 3.8+
- pip

## Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd Facial-Recognition-System-With-Firefly-Algorithm
    ```

2.  **Create and activate a virtual environment**
    ```bash
    python -m venv .venv

    # Windows
    .venv\Scripts\activate
    
    # macOS/Linux
    source .venv/bin/activate
    ```

3.  **Install dependencies**
    ```bash
    pip install -r backend/requirements.txt
    ```

## Usage

### Running the Server

Start the FastAPI server using uvicorn:

```bash
uvicorn backend.main:app --reload
```

The server will start at `http://localhost:8000`.

### Accessing the UI

Open your browser and navigate to:

- **Main Interface**: `http://localhost:8000`
- **Swagger UI (API Docs)**: `http://localhost:8000/docs`

### Training the Model

1.  Go to the **Admin Panel** on the UI.
2.  Click **"Train Model"**.
3.  The model will train in the background, and you can monitor the logs.

### Making Predictions

1.  Upload an image using the **Drop Zone**.
2.  Click **"Analyze Image"**.
3.  The model will process the image and display the result (Accepted or Rejected).

## Project Structure

```
Facial-Recognition-System-With-Firefly-Algorithm/
├── backend/                  # FastAPI backend
│   ├── main.py               # API entry point
│   ├── ml_engine.py          # ML logic (DQN + Firefly)
│   └── dqn_model.pth         # Trained model (if exists)
├── frontend/                 # Web interface
│   ├── index.html            # Main page
│   ├── style.css             # Styles
│   └── script.js             # Frontend logic
└── requirements.txt          # Dependencies
```

## Technologies Used

- **Backend**: FastAPI, Uvicorn, PyTorch, Torchvision
- **Frontend**: HTML, CSS, JavaScript
- **Algorithms**: Deep Q-Network, Firefly Algorithm
