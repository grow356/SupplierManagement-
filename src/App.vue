<script setup>
import { ref, onMounted } from 'vue';
import { fetchCustomers, saveCustomer, deleteCustomer } from './services/supabaseService';
import CustomerList from './components/CustomerList.vue';
import CustomerModal from './components/CustomerModal.vue';

const customers = ref([]);
const loading = ref(false);
const showModal = ref(false);
const editingCustomer = ref(null);
const currentView = ref('dashboard'); // 'dashboard', 'settings'
// No configuration needed for Supabase as it's hardcoded for now
const isConfigured = ref(true);

const loadData = async () => {
  loading.value = true;
  try {
    customers.value = await fetchCustomers();
  } catch (error) {
    console.error('Fetch error:', error);
    alert('載入失敗: ' + error.message);
  } finally {
    loading.value = false;
  }
};

const handleSaveCustomer = async (formData) => {
  try {
    loading.value = true;
    await saveCustomer({ ...formData, id: editingCustomer.value?.id });
    await loadData(); // Reload from Supabase
    showModal.value = false;
  } catch (error) {
    alert('儲存失敗: ' + error.message);
  } finally {
    loading.value = false;
  }
};

const handleDeleteCustomer = async (id) => {
  if (!confirm('確定要刪除這位客戶嗎？')) return;
  
  try {
    loading.value = true;
    await deleteCustomer(id);
    await loadData();
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
  loadData();
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
        class="active"
      >
        <span class="nav-icon">📊</span> 儀表板
      </a>
    </nav>

    <div class="sidebar-footer">
      <div class="status-indicator">
        <span class="dot"></span> 已連線至 Supabase
      </div>
    </div>
  </aside>

  <main class="container">
    <div>
      <header class="main-header">
        <div>
          <h1>客戶總覽</h1>
          <p class="subtitle">管理您的客戶資料與追蹤進度</p>
        </div>
      </header>

      <CustomerList 
        :customers="customers"
        :loading="loading"
        @add="openAddModal"
        @edit="openEditModal"
        @delete="handleDeleteCustomer"
      />
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
