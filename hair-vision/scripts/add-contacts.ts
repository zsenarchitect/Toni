/**
 * Script to add 10 premium NYC salons to the contacts database
 * Run with: npx tsx scripts/add-contacts.ts
 */

interface ContactInput {
  business_name: string;
  business_type: 'salon' | 'barbershop';
  business_url?: string;
  email?: string;
  phone?: string;
  address?: string;
  name?: string; // Contact person name
  role?: 'owner' | 'stylist' | 'barber' | 'manager';
  notes?: string;
  tags?: string[];
}

const contacts: ContactInput[] = [
  {
    business_name: 'Federico Salon & Spa',
    business_type: 'salon',
    business_url: 'https://www.federicosalon.com',
    email: 'info@federicosalon.com',
    phone: '212-262-3027',
    address: '57 W 58th St, New York, NY 10019',
    name: 'Federico', // Owner name from business name
    role: 'owner',
    notes: 'Premium salon in Midtown Manhattan. High-end services. Contact person name may need verification.',
    tags: ['premium', 'midtown', 'spa'],
  },
  {
    business_name: 'Marie Robinson Salon',
    business_type: 'salon',
    business_url: 'https://www.marierobinsonsalon.com',
    email: 'info@marierobinsonsalon.com',
    phone: '212-358-7780',
    address: '40 W 25th St, 10th floor, New York, NY 10010',
    name: 'Marie Robinson', // Owner name from business name
    role: 'owner',
    notes: 'Well-established premium salon in Flatiron. Owner likely Marie Robinson - verify contact person.',
    tags: ['premium', 'flatiron', 'established'],
  },
  {
    business_name: 'Yukie Natori New York Salon & Spa',
    business_type: 'salon',
    business_url: 'https://www.yukiebeauty.com',
    email: 'info@yukiebeauty.com',
    phone: '212-702-9660',
    address: '39 W 56th St, New York, NY 10019',
    name: 'Yukie Natori', // Owner name from business name
    role: 'owner',
    notes: 'Japanese-inspired premium salon in Midtown. Owner likely Yukie Natori - verify contact person.',
    tags: ['premium', 'midtown', 'japanese', 'spa'],
  },
  {
    business_name: 'Dejavous Salon Inc',
    business_type: 'salon',
    business_url: 'https://www.dejavoussalon.com',
    email: 'marketing@dejavoussalon.com',
    phone: '212-581-6560',
    address: '38 W 56th St, New York, NY 10019',
    name: undefined, // Contact person unknown
    role: 'manager',
    notes: 'Marketing email provided. Contact person name to be determined. Midtown location.',
    tags: ['premium', 'midtown'],
  },
  {
    business_name: 'Dazzle Beauty Salon',
    business_type: 'salon',
    business_url: 'https://www.dazzlebeautysalon.com',
    email: 'info@dazzlebeautysalon.com',
    phone: '212-922-3625',
    address: '590 3rd Ave, New York, NY 10016',
    name: undefined,
    role: 'manager',
    notes: 'Murray Hill location. Contact person name to be determined.',
    tags: ['premium', 'murray-hill'],
  },
  {
    business_name: 'Aate Beauty Salon',
    business_type: 'salon',
    business_url: 'https://www.aatebeauty.com',
    email: 'aatebeautynyc@gmail.com',
    phone: '212-685-5700',
    address: '21 E 32nd St, New York, NY 10016',
    name: undefined,
    role: 'manager',
    notes: 'Koreatown location. Contact person name to be determined.',
    tags: ['premium', 'koreatown'],
  },
  {
    business_name: 'Shear Bliss NYC Salon',
    business_type: 'salon',
    business_url: 'https://www.shearblissnyc.com',
    email: 'shearblissnyc@yahoo.com',
    phone: '212-213-6050',
    address: '397 3rd Ave, New York, NY 10016',
    name: undefined,
    role: 'manager',
    notes: 'Murray Hill location. Contact person name to be determined.',
    tags: ['premium', 'murray-hill'],
  },
  {
    business_name: 'Poiz Beauty Salon',
    business_type: 'salon',
    business_url: 'https://www.poizbeautysalon.com',
    email: 'poizbeautysalon@gmail.com',
    phone: '212-779-7775',
    address: '520 3rd Ave, New York, NY 10016',
    name: undefined,
    role: 'manager',
    notes: 'Murray Hill location. Contact person name to be determined.',
    tags: ['premium', 'murray-hill'],
  },
  {
    business_name: 'Omni Beauty Salon',
    business_type: 'salon',
    business_url: 'https://www.myomnibeauty.com',
    email: 'myomnibeauty@gmail.com',
    phone: '718-789-8887',
    address: '152 5th Ave, Brooklyn, NY 11217',
    name: undefined,
    role: 'manager',
    notes: 'Brooklyn location (Park Slope area). Contact person name to be determined.',
    tags: ['premium', 'brooklyn', 'park-slope'],
  },
  {
    business_name: "Yany's Beauty Salon Inc",
    business_type: 'salon',
    business_url: 'https://www.yanysbeautysalon.com',
    email: 'yanysbeautysalon@gmail.com',
    phone: '212-353-9364',
    address: '169 Rivington St #2, New York, NY 10002',
    name: 'Yany', // Owner name from business name
    role: 'owner',
    notes: 'Lower East Side location. Owner likely Yany - verify contact person.',
    tags: ['premium', 'lower-east-side'],
  },
];

async function addContacts() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/contacts`;

  console.log(`\n准备添加 ${contacts.length} 个联系人到数据库...\n`);

  const results = {
    success: [] as Array<Record<string, unknown>>,
    errors: [] as Array<{ contact: string; error: string }>,
  };

  for (const contact of contacts) {
    try {
      console.log(`添加: ${contact.business_name}...`);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contact),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log(`  ✓ 成功: ${contact.business_name}`);
        results.success.push(data.contact);
      } else {
        const errorMsg = data.error || '未知错误';
        console.log(`  ✗ 失败: ${contact.business_name} - ${errorMsg}`);
        results.errors.push({
          contact: contact.business_name,
          error: errorMsg,
        });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error || '网络错误');
      console.log(`  ✗ 错误: ${contact.business_name} - ${errorMsg}`);
      results.errors.push({
        contact: contact.business_name,
        error: errorMsg,
      });
    }

    // 添加延迟避免过快请求
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n\n=== 结果总结 ===`);
  console.log(`成功: ${results.success.length}`);
  console.log(`失败: ${results.errors.length}`);

  if (results.errors.length > 0) {
    console.log(`\n失败的联系人:`);
    results.errors.forEach(({ contact, error }) => {
      console.log(`  - ${contact}: ${error}`);
    });
  }

  if (results.success.length > 0) {
    console.log(`\n成功添加的联系人:`);
    results.success.forEach(contact => {
      console.log(`  - ${contact.business_name} (ID: ${contact.id})`);
    });
  }

  return results;
}

// 如果直接运行此脚本
if (require.main === module) {
  addContacts()
    .then(() => {
      console.log('\n脚本执行完成。');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n脚本执行出错:', error);
      process.exit(1);
    });
}

export { addContacts, contacts };

