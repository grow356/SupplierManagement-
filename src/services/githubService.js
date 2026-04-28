const GITHUB_ACCESS_TOKEN = 'crm_github_token';
const GITHUB_GIST_ID = 'crm_github_gist_id';

export const getSettings = () => ({
  token: localStorage.getItem(GITHUB_ACCESS_TOKEN) || '',
  gistId: localStorage.getItem(GITHUB_GIST_ID) || ''
});

export const saveSettings = (token, gistId) => {
  localStorage.setItem(GITHUB_ACCESS_TOKEN, token);
  localStorage.setItem(GITHUB_GIST_ID, gistId);
};

export const fetchCustomers = async () => {
  const { token, gistId } = getSettings();
  if (!token || !gistId) throw new Error('GitHub settings not configured');

  const response = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: {
      Authorization: `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error('Token 無效或已過期 (401)');
    if (response.status === 403) throw new Error('Token 權限不足，請檢查是否勾選 gist (403)');
    if (response.status === 404) throw new Error('找不到 Gist ID，請檢查 ID 是否正確 (404)');
    throw new Error(`連線失敗 (${response.status}): Failed to fetch data`);
  }

  const gist = await response.json();
  const file = gist.files['customers.json'];
  
  if (!file) {
    return []; // Return empty list if file doesn't exist yet
  }

  try {
    return JSON.parse(file.content);
  } catch (e) {
    console.error('Failed to parse customers.json', e);
    return [];
  }
};

export const saveCustomers = async (customers) => {
  const { token, gistId } = getSettings();
  if (!token || !gistId) throw new Error('GitHub settings not configured');

  const response = await fetch(`https://api.github.com/gists/${gistId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      files: {
        'customers.json': {
          content: JSON.stringify(customers, null, 2)
        }
      }
    })
  });

  if (!response.ok) {
    throw new Error('Failed to save data to GitHub');
  }

  return true;
};
