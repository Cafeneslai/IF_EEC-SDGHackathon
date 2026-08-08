from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import ollama

app = FastAPI(title="EEC GoFlow AI Service")

class TripRequest(BaseModel):
    days: int
    budget: str
    travel_style: list[str]
    province: str
    available_locations: str = None

@app.get("/")
def read_root():
    return {"message": "Welcome to EEC GoFlow AI Service"}

@app.post("/generate-plan")
def generate_plan(request: TripRequest):
    # Prompt for Ollama to generate itinerary
    context_msg = f"\nสำคัญมาก: กรุณาเลือกสถานที่จากรายการนี้เท่านั้นหากเป็นไปได้: {request.available_locations}" if request.available_locations else ""
    
    prompt = f"""
    คุณคือผู้เชี่ยวชาญด้านการท่องเที่ยวในเขต EEC (ชลบุรี, ระยอง, ฉะเชิงเทรา)
    กรุณาจัดทริปท่องเที่ยว {request.days} วันในจังหวัด {request.province}
    งบประมาณ: {request.budget}
    สไตล์การท่องเที่ยว: {', '.join(request.travel_style)}{context_msg}
    
    รบกวนประเมินงบประมาณรวมและคะแนนรักษ์โลก (Eco-Score 0-100) ของทริปนี้
    และระบุสถานที่ท่องเที่ยว ร้านอาหาร และคาเฟ่ ในแต่ละช่วงเวลา (เช้า, กลางวัน, บ่าย, เย็น)
    พร้อมแนะนำวิธีการเดินทาง (Eco-Routing) ระหว่างสถานที่ที่ช่วยลดคาร์บอน
    
    จัดเรียงให้อยู่ในรูปแบบ JSON โดยมีโครงสร้างดังนี้:
    {{
      "summary": {{
        "total_budget_estimate": 1500,
        "eco_score_percentage": 85,
        "theme": "ชื่อธีมของทริป"
      }},
      "plan": [
        {{
          "day": 1,
          "itinerary": [
            {{
              "time": "เช้า", 
              "location": "ชื่อสถานที่", 
              "type": "ประเภทสถานที่", 
              "description": "คำอธิบายสั้นๆ",
              "cost_estimate": 200,
              "travel_to_next": {{
                "mode": "EV Bus / เดิน / ขับรถ",
                "duration": "15 นาที"
              }}
            }}
          ]
        }}
      ]
    }}
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
        
        # สกัดหา JSON object อย่างเดียว
        start_idx = clean_content.find('{')
        end_idx = clean_content.rfind('}')
        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            clean_content = clean_content[start_idx:end_idx+1]
            
        import json
        return json.loads(clean_content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ollama Error: {str(e)}")

class RegenerateRequest(BaseModel):
    province: str
    current_place: str
    time: str
    available_locations: str = None

@app.post("/regenerate-place")
def regenerate_place(request: RegenerateRequest):
    import json
    context_msg = f"\nสถานที่ที่มีในระบบ: {request.available_locations}" if request.available_locations else ""
    prompt = f"""
    ผู้ใช้ต้องการเปลี่ยนสถานที่ท่องเที่ยวจาก "{request.current_place}" ในช่วงเวลา "{request.time}" ที่จังหวัด {request.province}
    กรุณาแนะนำสถานที่ใหม่ที่เหมาะสมกับช่วงเวลานี้ และต้องไม่ใช่สถานที่เดิม
    {context_msg}
    
    กรุณาตอบกลับเป็น JSON เท่านั้น โครงสร้างดังนี้:
    {{
       "time": "{request.time}",
       "location": "ชื่อสถานที่ใหม่",
       "type": "ประเภทสถานที่",
       "description": "คำอธิบายสั้นๆ"
    }}
    ตอบกลับเฉพาะ JSON เท่านั้น ห้ามมีข้อความอื่น
    """
    
    try:
        response = ollama.chat(model='llama3.1', messages=[
            {'role': 'user', 'content': prompt}
        ])
        
        raw_content = response['message']['content']
        clean_content = raw_content.replace('```json', '').replace('```', '').strip()
        
        start_idx = clean_content.find('{')
        end_idx = clean_content.rfind('}')
        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            clean_content = clean_content[start_idx:end_idx+1]
            
        return {"place": clean_content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ollama Error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
