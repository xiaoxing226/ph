
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const apiKeyInput = document.getElementById('api-key');
    const platformNameInput = document.getElementById('platform-name');
    const platformIdInput = document.getElementById('platform-id');
    const promptTextInput = document.getElementById('prompt-text');
    const savePlatformBtn = document.getElementById('save-platform-btn');
    const deletePlatformBtn = document.getElementById('delete-platform-btn');
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const backToHomeBtn = document.getElementById('back-to-home-btn');
    const platformList = document.getElementById('platform-list');

    // 从本地存储加载数据
    let platforms = JSON.parse(localStorage.getItem('platforms')) || [
        { id: 'tiktok-video-my', name: 'TK视频马来', prompt: '将中文标题翻译成马来语，适合TikTok视频' },
        { id: 'tiktok-shop-my', name: 'TK小店马来', prompt: '将中文标题翻译成马来语，适合TikTok小店' },
        { id: 'shopee-my', name: 'SHOPEE马来', prompt: '将中文标题翻译成马来语，适合Shopee平台' },
        { id: 'amazon-us', name: 'AMAZON美国', prompt: '将中文标题翻译成英语，适合Amazon美国站' }
    ];

    let apiKey = localStorage.getItem('apiKey') || '';
    let selectedPlatformId = null;

    // 初始化页面
    apiKeyInput.value = apiKey;
    renderPlatformList();

    // 保存平台按钮点击事件
    savePlatformBtn.addEventListener('click', function() {
        const name = platformNameInput.value.trim();
        const id = platformIdInput.value.trim();
        const prompt = promptTextInput.value.trim();

        if (!name || !id || !prompt) {
            alert('请填写所有字段');
            return;
        }

        if (selectedPlatformId) {
            // 编辑现有平台
            const index = platforms.findIndex(p => p.id === selectedPlatformId);
            if (index >= 0) {
                platforms[index] = { id, name, prompt };
            }
        } else {
            // 添加新平台
            // 检查是否已存在相同ID的平台
            if (platforms.some(p => p.id === id)) {
                alert('平台ID已存在，请使用不同的ID');
                return;
            }
            platforms.push({ id, name, prompt });
        }

        savePlatforms();
        resetForm();
        renderPlatformList();
        selectedPlatformId = null;
    });

    // 删除平台按钮点击事件
    deletePlatformBtn.addEventListener('click', function() {
        if (!selectedPlatformId) {
            alert('请先选择一个平台');
            return;
        }

        if (confirm('确定要删除这个平台吗？')) {
            platforms = platforms.filter(p => p.id !== selectedPlatformId);
            savePlatforms();
            resetForm();
            renderPlatformList();
            selectedPlatformId = null;
        }
    });

    // 保存设置按钮点击事件
    saveSettingsBtn.addEventListener('click', function() {
        apiKey = apiKeyInput.value.trim();
        localStorage.setItem('apiKey', apiKey);
        alert('设置已保存');
    });

    // 返回首页按钮点击事件
    backToHomeBtn.addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    // 渲染平台列表
    function renderPlatformList() {
        platformList.innerHTML = '';
        
        platforms.forEach(platform => {
            const li = document.createElement('li');
            li.textContent = `${platform.name} (${platform.id})`;
            li.addEventListener('click', () => {
                selectedPlatformId = platform.id;
                platformNameInput.value = platform.name;
                platformIdInput.value = platform.id;
                promptTextInput.value = platform.prompt;
                
                // 高亮选中的平台
                document.querySelectorAll('#platform-list li').forEach(item => {
                    item.style.backgroundColor = '';
                });
                li.style.backgroundColor = '#eee';
            });
            
            platformList.appendChild(li);
        });
    }

    // 保存平台数据到本地存储
    function savePlatforms() {
        localStorage.setItem('platforms', JSON.stringify(platforms));
    }

    // 重置表单
    function resetForm() {
        platformNameInput.value = '';
        platformIdInput.value = '';
        promptTextInput.value = '';
    }
});
