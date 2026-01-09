# 添加联系人到数据库 - 使用指南

本指南说明如何将10个高端NYC沙龙添加到联系人数据库，以便自动化邮件草拟和外联。

## 方法1: 使用API路由（推荐）

### 步骤1: 预览要添加的沙龙

```bash
# 获取将要添加的10个沙龙列表预览
curl http://localhost:3000/api/contacts/seed-premium-salons
```

或者直接在浏览器访问：
```
http://localhost:3000/api/contacts/seed-premium-salons
```

### 步骤2: 添加联系人到数据库

```bash
# 添加所有联系人（跳过已存在的）
curl -X POST http://localhost:3000/api/contacts/seed-premium-salons \
  -H "Content-Type: application/json" \
  -d '{}'

# 或者强制覆盖已存在的记录
curl -X POST http://localhost:3000/api/contacts/seed-premium-salons \
  -H "Content-Type: application/json" \
  -d '{"overwrite": true}'
```

## 方法2: 使用npm脚本

确保开发服务器正在运行（`npm run dev`），然后：

```bash
npm run add-contacts
```

## 方法3: 使用管理界面

1. 启动开发服务器：`npm run dev`
2. 访问：`http://localhost:3000/admin/outreach/contacts`
3. 手动添加联系人或使用批量导入功能

## 已添加的10个高端沙龙

1. **Federico Salon & Spa** - 57 W 58th St, Midtown
2. **Marie Robinson Salon** - 40 W 25th St, Flatiron
3. **Yukie Natori New York Salon & Spa** - 39 W 56th St, Midtown
4. **Dejavous Salon Inc** - 38 W 56th St, Midtown
5. **Dazzle Beauty Salon** - 590 3rd Ave, Murray Hill
6. **Aate Beauty Salon** - 21 E 32nd St, Koreatown
7. **Shear Bliss NYC Salon** - 397 3rd Ave, Murray Hill
8. **Poiz Beauty Salon** - 520 3rd Ave, Murray Hill
9. **Omni Beauty Salon** - 152 5th Ave, Brooklyn
10. **Yany's Beauty Salon Inc** - 169 Rivington St, Lower East Side

## 每个联系人包含的信息

- ✅ 沙龙名称 (business_name)
- ✅ 业务类型 (business_type: 'salon')
- ✅ 网站URL (business_url)
- ✅ 邮箱地址 (email)
- ✅ 电话号码 (phone)
- ✅ 地址 (address)
- ⚠️ 联系人姓名 (name) - 部分需要验证
- ⚠️ 角色 (role: 'owner' | 'manager') - 部分需要验证
- ✅ 标签 (tags: ['premium', 'location', ...])
- ✅ 备注 (notes: 包含位置和验证提示)

## 下一步：自动化邮件草拟

添加联系人后，可以使用以下功能：

1. **创建外联活动** (`/admin/outreach/campaigns`)
   - 选择目标联系人
   - 使用AI生成个性化邮件草稿

2. **批量草拟邮件** (`/api/outreach/draft`)
   - 为多个联系人自动生成邮件草稿
   - 使用Ollama AI生成个性化内容

3. **发送邮件** (`/api/outreach/send`)
   - 使用Resend API发送邮件
   - 跟踪打开、点击和回复

## 验证联系人

添加后，可以通过以下方式验证：

```bash
# 获取所有联系人
curl http://localhost:3000/api/contacts

# 获取特定状态的联系人
curl "http://localhost:3000/api/contacts?status=new"

# 获取特定类型的业务
curl "http://localhost:3000/api/contacts?business_type=salon"
```

## 注意事项

1. **联系人姓名验证**: 部分沙龙的负责人姓名是基于业务名称推断的，需要进一步验证
2. **邮箱验证**: 所有邮箱地址都是从公开来源获取，建议验证有效性
3. **重复检查**: 脚本会自动跳过已存在的联系人，避免重复
4. **数据库要求**: 需要配置Supabase数据库连接（环境变量）

## 环境变量要求

确保设置了以下环境变量：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

## 故障排除

如果遇到问题：

1. **数据库连接失败**: 检查Supabase环境变量
2. **重复插入错误**: 使用 `overwrite: true` 或先删除现有记录
3. **API路由404**: 确保开发服务器正在运行
4. **缺少必需字段**: 检查数据库schema是否匹配

