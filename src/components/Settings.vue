<script setup>
import { ref, onMounted } from 'vue';
import { getSettings, saveSettings } from '../services/githubService';

const emit = defineEmits(['settings-saved']);

const token = ref('');
const gistId = ref('');
const showSavedMsg = ref(false);

onMounted(() => {
  const current = getSettings();
  token.value = current.token;
  gistId.value = current.gistId;
});

const handleSave = () => {
  saveSettings(token.value, gistId.value);
  showSavedMsg.value = true;
  setTimeout(() => (showSavedMsg.value = false), 3000);
  emit('settings-saved');
};
</script>

<template>
  <div class="glass-card animate-fade" style="padding: 30px; max-width: 600px; margin: 0 auto;">
    <h2>⚙️ GitHub API 設定</h2>
    <p style="color: var(--text-muted); margin-bottom: 25px; line-height: 1.6;">
      請輸入您的 GitHub Personal Access Token (需有 <b>gist</b> 權限) 與 Gist ID。
      這些資訊將儲存在您的本地瀏覽器。
    </p>

    <div class="form-group">
      <label class="form-label">Personal Access Token (PAT)</label>
      <input 
        v-model="token" 
        type="password" 
        class="input-field" 
        placeholder="ghp_xxxxxxxxxxxx"
      />
    </div>

    <div class="form-group">
      <label class="form-label">Gist ID</label>
      <input 
        v-model="gistId" 
        type="text" 
        class="input-field" 
        placeholder="例如: a1b2c3d4..."
      />
    </div>

    <div class="flex-between">
      <button @click="handleSave" class="btn btn-primary">
        <span>儲存設定</span>
      </button>
      <span v-if="showSavedMsg" style="color: #10b981; font-size: 0.9rem;">✅ 設定已儲存</span>
    </div>

    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid var(--border-color); font-size: 0.85rem; color: var(--text-muted);">
      <p>⚠️ <b>注意：</b> 如果您還沒有 Gist ID，請先到 GitHub Gist 建立一個名為 <code>customers.json</code> 的檔案，內容寫 <code>[]</code> 即可，並複製網址最後一段 ID。</p>
    </div>
  </div>
</template>
