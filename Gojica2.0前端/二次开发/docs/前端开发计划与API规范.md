# Gojica 前端开发计划与API规范

## 📋 文档信息
- **项目名称**: Gojica 音乐人社区与服务平台
- **版本**: v2.0.0
- **编写日期**: 2026-04-29
- **基于后端**: Node.js + Express + MySQL 8.0
- **状态**: 待开发

---

## 一、项目概述

### 1.1 后端API现状
后端API已开发完成并通过全面测试：
- **接口总数**: 60+ 个RESTful API
- **测试覆盖**: 308个测试用例全部通过
- **技术栈**: Node.js + Express + Sequelize + MySQL 8.0

### 1.2 前端开发目标
| 产品 | 技术栈 | 功能定位 |
|------|--------|----------|
| 微信小程序 | UniApp + Vue3 + TypeScript | C端用户主入口 |
| 后台管理系统 | Vue3 + Element Plus | 运营管理平台 |

---

## 二、前端API规范

### 2.1 基础配置

```typescript
// 小程序端配置
const API_CONFIG = {
  baseURL: 'http://localhost:3000/api/v1',
  timeout: 30000,
  header: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
};

// 后台管理系统配置
const ADMIN_API_CONFIG = {
  baseURL: 'http://localhost:3000/api/v1/admin',
  timeout: 30000
};
```

### 2.2 响应码映射

| 后端业务码 | 含义 | 前端处理 |
|-----------|------|----------|
| 1000 | 操作成功 | 直接返回data |
| 1001 | 创建成功 | Toast提示，显示新增数据 |
| 1002 | 更新成功 | Toast提示，更新本地状态 |
| 1003 | 删除成功 | Toast提示，从列表移除 |
| 2000 | 认证成功 | 存储Token，跳转首页 |
| 2001 | 退出成功 | 清除存储，跳转登录页 |
| 2002 | Token刷新 | 更新本地Token |
| 3001 | 未授权 | 清除Token，跳转登录页 |
| 3002 | 禁止访问 | Toast提示权限不足 |
| 3003 | 资源不存在 | Toast提示内容不存在 |
| 3004 | 验证失败 | 显示字段级错误 |
| 3005 | 资源冲突 | Toast提示冲突原因 |
| 3006 | 请求频繁 | Toast提示稍后再试 |

### 2.3 API模块封装

#### 认证模块 `/api/v1/auth`
```typescript
// src/api/auth.ts
import { get, post } from '@/utils/request';

export const authApi = {
  login: (data: { code: string; identity: string }) => 
    post<{ accessToken: string; refreshToken: string; user: UserInfo }>('/auth/login', data),
  
  register: (data: { code: string; nickname: string; identity: string }) => 
    post<{ accessToken: string; refreshToken: string; user: UserInfo }>('/auth/register', data),
  
  refresh: (data: { refreshToken: string }) => 
    post<{ accessToken: string }>('/auth/refresh', data),
  
  logout: () => post('/auth/logout')
};
```

#### 用户模块 `/api/v1/users`
```typescript
// src/api/user.ts
import { get, put, post } from '@/utils/request';

export const userApi = {
  getProfile: () => get<UserProfile>('/users/profile'),
  
  updateProfile: (data: Partial<UserProfile>) => 
    put<UserProfile>('/users/profile', data),
  
  bindIdentity: (data: { identity: string }) => 
    post<{ identity: string }>('/users/bind-identity', data),
  
  getFavorites: (params?: PaginationParams) => 
    get<{ list: Favorite[]; pagination: Pagination }>('/users/favorites', params),
  
  getActivities: (params?: PaginationParams) => 
    get<{ list: Activity[]; pagination: Pagination }>('/users/activities', params),
  
  getBookings: (params?: PaginationParams) => 
    get<{ list: Booking[]; pagination: Pagination }>('/users/bookings', params),
  
  getOrders: (params?: PaginationParams) => 
    get<{ list: Order[]; pagination: Pagination }>('/users/orders', params),
  
  getFollows: (params?: PaginationParams) => 
    get<{ list: Band[]; pagination: Pagination }>('/users/follows', params)
};
```

