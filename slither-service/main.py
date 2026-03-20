import os
import json
import tempfile
import subprocess
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

app = FastAPI()
security = HTTPBearer()

API_KEY = os.environ.get("SLITHER_API_KEY", "")


def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials.credentials != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")


class AnalyzeRequest(BaseModel):
    source_code: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/analyze")
def analyze(req: AnalyzeRequest, _=Depends(verify_token)):
    if not req.source_code.strip():
        raise HTTPException(status_code=400, detail="Empty source code")

    with tempfile.NamedTemporaryFile(suffix=".sol", mode="w", delete=False) as f:
        f.write(req.source_code)
        tmp_path = f.name

    try:
        result = subprocess.run(
            ["slither", tmp_path, "--json", "-"],
            capture_output=True,
            text=True,
            timeout=30,
        )

        # Slither outputs JSON to stdout when using --json -
        try:
            output = json.loads(result.stdout)
            detectors = output.get("results", {}).get("detectors", [])
        except json.JSONDecodeError:
            detectors = []

        findings = []
        for d in detectors:
            findings.append(
                {
                    "check": d.get("check", "unknown"),
                    "description": d.get("description", ""),
                    "impact": d.get("impact", "informational"),
                    "confidence": d.get("confidence", "medium"),
                    "first_markdown_element": d.get("first_markdown_element", ""),
                }
            )

        return {"findings": findings}

    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=504, detail="Analysis timed out")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        os.unlink(tmp_path)
