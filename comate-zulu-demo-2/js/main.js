
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const translateBtn = document.getElementById('translate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const passwordModal = document.getElementById('password-modal');
    const loginBtn = document.getElementById('login-btn');
    const closeBtn = document.querySelector('.close');
    const passwordInput = document.getElementById('password-input');

    // 默认密码
    const DEFAULT_PASSWORD = 'RZ88751';

    // 翻译按钮点击事件
    translateBtn.addEventListener('click', async function() {
        const chineseTitle = document.getElementById('chinese-title').value;
        const platform = document.getElementById('platform-select').value;
        
        if (!chineseTitle) {
            alert('请输入中文标题');
            return;
        }

        try {
            translateBtn.disabled = true;
            translateBtn.textContent = '翻译中...';
            
            const translatedResult = await callDeepSeekAPI(chineseTitle, platform);
            
            document.getElementById('translated-title').value = translatedResult.translation;
            document.getElementById('translated-meaning').value = translatedResult.meaning;
        } catch (error) {
            console.error('翻译失败:', error);
            alert('翻译失败，请检查API配置和网络连接');
        } finally {
            translateBtn.disabled = false;
            translateBtn.textContent = '翻译';
        }
    });

    // 复制按钮点击事件
    copyBtn.addEventListener('click', function() {
        const translatedTitle = document.getElementById('translated-title');
        translatedTitle.select();
        document.execCommand('copy');
        alert('已复制到剪贴板');
    });

    // 设置按钮点击事件 - 显示密码模态框
    settingsBtn.addEventListener('click', function() {
        passwordModal.style.display = 'block';
    });

    // 登录按钮点击事件
    loginBtn.addEventListener('click', function() {
        if (passwordInput.value === DEFAULT_PASSWORD) {
            window.location.href = 'admin.html';
        } else {
            alert('密码错误');
        }
    });

    // 关闭模态框
    closeBtn.addEventListener('click', function() {
        passwordModal.style.display = 'none';
    });

    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        if (event.target === passwordModal) {
            passwordModal.style.display = 'none';
        }
    });

    // 初始化平台选择下拉菜单
    function initPlatformSelect() {
        const platformSelect = document.getElementById('platform-select');
        platformSelect.innerHTML = '';
        
        const platforms = JSON.parse(localStorage.getItem('platforms')) || [];
        const apiKey = localStorage.getItem('apiKey');
        
        if (!apiKey) {
            alert('请先在后台配置DEEPSEEK API Key');
            return;
        }
        
        platforms.forEach(platform => {
            const option = document.createElement('option');
            option.value = platform.id;
            option.textContent = platform.name;
            platformSelect.appendChild(option);
        });
    }
    
    // 调用DEEPSEEK API进行翻译
    async function callDeepSeekAPI(text, platformId) {
        const platforms = JSON.parse(localStorage.getItem('platforms')) || [];
        const apiKey = localStorage.getItem('apiKey');
        const platform = platforms.find(p => p.id === platformId);
        
        if (!platform) {
            throw new Error('未找到平台配置');
        }
        
        try {
            const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        {
                            role: 'system',
                            content: platform.prompt
                        },
                        {
                            role: 'user',
                            content: text
                        }
                    ],
                    temperature: 0.7
                })
            });
            
            const data = await response.json();
            return {
                translation: data.choices[0].message.content,
                meaning: `这是"${text}"在${platform.name}平台的翻译结果`
            };
        } catch (error) {
            console.error('API调用失败:', error);
            throw error;
        }
    }
    
    // 初始化页面
    initPlatformSelect();
});