#### 乐队模块 `/api/v1/bands`
```typescript
// src/api/band.ts
import { get, post, put, del } from '@/utils/request';

export const bandApi = {
  getList: (params?: BandListParams) => 
    get<{ list: Band[]; pagination: Pagination }>('/bands', params),
  
  getDetail: (id: number) => get<BandDetail>(`/bands/${id}`),
  
  create: (data: CreateBandDTO) => post<Band>('/bands', data),
  
  update: (id: number, data: UpdateBandDTO) => put<Band>(`/bands/${id}`, data),
  
  delete: (id: number) => del(`/bands/${id}`),
  
  follow: (id: number) => post<{ followed: boolean }>(`/bands/${id}/follow`)
};
```

#### 活动模块 `/api/v1/activities`
```typescript
// src/api/activity.ts
import { get, post, put, del } from '@/utils/request';

export const activityApi = {
  getList: (params?: ActivityListParams) => 
    get<{ list: Activity[]; pagination: Pagination }>('/activities', params),
  
  getDetail: (id: number) => get<ActivityDetail>(`/activities/${id}`),
  
  create: (data: CreateActivityDTO) => post<Activity>('/activities', data),
  
  update: (id: number, data: UpdateActivityDTO) => put<Activity>(`/activities/${id}`, data),
  
  delete: (id: number) => del(`/activities/${id}`),
  
  signup: (id: number, data?: { participant_count?: number; remark?: string }) => 
    post<Signup>('/activities/:id/signup', data),
  
  cancel: (id: number) => post(`/activities/:id/cancel`),
  
  checkin: (id: number) => post<Checkin>('/activities/:id/checkin'),
  
  getSignups: (id: number, params?: PaginationParams) => 
    get<{ list: Signup[]; pagination: Pagination }>(`/activities/${id}/signups`, params),
  
  getUserActivities: (params?: PaginationParams) => 
    get<{ list: Activity[]; pagination: Pagination }>('/activities/user/activities', params)
};
```

#### 帖子模块 `/api/v1/posts`
```typescript
// src/api/post.ts
import { get, post, put, del } from '@/utils/request';

export const postApi = {
  getList: (params?: PostListParams) => 
    get<{ list: Post[]; pagination: Pagination }>('/posts', params),
  
  getDetail: (id: number) => get<PostDetail>(`/posts/${id}`),
  
  create: (data: CreatePostDTO) => post<Post>('/posts', data),
  
  update: (id: number, data: UpdatePostDTO) => put<Post>(`/posts/${id}`, data),
  
  delete: (id: number) => del(`/posts/${id}`),
  
  like: (id: number) => post<{ liked: boolean; like_count: number }>(`/posts/${id}/like`),
  
  comment: (id: number, data: { content: string }) => 
    post<Comment>(`/posts/${id}/comment`, data)
};
```

#### 商品模块 `/api/v1/products`
```typescript
// src/api/product.ts
import { get, post, put, del } from '@/utils/request';

export const productApi = {
  getList: (params?: ProductListParams) => 
    get<{ list: Product[]; pagination: Pagination }>('/products', params),
  
  getDetail: (id: number) => get<ProductDetail>(`/products/${id}`),
  
  create: (data: CreateProductDTO) => post<Product>('/products', data),
  
  update: (id: number, data: UpdateProductDTO) => put<Product>(`/products/${id}`, data),
  
  delete: (id: number) => del(`/products/${id}`)
};
```

