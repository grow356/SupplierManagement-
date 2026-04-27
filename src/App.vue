<script setup>
import { ref, onMounted } from 'vue';
import { fetchCustomers, saveCustomers, getSettings } from './services/githubService';
import CustomerList from './components/CustomerList.vue';
import CustomerModal from './components/CustomerModal.vue';
import Settings from './components/Settings.vue';

const customers = ref([]);
const loading = ref(false);
const showModal = ref(false);
const editingCustomer = ref(null);
const currentView = ref('dashboard'); // 'dashboard', 'settings'
const isConfigured = ref(false);

const checkConfig = () => {
  const settings = getSettings();
  isConfigured.value = !!(settings.token && settings.gistId);
  if (isConfigured.value) {
    loadData();
  } else {
    currentView.value = 'settings';
  }
};

const loadData = async () => {
  if (!isConfigured.value) return;
  loading.value = true;
  try {
    customers.value = await fetchCustomers();
  } catch (error) {
    alert('載入失敗: ' + error.message);
  } finally {
    loading.value = false;
  }
};

const handleSaveCustomer = async (formData) => {
  let newList = [...customers.value];
  if (editingCustomer.value) {
    const index = newList.findIndex(c => c.id === editingCustomer.value.id);
    newList[index] = { ...formData, id: editingCustomer.value.id };
  } else {
    newList.push({ ...formData, id: Date.now() });
  }

  try {
    loading.value = true;
    await saveCustomers(newList);
    customers.value = newList;
    showModal.value = false;
  } catch (error) {
    alert('儲存失敗: ' + error.message);
  } finally {
    loading.value = false;
  }
};

const handleDeleteCustomer = async (id) => {
  if (!confirm('確定要刪除這位客戶嗎？')) return;
  
  const newList = customers.value.filter(c => c.id !== id);
  try {
    loading.value = true;
    await saveCustomers(newList);
    customers.value = newList;
  } catch (error) {
    alert('刪除失敗: ' + error.message);
  } finally {
    loading.value = false;
  }
};

const openAddModal = () => {
  editingCustomer.value = null;
  showModal.value = true;
};

const openEditModal = (customer) => {
  editingCustomer.value = customer;
  showModal.value = true;
};

onMounted(() => {
  checkConfig();
});
</script>

<template>
  <aside class="sidebar glass-card">
    <div class="logo">
      <span class="logo-icon">💎</span>
      <span class="logo-text">Aura CRM</span>
    </div>
    
    <nav class="nav">
      <a 
        href="#" 
        :class="{ active: currentView === 'dashboard' }"
        @click.prevent="currentView = 'dashboard'"
      >
        <span class="nav-icon">📊</span> 儀表板
      </a>
      <a 
        href="#" 
        :class="{ active: currentView === 'settings' }"
        @click.prevent="currentView = 'settings'"
      >
        <span class="nav-icon">⚙️</span> 系統設定
      </a>
    </nav>

    <div class="sidebar-footer">
      <div v-if="isConfigured" class="status-indicator">
        <span class="dot"></span> 已連至 GitHub
      </div>
    </div>
  </aside>

  <main class="container">
    <header class="main-header">
      <div v-if="currentView === 'dashboard'">
        <h1>客戶總覽</h1>
        <p class="subtitle">管理您的客戶資料與追蹤進度</p>
      </div>
      <div v-else>
        <h1>系統設定</h1>
        <p class="subtitle">配置您的 GitHub API 存取憑證</p>
      </div>
    </header>

    <div v-if="currentView === 'dashboard'">
      <div v-if="!isConfigured" class="glass-card animate-fade" style="padding: 40px; text-align: center;">
        <h3>尚未設定資料庫</h3>
        <p style="margin: 15px 0 25px; color: var(--text-muted);">
          請先前往設定頁面配置您的 GitHub Token 與 Gist ID 才能開始使用。
        </p>
        <button @click="currentView = 'settings'" class="btn btn-primary">前往設定</button>
      </div>
      
      <CustomerList 
        v-else
        :customers="customers"
        :loading="loading"
        @add="openAddModal"
        @edit="openEditModal"
        @delete="handleDeleteCustomer"
      />
    </div>

    <div v-else>
      <Settings @settings-saved="checkConfig" />
    </div>

    <CustomerModal 
      :isOpen="showModal"
      :editItem="editingCustomer"
      @close="showModal = false"
      @save="handleSaveCustomer"
    />
  </main>
</template>

<style>
/* Layout */
.sidebar {
  width: var(--sidebar-width);
  height: 96vh;
  margin: 2vh 0 2vh 20px;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 2vh;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 50px;
}

.logo-icon { font-size: 1.8rem; }
.logo-text { font-family: 'Outfit'; font-weight: 700; font-size: 1.4rem; letter-spacing: -0.5px; }

.nav { display: flex; flex-direction: column; gap: 8px; flex: 1; }

.nav a {
  padding: 14px 18px;
  border-radius: 12px;
  text-decoration: none;
  color: var(--text-muted);
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
}

.nav a:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.nav a.active {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.1));
  color: var(--primary);
  border: 1px solid rgba(99, 102, 241, 0.3);
}

.nav-icon { font-size: 1.2rem; }

.main-header { margin-bottom: 40px; }
.subtitle { color: var(--text-muted); }

.sidebar-footer { margin-top: auto; }
.status-indicator {
  font-size: 0.85rem;
  color: #10b981;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(16, 185, 129, 0.1);
  padding: 8px 12px;
  border-radius: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 10px #10b981;
}

@media (max-width: 900px) {
  #app { flex-direction: column; }
  .sidebar { width: calc(100% - 40px); height: auto; margin-bottom: 0; }
  .nav { flex-direction: row; overflow-x: auto; }
}
</style>
