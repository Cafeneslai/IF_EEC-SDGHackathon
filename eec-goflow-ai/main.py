from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import ollama

app = FastAPI(title="EEC GoFlow AI Service")

class TripRequest(BaseModel):
    days: int
    budget: str
    travel_style: list[str]
    province: str

@app.get("/")
def read_root():
    return {"message": "Welcome to EEC GoFlow AI Service"}

@app.post("/generate-plan")
def generate_plan(request: TripRequest):
    # Prompt for Ollama to generate itinerary
    prompt = f"""
    คุณคือผู้เชี่ยวชาญด้านการท่องเที่ยวในเขต EEC (ชลบุรี, ระยอง, ฉะเชิงเทรา)
    กรุณาจัดทริปท่องเที่ยว {request.days} วันในจังหวัด {request.province}
    งบประมาณ: {request.budget}
    สไตล์การท่องเที่ยว: {', '.join(request.travel_style)}
    
    รบกวนระบุสถานที่ท่องเที่ยว ร้านอาหาร และคาเฟ่ ในแต่ละช่วงเวลา (เช้า, กลางวัน, บ่าย, เย็น)
    จัดเรียงให้อยู่ในรูปแบบ JSON โดยมี โครงสร้างดังนี้:
    [
      {{
        "day": 1,
        "itinerary": [
           {{"time": "เช้า", "location": "ชื่อสถานที่", "type": "ประเภทสถานที่", "description": "คำอธิบายสั้นๆ"}}
        ]
      }}
    ]
    ตอบกลับเฉพาะ JSON เท่านั้น ห้ามมีข้อความอื่น
    """
    
    try:
        # Note: เราใช้ 'llama3.1' ตามที่มีในเครื่อง
        response = ollama.chat(model='llama3.1', messages=[
            {
                'role': 'user',
                'content': prompt
            }
        ])
        
        raw_content = response['message']['content']
        
        # ลบ markdown code block
        clean_content = raw_content.replace('```json', '').replace('```', '').strip()
        
        # สกัดหา JSON array อย่างเดียว (เอาตั้งแต่ [ ตัวแรก ถึง ] ตัวสุดท้าย)
        start_idx = clean_content.find('[')
        end_idx = clean_content.rfind(']')
        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            clean_content = clean_content[start_idx:end_idx+1]
            
        return {"plan": clean_content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ollama Error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