#### 排练房模块 `/api/v1/rooms`
```typescript
// src/api/room.ts
import { get, post, put, del } from '@/utils/request';

export const roomApi = {
  getList: (params?: RoomListParams) => 
    get<{ list: Room[]; pagination: Pagination }>('/rooms', params),
  
  getDetail: (id: number) => get<RoomDetail>(`/rooms/${id}`),
  
  create: (data: CreateRoomDTO) => post<Room>('/rooms', data),
  
  update: (id: number, data: UpdateRoomDTO) => put<Room>(`/rooms/${id}`, data),
  
  delete: (id: number) => del(`/rooms/${id}`),
  
  join: (id: number) => post(`/rooms/${id}/join`),
  
  leave: (id: number) => post(`/rooms/${id}/leave`)
};
```

#### 招募模块 `/api/v1/recruitments`
```typescript
// src/api/recruitment.ts
import { get, post, put, del } from '@/utils/request';

export const recruitmentApi = {
  getList: (params?: RecruitmentListParams) => 
    get<{ list: Recruitment[]; pagination: Pagination }>('/recruitments', params),
  
  getDetail: (id: number) => get<RecruitmentDetail>(`/recruitments/${id}`),
  
  create: (data: CreateRecruitmentDTO) => post<Recruitment>('/recruitments', data),
  
  update: (id: number, data: UpdateRecruitmentDTO) => put<Recruitment>(`/recruitments/${id}`, data),
  
  delete: (id: number) => del(`/recruitments/${id}`),
  
  apply: (id: number, data?: { message?: string }) => 
    post<Application>(`/recruitments/${id}/apply`, data)
};
```

#### 搜索模块 `/api/v1/search`
```typescript
// src/api/search.ts
import { get } from '@/utils/request';

export const searchApi = {
  search: (params: { q: string; type?: SearchType; page?: number; pageSize?: number }) => 
    get<SearchResult>('/search', params)
};
```

#### 上传模块 `/api/v1/upload`
```typescript
// src/api/upload.ts
import { post } from '@/utils/request';

export const uploadApi = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return post<{ filename: string; url: string; size: number; width: number; height: number }>(
      '/upload/image', 
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  },
  
  uploadAudio: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return post<{ filename: string; url: string; size: number; duration: number }>(
      '/upload/audio',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  },
  
  uploadVideo: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return post<{ filename: string; url: string; size: number; duration: number }>(
      '/upload/video',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  }
};
```

### 2.4 TypeScript类型定义

```typescript
// src/types/api.d.ts

// 通用类型
interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface PaginationParams {
  page?: number;
  pageSize?: number;
}

// 用户相关
interface UserInfo {
  id: number;
  nickname: string;
  avatar: string;
  identity: 'fan' | 'musician' | 'venue' | 'band';
}

interface UserProfile extends UserInfo {
  phone: string;
  instrument: string;
  music_style: string;
  location: string;
  bio: string;
  video_url: string | null;
  status: number;
  created_at: string;
  updated_at: string;
}

// 乐队相关
interface Band {
  id: number;
  name: string;
  style: string;
  intro: string;
  avatar: string;
  cover: string;
  member_count: number;
  owner: { id: number; nickname: string };
}

interface BandDetail extends Band {
  members: BandMember[];
  works: Work[];
  recent_activities: Activity[];
  is_followed: boolean;
}

interface BandMember {
  id: number;
  user_id: number;
  nickname: string;
  avatar: string;
  instrument: string;
  role: string;
}

// 活动相关
interface Activity {
  id: number;
  title: string;
  description: string;
  cover: string;
  type: 'recruitment' | 'performance' | 'competition' | 'other';
  status: 'recruiting' | 'in_progress' | 'ended';
  start_time: string;
  end_time: string;
  location: string;
  max_participants: number;
  current_participants: number;
  organizer: { id: number; nickname: string; avatar: string };
  band?: { id: number; name: string; avatar: string };
}

interface ActivityDetail extends Activity {
  signups: Signup[];
  is_signed_up: boolean;
}

// 帖子相关
interface Post {
  id: number;
  user_id: number;
  title: string;
  content: string;
  images: string[];
  audio_url: string | null;
  video_url: string | null;
  like_count: number;
  comment_count: number;
  is_liked: boolean;
  author: { id: number; nickname: string; avatar: string };
  created_at: string;
}

interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  author: { id: number; nickname: string; avatar: string };
  created_at: string;
}

// 商品相关
interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  original_price: number;
  stock: number;
  category: string;
  condition: string;
  images: string[];
  band?: { id: number; name: string };
}

// 排练房相关
interface Room {
  id: number;
  name: string;
  type: 'chat' | 'voice' | 'video';
  description: string;
  cover: string;
  creator_id: number;
  band_id?: number;
  max_users: number;
  current_users: number;
  status: number;
}

// 招募相关
interface Recruitment {
  id: number;
  title: string;
  description: string;
  instrument: string;
  requirements: string[];
  status: 'open' | 'closed';
  band: { id: number; name: string; avatar: string };
}

// 搜索相关
interface SearchResult {
  bands: { list: Band[]; total: number };
  activities: { list: Activity[]; total: number };
  products: { list: Product[]; total: number };
  recruitments: { list: Recruitment[]; total: number };
  posts: { list: Post[]; total: number };
}
```

