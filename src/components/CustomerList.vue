<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  customers: Array,
  loading: Boolean
});

const emit = defineEmits(['add', 'edit', 'delete']);

const searchQuery = ref('');

const filteredCustomers = computed(() => {
  if (!searchQuery.value) return props.customers;
  const q = searchQuery.value.toLowerCase();
  return props.customers.filter(c => 
    c.name.toLowerCase().includes(q) || 
    c.company?.toLowerCase().includes(q) || 
    c.email?.toLowerCase().includes(q)
  );
});

const getStatusClass = (status) => {
  switch (status) {
    case '已成交': return 'status-success';
    case '洽談中': return 'status-warning';
    case '已流失': return 'status-danger';
    default: return 'status-muted';
  }
};
</script>

<template>
  <div class="glass-card table-container animate-fade">
    <div class="flex-between header-actions">
      <div class="search-box">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="搜尋客戶、公司或 Email..." 
          class="input-field"
        >
      </div>
      <button @click="$emit('add')" class="btn btn-primary">
        <span>+ 新增客戶</span>
      </button>
    </div>

    <div v-if="loading" class="loading-state">
      正在載入資料...
    </div>
    
    <div v-else-if="filteredCustomers.length === 0" class="empty-state">
      <p v-if="searchQuery">找不到符合條件的客戶</p>
      <p v-else>目前尚無客戶資料</p>
    </div>

    <div v-else class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>姓名</th>
            <th>公司</th>
            <th>狀態</th>
            <th>Email / 電話</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="customer in filteredCustomers" :key="customer.id">
            <td class="font-bold">{{ customer.name }}</td>
            <td>{{ customer.company || '-' }}</td>
            <td>
              <span :class="['status-badge', getStatusClass(customer.status)]">
                {{ customer.status }}
              </span>
            </td>
            <td>
              <div class="contact-info">
                <span>{{ customer.email || '-' }}</span>
                <span class="text-small">{{ customer.phone || '-' }}</span>
              </div>
            </td>
            <td>
              <div class="actions">
                <button @click="$emit('edit', customer)" class="action-btn">編輯</button>
                <button @click="$emit('delete', customer.id)" class="action-btn danger">刪除</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.table-container {
  padding: 25px;
  overflow: hidden;
}

.header-actions {
  margin-bottom: 25px;
}

.search-box {
  width: 350px;
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.data-table th {
  padding: 15px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-muted);
  font-weight: 500;
  font-size: 0.9rem;
}

.data-table td {
  padding: 20px 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.font-bold {
  font-weight: 600;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-success { background: rgba(16, 185, 129, 0.15); color: #10b981; }
.status-warning { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
.status-danger { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
.status-muted { background: rgba(148, 163, 184, 0.15); color: #94a3b8; }

.contact-info {
  display: flex;
  flex-direction: column;
}

.text-small {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  background: none;
  border: none;
  color: var(--primary);
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0;
}

.action-btn.danger {
  color: #fca5a5;
}

.action-btn:hover {
  text-decoration: underline;
}

.loading-state, .empty-state {
  padding: 60px;
  text-align: center;
  color: var(--text-muted);
}
</style>
