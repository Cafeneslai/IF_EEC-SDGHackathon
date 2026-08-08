from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import ollama

app = FastAPI(title="EEC GoFlow AI Service")

class TripRequest(BaseModel):
    days: int
    budget: str
    travel_style: list[str]
    province: str
    travelers: int = 2
    age: str = "20-30"
    available_locations: str = None
    weather_context: str = None

@app.get("/")
def read_root():
    return {"message": "Welcome to EEC GoFlow AI Service"}

@app.post("/generate-plan")
def generate_plan(request: TripRequest):
    # Prompt for Ollama to generate itinerary
    context_msg = f"\nสำคัญมาก: กรุณาเลือกสถานที่จากรายการนี้เท่านั้นหากเป็นไปได้: {request.available_locations}" if request.available_locations else ""
    weather_msg = f"\nข้อมูลสภาพอากาศปัจจุบัน: {request.weather_context}\nคำแนะนำ: กรุณาปรับเปลี่ยนแผนให้เหมาะสมกับสภาพอากาศและฤดูกาล เช่น หากมีฝนตกให้เน้นสถานที่ในร่ม (คาเฟ่, พิพิธภัณฑ์)" if request.weather_context else ""
    
    prompt = f"""
    คุณคือผู้เชี่ยวชาญด้านการท่องเที่ยวในเขต EEC (ชลบุรี, ระยอง, ฉะเชิงเทรา)
    กรุณาจัดทริปท่องเที่ยว {request.days} วันในจังหวัด {request.province}
    จำนวนผู้เดินทาง: {request.travelers} คน
    ช่วงอายุผู้เดินทาง: {request.age}
    งบประมาณ: {request.budget}
    สไตล์การท่องเที่ยว: {', '.join(request.travel_style)}{context_msg}{weather_msg}
    
    รบกวนประเมินงบประมาณรวมและคะแนนรักษ์โลก (Eco-Score 0-100) ของทริปนี้
    และระบุสถานที่ท่องเที่ยว ร้านอาหาร และคาเฟ่ ในแต่ละช่วงเวลา (เช้า, กลางวัน, บ่าย, เย็น)
    พร้อมแนะนำวิธีการเดินทาง (Eco-Routing) ระหว่างสถานที่ที่ช่วยลดคาร์บอน
    
    **เงื่อนไขสำคัญ (Local Discovery):** ต้องมีสถานที่ที่เป็น "วิสาหกิจชุมชน", "สินค้า OTOP", หรือ "ร้านค้าท้องถิ่น" อย่างน้อย 1 แห่งต่อวัน พร้อมระบุเรื่องราว/อัตลักษณ์ของพื้นที่นั้นใน description เพื่อสร้างคุณค่าให้ชุมชน
    
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
              "description": "คำอธิบายสั้นๆ และอัตลักษณ์ท้องถิ่น",
              "cost_estimate": 200,
              "crowded_level": "สูง / ปานกลาง / ต่ำ",
              "is_otop": true,
              "travel_to_next": {{
                "mode": "EV Bus / เดิน / ขับรถ",
                "duration": "15 นาที",
                "eco_tip": "ข้อแนะนำรักษ์โลก"
              }}
            }}
          ]
        }}
      ]
    }}
    ตอบกลับเฉพาะ JSON เท่านั้น ห้ามมีข้อความอื่น
    """
    
    max_retries = 3
    for attempt in range(max_retries):
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
        except json.JSONDecodeError as e:
            if attempt == max_retries - 1:
                raise HTTPException(status_code=500, detail=f"Ollama Error: {str(e)} \n(ลองใหม่ 3 ครั้งแล้ว กรุณากดปุ่มสร้างใหม่)")
            print(f"JSON Parse Error attempt {attempt+1}: {e}")
            continue
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
    คุณคือผู้เชี่ยวชาญด้านการท่องเที่ยวในเขต EEC (ชลบุรี, ระยอง, ฉะเชิงเทรา)
    ผู้ใช้ต้องการเปลี่ยนสถานที่ท่องเที่ยวช่วง "{request.time}" 
    สถานที่เดิมคือ "{request.current_place}" ในจังหวัด "{request.province}"
    เหตุผล: ผู้ใช้ต้องการ Smart Alternative เนื่องจากสถานที่เดิมคนอาจจะเยอะไป หรือไม่ถูกใจ
    
    {context_msg}
    กรุณาแนะนำสถานที่ใหม่ที่อยู่ในจังหวัดเดียวกัน และอยู่ในช่วงเวลาเดียวกัน
    โดยพิจารณาว่าเป็นสถานที่ที่คนไม่หนาแน่น (Smart Alternative) หรือเป็นสินค้า OTOP/วิสาหกิจชุมชน (Local Discovery) จะดีมาก
    
    จัดเรียงให้อยู่ในรูปแบบ JSON โดยมี โครงสร้างดังนี้:
    {{
      "place": {{
        "time": "{request.time}", 
        "location": "ชื่อสถานที่ใหม่", 
        "type": "ประเภทสถานที่", 
        "description": "คำอธิบายสั้นๆ และอัตลักษณ์ท้องถิ่น",
        "crowded_level": "ต่ำ",
        "is_otop": true
      }}
    }}
    ตอบกลับเฉพาะ JSON เท่านั้น ห้ามมีข้อความอื่น
    """
    
    max_retries = 3
    for attempt in range(max_retries):
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
                
            import json
            # Check if it parses
            parsed = json.loads(clean_content)
            return {"place": json.dumps(parsed)}
        except json.JSONDecodeError as e:
            if attempt == max_retries - 1:
                raise HTTPException(status_code=500, detail=f"Ollama Error: {str(e)} (ลองใหม่ 3 ครั้งแล้ว)")
            continue
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Ollama Error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