---

## 三、前端开发计划

### 3.1 开发阶段总览

```
阶段一（第1-2周）: 项目初始化与基础架构
    │
    ▼
阶段二（第3-5周）: 小程序核心功能开发
    │
    ▼
阶段三（第6-7周）: 后台管理系统开发
    │
    ▼
阶段四（第8-9周）: 前后端联调测试
    │
    ▼
阶段五（第10周）: 部署与验收
```

### 3.2 阶段一：项目初始化（第1-2周）

#### 第1周：项目创建与配置

| Day | 小程序端任务 | 后台系统任务 |
|-----|-------------|-------------|
| 1 | 使用HBuilderX创建UniApp项目 | 使用Vite创建Vue3项目 |
| 1 | 安装依赖：pinia, uni-ui, sass | 安装依赖：vue-router, pinia, element-plus, echarts, axios |
| 2 | 配置TypeScript | 配置TypeScript |
| 2 | 配置ESLint + Prettier | 配置ESLint + Prettier |
| 3 | 搭建目录结构 | 搭建目录结构 |
| 4 | 封装request工具 | 封装request工具(Axios) |
| 5 | 封装API模块 | 封装API模块 |

#### 第2周：基础组件开发

| Day | 小程序端任务 | 后台系统任务 |
|-----|-------------|-------------|
| 6-7 | 基础UI组件库(20+) | Element Plus组件封装 |
| 8-9 | 业务卡片组件(7个) | 表格/表单组件封装 |
| 10 | 阶段验收与代码审查 | 阶段验收与代码审查 |

**阶段一产出**:
- [ ] 小程序项目骨架
- [ ] 后台系统项目骨架
- [ ] 基础组件库(20+组件)
- [ ] API封装模块(9个模块)
- [ ] TypeScript类型定义

### 3.3 阶段二：小程序核心功能开发（第3-5周）

#### 第3周：用户与首页模块

| Day | 任务内容 | 涉及API |
|-----|---------|---------|
| 11 | 微信登录页面 | POST /auth/login, POST /auth/register |
| 12 | 个人资料页面 | GET /users/profile, PUT /users/profile |
| 13 | 身份绑定功能 | POST /users/bind-identity |
| 14 | 首页轮播与统计 | GET /home/banners, GET /home/stats |
| 15 | 全局搜索功能 | GET /search |

#### 第4周：业务模块开发

| Day | 任务内容 | 涉及API |
|-----|---------|---------|
| 16-17 | 乐队列表与详情 | GET /bands, GET /bands/:id |
| 18-19 | 活动列表与报名 | GET /activities, POST /activities/:id/signup |
| 20 | 排练房列表与预约 | GET /rooms, POST /rooms/:id/join |

