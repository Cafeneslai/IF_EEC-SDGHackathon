const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // สร้าง User จำลอง
  const user = await prisma.user.create({
    data: {
      name: 'Test User',
      age: 25,
      budget_level: 'ปานกลาง',
      travel_style: '["nature", "cafe"]',
      points: 100
    }
  });

  // สร้างสถานที่ท่องเที่ยว
  const locations = [
    { name: 'เขาสามมุข', type: 'เที่ยว', lat: 13.3079, lng: 100.9022, province: 'ชลบุรี', popularity_score: 8.5, category_tags: '["nature", "viewpoint"]' },
    { name: 'หาดบางแสน', type: 'เที่ยว', lat: 13.2843, lng: 100.9135, province: 'ชลบุรี', popularity_score: 9.0, category_tags: '["beach", "chill"]' },
    { name: 'Way Coffee House', type: 'กิน', lat: 13.2988, lng: 100.9088, province: 'ชลบุรี', popularity_score: 7.8, category_tags: '["cafe", "coffee", "beach"]' },
    { name: 'ร้านอาหารทะเลป้าแจ๋ว อ่างศิลา', type: 'กิน', lat: 13.3323, lng: 100.9197, province: 'ชลบุรี', popularity_score: 8.9, category_tags: '["food", "seafood"]' },
    { name: 'สถาบันวิทยาศาสตร์ทางทะเล ม.บูรพา', type: 'เที่ยว', lat: 13.2796, lng: 100.9250, province: 'ชลบุรี', popularity_score: 8.2, category_tags: '["aquarium", "education"]' },
    { name: 'ร้านลุงเจือ ซีฟู้ด', type: 'กิน', lat: 13.3310, lng: 100.9210, province: 'ชลบุรี', popularity_score: 7.5, category_tags: '["food", "seafood", "hidden-gem"]' },
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
