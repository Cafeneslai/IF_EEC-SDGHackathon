const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // สร้าง User จำลอง (ใช้ upsert กัน error ซ้ำ)
  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      password: "password123",
      name: "Test User",
      age: 25,
      budget_level: "ปานกลาง",
      travel_style: JSON.stringify(["ทะเลพักใจ", "คาเฟ่ถ่ายรูป"]),
      points: 100
    }
  });

  // สร้างสถานที่ท่องเที่ยว (Premium Seed Data for Demo)
  const locations = [
    // ชลบุรี (Chonburi)
    { name: 'จุดชมวิวเขาสามมุข (Khao Sam Muk)', type: 'เที่ยว', lat: 13.3079, lng: 100.9022, province: 'ชลบุรี', popularity_score: 8.5, category_tags: '["nature", "viewpoint", "monkey"]' },
    { name: 'หาดบางแสน (Bang Saen Beach)', type: 'เที่ยว', lat: 13.2843, lng: 100.9135, province: 'ชลบุรี', popularity_score: 9.0, category_tags: '["beach", "chill"]' },
    { name: 'Way Coffee House (คาเฟ่สไตล์ญี่ปุ่นริมทะเล)', type: 'กิน', lat: 13.2988, lng: 100.9088, province: 'ชลบุรี', popularity_score: 9.2, category_tags: '["cafe", "coffee", "beach", "photo"]' },
    { name: 'สถาบันวิทยาศาสตร์ทางทะเล ม.บูรพา (Aquarium)', type: 'เที่ยว', lat: 13.2796, lng: 100.9250, province: 'ชลบุรี', popularity_score: 8.2, category_tags: '["aquarium", "education", "indoor"]' },
    { name: 'วิสาหกิจชุมชนหมู่บ้านอ่างศิลา (ครกหิน & ซีฟู้ด)', type: 'เที่ยว', lat: 13.3323, lng: 100.9197, province: 'ชลบุรี', popularity_score: 8.5, category_tags: '["otop", "culture", "shopping"]' },
    { name: 'ร้านอาหารทะเลป้าแจ๋ว อ่างศิลา (OTOP 5 ดาว)', type: 'กิน', lat: 13.3330, lng: 100.9200, province: 'ชลบุรี', popularity_score: 8.9, category_tags: '["food", "seafood", "otop"]' },
    
    // ระยอง (Rayong)
    { name: 'อุทยานเขาแหลมหญ้า-หมู่เกาะเสม็ด', type: 'เที่ยว', lat: 12.5511, lng: 101.4428, province: 'ระยอง', popularity_score: 9.5, category_tags: '["nature", "sea", "national_park", "camping"]' },
    { name: 'ทุ่งโปรงทอง ปากน้ำประแส', type: 'เที่ยว', lat: 12.7056, lng: 101.7161, province: 'ระยอง', popularity_score: 8.8, category_tags: '["nature", "mangrove", "photo"]' },
    { name: 'วิสาหกิจชุมชนกะปิ-น้ำปลาบ้านเพ', type: 'กิน', lat: 12.6280, lng: 101.4420, province: 'ระยอง', popularity_score: 8.3, category_tags: '["otop", "local_product", "shopping"]' },
    { name: 'ร้านเจ๊จิ๋ม ซีฟู้ด หาดแม่รำพึง', type: 'กิน', lat: 12.6074, lng: 101.3853, province: 'ระยอง', popularity_score: 8.5, category_tags: '["food", "seafood"]' },
    
    // ฉะเชิงเทรา (Chachoengsao)
    { name: 'วัดโสธรวรารามวรวิหาร (หลวงพ่อโสธร)', type: 'เที่ยว', lat: 13.6738, lng: 101.0673, province: 'ฉะเชิงเทรา', popularity_score: 9.8, category_tags: '["culture", "temple", "respect"]' },
    { name: 'ตลาดน้ำบางคล้า (ของกิน OTOP)', type: 'เที่ยว', lat: 13.7259, lng: 101.2066, province: 'ฉะเชิงเทรา', popularity_score: 8.5, category_tags: '["market", "food", "otop", "river"]' },
    { name: 'ร้านเถ้าแก่ซื้อ กุ้งแม่น้ำเผา', type: 'กิน', lat: 13.6710, lng: 101.0710, province: 'ฉะเชิงเทรา', popularity_score: 8.7, category_tags: '["food", "seafood", "river_prawn"]' },
    { name: 'RIVA Floating Cafe (คาเฟ่ริมน้ำ)', type: 'กิน', lat: 13.6800, lng: 101.0500, province: 'ฉะเชิงเทรา', popularity_score: 8.2, category_tags: '["cafe", "river", "chill"]' },
  ];

  for (const loc of locations) {
    await prisma.location.create({ data: loc });
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
