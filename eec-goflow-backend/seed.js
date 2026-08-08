const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // สร้าง User จำลอง
  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
      password: "password123",
      name: "Test User",
      age: 25,
      budget_level: "ปานกลาง",
      travel_style: JSON.stringify(["ทะเลพักใจ", "คาเฟ่ถ่ายรูป"]),
      points: 100
    }
  });

  // สร้างสถานที่ท่องเที่ยว
  const locations = [
    // ชลบุรี
    { name: 'เขาสามมุข', type: 'เที่ยว', lat: 13.3079, lng: 100.9022, province: 'ชลบุรี', popularity_score: 8.5, category_tags: '["nature", "viewpoint"]' },
    { name: 'หาดบางแสน', type: 'เที่ยว', lat: 13.2843, lng: 100.9135, province: 'ชลบุรี', popularity_score: 9.0, category_tags: '["beach", "chill"]' },
    { name: 'Way Coffee House', type: 'กิน', lat: 13.2988, lng: 100.9088, province: 'ชลบุรี', popularity_score: 7.8, category_tags: '["cafe", "coffee", "beach"]' },
    { name: 'ร้านอาหารทะเลป้าแจ๋ว อ่างศิลา', type: 'กิน', lat: 13.3323, lng: 100.9197, province: 'ชลบุรี', popularity_score: 8.9, category_tags: '["food", "seafood"]' },
    { name: 'สถาบันวิทยาศาสตร์ทางทะเล ม.บูรพา', type: 'เที่ยว', lat: 13.2796, lng: 100.9250, province: 'ชลบุรี', popularity_score: 8.2, category_tags: '["aquarium", "education"]' },
    { name: 'ร้านลุงเจือ ซีฟู้ด', type: 'กิน', lat: 13.3310, lng: 100.9210, province: 'ชลบุรี', popularity_score: 7.5, category_tags: '["food", "seafood", "hidden-gem"]' },
    
    // ระยอง
    { name: 'อุทยานเขาแหลมหญ้า', type: 'เที่ยว', lat: 12.5511, lng: 101.4428, province: 'ระยอง', popularity_score: 9.2, category_tags: '["nature", "sea", "national_park"]' },
    { name: 'ทุ่งโปรงทอง', type: 'เที่ยว', lat: 12.7056, lng: 101.7161, province: 'ระยอง', popularity_score: 8.8, category_tags: '["nature", "mangrove"]' },
    { name: 'ร้านเจ๊จิ๋ม ซีฟู้ด หาดแม่รำพึง', type: 'กิน', lat: 12.6074, lng: 101.3853, province: 'ระยอง', popularity_score: 8.5, category_tags: '["food", "seafood"]' },
    { name: 'Bake & More Cafe', type: 'กิน', lat: 12.6841, lng: 101.2721, province: 'ระยอง', popularity_score: 7.9, category_tags: '["cafe", "coffee"]' },
    
    // ฉะเชิงเทรา
    { name: 'วัดโสธรวรารามวรวิหาร', type: 'เที่ยว', lat: 13.6738, lng: 101.0673, province: 'ฉะเชิงเทรา', popularity_score: 9.5, category_tags: '["culture", "temple"]' },
    { name: 'ตลาดน้ำบางคล้า', type: 'เที่ยว', lat: 13.7259, lng: 101.2066, province: 'ฉะเชิงเทรา', popularity_score: 8.1, category_tags: '["market", "food"]' },
    { name: 'ร้านเถ้าแก่ซื้อ (กุ้งแม่น้ำ)', type: 'กิน', lat: 13.6710, lng: 101.0710, province: 'ฉะเชิงเทรา', popularity_score: 8.7, category_tags: '["food", "seafood"]' },
    { name: 'RIVA Floating Cafe', type: 'กิน', lat: 13.6800, lng: 101.0500, province: 'ฉะเชิงเทรา', popularity_score: 8.0, category_tags: '["cafe", "river"]' },
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