#### 第5周：社交与个人中心

| Day | 任务内容 | 涉及API |
|-----|---------|---------|
| 21-22 | 动态发布与互动 | POST /posts, POST /posts/:id/like |
| 23 | 招募浏览与申请 | GET /recruitments, POST /recruitments/:id/apply |
| 24-25 | 个人中心完善 | GET /users/favorites, GET /users/activities |

**阶段二产出**:
- [ ] 用户模块完整
- [ ] 首页模块完整
- [ ] 乐队模块完整
- [ ] 活动模块完整
- [ ] 排练房模块完整
- [ ] 动态模块完整
- [ ] 招募模块完整
- [ ] 个人中心完整

### 3.4 阶段三：后台管理系统开发（第6-7周）

#### 第6周：管理与内容

| Day | 任务内容 | 涉及API |
|-----|---------|---------|
| 26 | 登录与主布局 | POST /admin/auth/login |
| 27-28 | 用户管理 | GET /admin/users, PUT /admin/users/:id |
| 29-30 | 内容审核 | GET /admin/bands/audit, PUT /admin/bands/:id/audit |

#### 第7周：运营与统计

| Day | 任务内容 | 涉及API |
|-----|---------|---------|
| 31-32 | 订单管理 | GET /admin/orders, GET /admin/orders/:id |
| 33 | 轮播图管理 | POST /admin/banners, DELETE /admin/banners/:id |
| 34-35 | 数据统计看板 | GET /admin/statistics |

**阶段三产出**:
- [ ] 登录认证完整
- [ ] 用户管理完整
- [ ] 内容审核完整
- [ ] 订单管理完整
- [ ] 轮播图管理完整
- [ ] 数据统计完整

### 3.5 阶段四：联调测试（第8-9周）

#### 第8周：接口联调

| Day | 任务内容 |
|-----|---------|
| 36-37 | 小程序端全量接口联调 |
| 38 | 后台系统全量接口联调 |
| 39-40 | 异常场景处理与Bug修复 |

#### 第9周：测试与优化

| Day | 任务内容 |
|-----|---------|
| 41-42 | 功能测试与回归测试 |
| 43-44 | 性能测试与兼容性测试 |
| 45 | 安全测试与问题修复 |

**阶段四产出**:
- [ ] 接口联调完成
- [ ] 功能测试通过95%+
- [ ] 性能指标达标
- [ ] 兼容性测试通过

### 3.6 阶段五：部署与验收（第10周）

| Day | 任务内容 |
|-----|---------|
| 46-47 | 生产环境部署准备 |
| 48-49 | 线上测试与问题修复 |
| 50 | 系统验收与交付 |

---

## 四、接口对接清单

### 4.1 小程序端接口清单（60+接口）

| 模块 | 接口数 | 优先级 | 备注 |
|------|--------|--------|------|
| 认证 | 4 | P0 | 登录注册基础功能 |
| 用户 | 8 | P0 | 个人信息管理 |
| 首页 | 2 | P0 | 启动即用 |
| 乐队 | 6 | P1 | 核心社交功能 |
| 活动 | 10 | P1 | 核心业务功能 |
| 帖子 | 7 | P1 | 社区内容 |
| 商品 | 5 | P2 | 交易功能 |
| 排练房 | 7 | P2 | 预约功能 |
| 招募 | 6 | P2 | 社交功能 |
| 搜索 | 1 | P0 | 导航功能 |
| 上传 | 3 | P1 | 媒体功能 |

### 4.2 后台系统接口清单

| 模块 | 接口数 | 优先级 |
|------|--------|--------|
| 管理员认证 | 3 | P0 |
| 用户管理 | 10+ | P0 |
| 内容审核 | 15+ | P1 |
| 订单管理 | 10+ | P1 |
| 轮播图管理 | 5 | P2 |
| 数据统计 | 10+ | P1 |
| 系统设置 | 5 | P2 |

