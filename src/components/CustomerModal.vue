<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  editItem: Object
});

const emit = defineEmits(['close', 'save']);

const form = ref({
  name: '',
  email: '',
  phone: '',
  company: '',
  status: '潛在客戶',
  notes: ''
});

watch(() => props.editItem, (newVal) => {
  if (newVal) {
    form.value = { ...newVal };
  } else {
    form.value = {
      name: '',
      email: '',
      phone: '',
      company: '',
      status: '潛在客戶',
      notes: ''
    };
  }
}, { immediate: true });

const handleSave = () => {
  if (!form.value.name) {
    alert('請輸入姓名');
    return;
  }
  emit('save', { ...form.value });
};
</script>

<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="glass-card modal-content animate-fade">
      <div class="flex-between" style="margin-bottom: 25px;">
        <h3>{{ editItem ? '編輯客戶' : '新增客戶' }}</h3>
        <button @click="$emit('close')" class="btn-close">&times;</button>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">姓名 *</label>
          <input v-model="form.name" type="text" class="input-field" placeholder="中文或英文姓名">
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input v-model="form.email" type="email" class="input-field" placeholder="example@mail.com">
        </div>
        <div class="form-group">
          <label class="form-label">電話</label>
          <input v-model="form.phone" type="text" class="input-field" placeholder="09xx-xxx-xxx">
        </div>
        <div class="form-group">
          <label class="form-label">公司名稱</label>
          <input v-model="form.company" type="text" class="input-field">
        </div>
        <div class="form-group" style="grid-column: span 2;">
          <label class="form-label">狀態</label>
          <select v-model="form.status" class="input-field">
            <option>潛在客戶</option>
            <option>洽談中</option>
            <option>已成交</option>
            <option>已流失</option>
          </select>
        </div>
        <div class="form-group" style="grid-column: span 2;">
          <label class="form-label">備註</label>
          <textarea v-model="form.notes" class="input-field" rows="3"></textarea>
        </div>
      </div>

      <div class="flex-between" style="margin-top: 30px;">
        <button @click="$emit('close')" class="btn btn-secondary">取消</button>
        <button @click="handleSave" class="btn btn-primary">儲存客戶</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 600px;
  padding: 30px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.btn-close {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 2rem;
  cursor: pointer;
  line-height: 1;
}

.btn-close:hover {
  color: white;
}
</style>
