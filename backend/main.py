from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import io
import os
from PIL import Image
import torch
from torchvision import transforms

# Import our custom ML capabilities
import ml_engine

app = FastAPI(
    title="Facial Recognition Backend with Firefly Algorithm",
    description="A professional API serving a deep Q-network reinforced by swarm intelligence algorithms.",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev it's fine, in prod restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount frontend directory for static serving
frontend_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
if os.path.exists(frontend_path):
    app.mount("/static", StaticFiles(directory=frontend_path), name="static")

MODEL_PATH = "dqn_model.pth"

class TrainingResponse(BaseModel):
    status: str
    message: str

class PredictResponse(BaseModel):
    status: str
    action_raw: int
    decision: str
    message: str

@app.get("/")
def read_root():
    # Serve index.html if it exists, else return fallback message
    index_file = os.path.join(frontend_path, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {"message": "Welcome to the Firefly Facial Recognition API"}

@app.post("/api/train", response_model=TrainingResponse)
async def train_model_endpoint(background_tasks: BackgroundTasks):
    """
    Trigger the DQN and Firefly RL training in the background.
    """
    def train_task():
        ml_engine.train_model(save_path=MODEL_PATH, episodes=10) # 10 episodes for quick demo purposes
        print("Background training completed successfully.")

    background_tasks.add_task(train_task)
    return TrainingResponse(status="success", message="Training task has been queued in the background.")

@app.post("/api/predict", response_model=PredictResponse)
async def predict_image(file: UploadFile = File(...)):
    """
    Takes an uploaded image, transforms it to 64x64 grayscale, 
    and asks the Firefly-Optimized DQN model to accept or reject it.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")

    try:
        # Read the image bytes mapping to PIL
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # Apply the exact transformations the model expects
        tensor = ml_engine.transform(image)
        
        # Make the prediction
        action = ml_engine.predict(tensor, model_path=MODEL_PATH)
        
        # 1 = Accept, 0 = Reject (based on action space mapping)
        decision = "ACCEPTED" if action == 1 else "REJECTED"
        
        return PredictResponse(
            status="success",
            action_raw=action,
            decision=decision,
            message=f"Model evaluated the facial features and determined: {decision}."
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