---

## 五、技术规范

### 5.1 状态管理规范

```typescript
// 用户状态 (src/store/user.ts)
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi, userApi } from '@/api';

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(uni.getStorageSync('token') || '');
  const profile = ref<UserProfile | null>(null);
  
  const isLoggedIn = computed(() => !!token.value);
  
  async function login(code: string, identity: string) {
    const res = await authApi.login({ code, identity });
    token.value = res.accessToken;
    uni.setStorageSync('token', res.accessToken);
    profile.value = res.user;
  }
  
  async function fetchProfile() {
    profile.value = await userApi.getProfile();
  }
  
  async function logout() {
    await authApi.logout();
    token.value = '';
    profile.value = null;
    uni.removeStorageSync('token');
  }
  
  return { token, profile, isLoggedIn, login, fetchProfile, logout };
});
```

### 5.2 请求封装规范

```typescript
// 小程序端请求封装
interface RequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  header?: Record<string, string>;
  loading?: boolean;
}

export function request<T>(options: RequestOptions): Promise<T> {
  const { url, method = 'GET', data, header = {}, loading = true } = options;
  const token = uni.getStorageSync('token');
  
  return new Promise((resolve, reject) => {
    if (loading) uni.showLoading({ title: '加载中...' });
    
    uni.request({
      url: API_BASE_URL + url,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...header
      },
      success: (res) => {
        if (loading) uni.hideLoading();
        
        const { code, message, data } = res.data as any;
        
        // 成功处理
        if (code >= 1000 && code < 2000) {
          resolve(data);
        }
        // Token过期
        else if (code === 3001) {
          uni.removeStorageSync('token');
          uni.reLaunch({ url: '/pages/login/login' });
          reject(new Error(message));
        }
        // 其他错误
        else {
          uni.showToast({ title: message, icon: 'none' });
          reject(new Error(message));
        }
      },
      fail: (err) => {
        if (loading) uni.hideLoading();
        uni.showToast({ title: '网络请求失败', icon: 'none' });
        reject(err);
      }
    });
  });
}
```

---

## 六、里程碑计划

| 里程碑 | 计划时间 | 完成标准 | 交付物 |
|--------|----------|----------|--------|
| M1: 环境就绪 | 第2周周五 | 项目骨架完成 | 代码仓库、组件库文档 |
| M2: 小程序核心 | 第5周周五 | 用户端功能80% | 可演示版本 |
| M3: 后台完成 | 第7周周五 | 管理端功能90% | 可演示版本 |
| M4: 联调通过 | 第9周周五 | 测试通过95% | 测试报告 |
| M5: 正式上线 | 第10周周五 | 系统验收通过 | 部署完成 |

---

## 七、人员分配

| 角色 | 人数 | 职责 |
|------|------|------|
| 项目负责人 | 1人 | 统筹协调、进度把控、质量监督 |
| 小程序开发 | 2人 | 页面开发、组件封装、接口对接 |
| 后台开发 | 1人 | 管理系统开发（可兼职） |

**工作分配**:
- **开发A**: 用户模块、首页、乐队模块、活动模块
- **开发B**: 排练房、商品、动态、招募、个人中心

---

## 八、质量保证

### 8.1 代码规范
- [ ] ESLint检查通过
- [ ] TypeScript类型完整
- [ ] 组件注释规范

### 8.2 测试覆盖
- [ ] 单元测试：核心工具函数
- [ ] 集成测试：API对接
- [ ] E2E测试：关键业务流程

### 8.3 性能指标
- [ ] 首屏加载 < 3秒
- [ ] 页面切换 < 300ms
- [ ] 接口响应 < 1秒

---

**文档制定完成时间**: 2026-04-29
**下次评审时间**: 2026-05-05
**文档版本**: v2.0.0