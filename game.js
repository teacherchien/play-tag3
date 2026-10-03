const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 1. 初始化物件
let S = { x: 200, y: 300, size: 30, color: '#f1c40f', speed: 4.25, alpha: 1.0, health: 100, maxHealth: 100 }; // 大楊桃
let M = { x: 700, y: 300, size: 20, color: '#f1c40f', speed: 5.4, alpha: 1.0, health: 60, maxHealth: 60, hitCount: 0, invulnerable: 0 }; // 小楊桃
let Starfruits = [
    { x: 50, y: 120, width: 50, height: 50, health: 100, color: '#f1c40f' },  // 左邊楊桃
    { x: 700, y: 120, width: 50, height: 50, health: 100, color: '#f1c40f' }  // 右邊楊桃
];
let gameState = 'playing'; // 遊戲狀態: 'intro'(介紹) 'playing'(遊戲中) 'ended'(結束)

// --- 障礙物數據 ---
let obstacles = [];

function initObstacles() {
    const version = Math.random() < 0.5 ? 1 : 2;
    
    if (version === 1) {
        // 版本1：標準迷宮佈局
        obstacles = [
            // 上方障礙物
            { x: 80, y: 70, width: 130, height: 40, color: '#8B4513' },
            { x: 300, y: 50, width: 110, height: 45, color: '#8B4513' },
            { x: 520, y: 70, width: 140, height: 40, color: '#8B4513' },
            { x: 700, y: 90, width: 85, height: 45, color: '#8B4513' },
            
            // 中上層障礙物 - L型組合
            { x: 150, y: 160, width: 100, height: 45, color: '#8B4513' },
            { x: 150, y: 205, width: 30, height: 50, color: '#8B4513' },
            { x: 350, y: 160, width: 85, height: 50, color: '#8B4513' },
            { x: 450, y: 200, width: 45, height: 200, color: '#8B4513' },
            { x: 600, y: 180, width: 105, height: 45, color: '#8B4513' },
            { x: 600, y: 225, width: 30, height: 55, color: '#8B4513' },
            
            // 中間層障礙物 - L型組合
            { x: 100, y: 280, width: 85, height: 45, color: '#8B4513' },
            { x: 100, y: 325, width: 30, height: 50, color: '#8B4513' },
            { x: 250, y: 300, width: 100, height: 45, color: '#8B4513' },
            { x: 250, y: 345, width: 35, height: 50, color: '#8B4513' },
            { x: 380, y: 270, width: 60, height: 120, color: '#8B4513' },
            { x: 520, y: 310, width: 110, height: 45, color: '#8B4513' },
            { x: 680, y: 290, width: 75, height: 50, color: '#8B4513' },
            { x: 680, y: 340, width: 30, height: 60, color: '#8B4513' },
            
            // 下方上層障礙物
            { x: 180, y: 410, width: 105, height: 45, color: '#8B4513' },
            { x: 180, y: 455, width: 35, height: 50, color: '#8B4513' },
            { x: 340, y: 390, width: 85, height: 50, color: '#8B4513' },
            { x: 530, y: 400, width: 100, height: 45, color: '#8B4513' },
            
            // 下方障礙物
            { x: 100, y: 510, width: 120, height: 40, color: '#8B4513' },
            { x: 350, y: 500, width: 95, height: 45, color: '#8B4513' },
            { x: 600, y: 510, width: 110, height: 40, color: '#8B4513' },
            
            // 左側竪向障礙物
            { x: 50, y: 240, width: 45, height: 150, color: '#8B4513' },
            
            // 右側竪向障礙物
            { x: 730, y: 280, width: 45, height: 170, color: '#8B4513' }
        ];
    } else {
        // 版本2：不同的佈局（更開放的中間，兩側密集）
        obstacles = [
            // 左側通道上 - L型組合
            { x: 30, y: 80, width: 140, height: 40, color: '#8B4513' },
            { x: 30, y: 120, width: 35, height: 50, color: '#8B4513' },
            { x: 50, y: 180, width: 120, height: 45, color: '#8B4513' },
            { x: 50, y: 225, width: 30, height: 55, color: '#8B4513' },
            { x: 40, y: 320, width: 130, height: 40, color: '#8B4513' },
            { x: 40, y: 360, width: 35, height: 50, color: '#8B4513' },
            { x: 60, y: 450, width: 115, height: 45, color: '#8B4513' },
            
            // 右側通道上 - L型組合
            { x: 650, y: 90, width: 140, height: 45, color: '#8B4513' },
            { x: 740, y: 90, width: 35, height: 55, color: '#8B4513' },
            { x: 670, y: 210, width: 125, height: 40, color: '#8B4513' },
            { x: 740, y: 210, width: 30, height: 50, color: '#8B4513' },
            { x: 660, y: 360, width: 135, height: 45, color: '#8B4513' },
            { x: 660, y: 405, width: 30, height: 55, color: '#8B4513' },
            { x: 680, y: 480, width: 125, height: 40, color: '#8B4513' },
            
            // 中間上方
            { x: 220, y: 70, width: 160, height: 45, color: '#8B4513' },
            { x: 420, y: 90, width: 135, height: 40, color: '#8B4513' },
            { x: 420, y: 130, width: 30, height: 55, color: '#8B4513' },
            
            // 中間中層 - L型組合
            { x: 280, y: 220, width: 100, height: 45, color: '#8B4513' },
            { x: 280, y: 265, width: 35, height: 55, color: '#8B4513' },
            { x: 450, y: 240, width: 85, height: 45, color: '#8B4513' },
            { x: 150, y: 290, width: 110, height: 45, color: '#8B4513' },
            { x: 150, y: 335, width: 35, height: 55, color: '#8B4513' },
            { x: 380, y: 320, width: 80, height: 120, color: '#8B4513' },
            { x: 600, y: 280, width: 100, height: 45, color: '#8B4513' },
            { x: 600, y: 325, width: 30, height: 55, color: '#8B4513' },
            
            // 中間下層
            { x: 200, y: 400, width: 105, height: 45, color: '#8B4513' },
            { x: 200, y: 445, width: 30, height: 50, color: '#8B4513' },
            { x: 400, y: 420, width: 95, height: 45, color: '#8B4513' },
            { x: 550, y: 380, width: 110, height: 45, color: '#8B4513' },
            
            // 下方
            { x: 250, y: 520, width: 135, height: 40, color: '#8B4513' },
            { x: 480, y: 510, width: 120, height: 45, color: '#8B4513' }
        ];
    }
}

// --- 技能設定數據 ---
let S_skill = { 
    isActive: false, 
    cd: 0,           // 當前冷卻時間
    maxCd: 600,      // 10秒冷卻 (假設 60 FPS)
    duration: 300,   // 5秒揮刀動作持續時間
    timer: 0,
    name: '武器揮刀'
};

let M_skill = { 
    isActive: false, 
    cd: 0, 
    maxCd: 1200,     // 20秒冷卻
    duration: 60,    // 1秒隱身
    timer: 0,
    ghostPos: { x: 0, y: 0 } // 假分身位置
};

// M 的求偷襲技能
let M_assault = {
    isActive: false,
    cd: 0,
    maxCd: 240,      // 4秒冷卻
    duration: 40,    // 持續時間
    timer: 0,
    speedBoost: 3    // 額外速度加成
};

// 監聽按鍵狀態
let keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    // 按空格鍵從介紹畫面轉換遊戲
    if (e.key === ' ') {
        if (gameState === 'intro') {
            gameState = 'playing';
        } else if (gameState === 'ended') {
            gameState = 'intro';
        }
        e.preventDefault();
    }
});
window.addEventListener('keyup', (e) => keys[e.key] = false);

// 碰撞偵測函式 (矩形 vs 矩形)
function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + (rect2.width || rect2.size) &&
           rect1.x + (rect1.width || rect1.size) > rect2.x &&
           rect1.y < rect2.y + (rect2.height || rect2.size) &&
           rect1.y + (rect1.height || rect1.size) > rect2.y;
}

// 障礙物碰撞檢測與阻擋 - 卡住效果
function checkObstacleCollision(character) {
    const charSize = character.size || 20;
    
    for (let obstacle of obstacles) {
        // 圓形 vs 矩形碰撞偵測
        const circleX = character.x;
        const circleY = character.y;
        const circleRadius = charSize / 2;
        
        // 找到圓心到矩形的最近點
        const closestX = Math.max(obstacle.x, Math.min(circleX, obstacle.x + obstacle.width));
        const closestY = Math.max(obstacle.y, Math.min(circleY, obstacle.y + obstacle.height));
        
        // 計算距離
        const dx = circleX - closestX;
        const dy = circleY - closestY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 如果碰撞，則恢復到上一個有效位置（卡住）
        if (distance < circleRadius) {
            // 根據進入方向阻擋
            const obsCenterX = obstacle.x + obstacle.width / 2;
            const obsCenterY = obstacle.y + obstacle.height / 2;
            
            // 計算應該推回的方向
            const pushDx = circleX - obsCenterX;
            const pushDy = circleY - obsCenterY;
            const pushDistance = Math.sqrt(pushDx * pushDx + pushDy * pushDy) || 1;
            
            // 將角色推回到不碰撞的位置
            const separationDistance = circleRadius - distance + 1;
            character.x = circleX + (pushDx / pushDistance) * separationDistance;
            character.y = circleY + (pushDy / pushDistance) * separationDistance;
        }
    }
}

// 邊界檢測
function checkBounds(character) {
    const charSize = character.size || 20;
    const padding = 5; // 邊界內縮距離
    
    // 檢查左邊界
    if (character.x - charSize / 2 < padding) {
        character.x = charSize / 2 + padding;
    }
    // 檢查右邊界
    if (character.x + charSize / 2 > canvas.width - padding) {
        character.x = canvas.width - charSize / 2 - padding;
    }
    // 檢查上邊界
    if (character.y - charSize / 2 < padding) {
        character.y = charSize / 2 + padding;
    }
    // 檢查下邊界
    if (character.y + charSize / 2 > canvas.height - padding) {
        character.y = canvas.height - charSize / 2 - padding;
    }
}

// 隨機出生點生成
function getRandomSpawnPoint(character) {
    const charSize = character.size || 20;
    const padding = 30;
    let x, y;
    let isValid = false;
    
    // 確保出生點合法（不在障礙物上、不靠太近楊桃）
    while (!isValid) {
        x = padding + Math.random() * (canvas.width - 2 * padding);
        y = padding + Math.random() * (canvas.height - 2 * padding);
        
        // 檢查是否靠近任何楊桃
        let tooCloseToFruit = false;
        for (let fruit of Starfruits) {
            const dist2Starfruit = Math.sqrt(
                Math.pow(x - fruit.x, 2) + Math.pow(y - fruit.y, 2)
            );
            if (dist2Starfruit <= 150) {
                tooCloseToFruit = true;
                break;
            }
        }
        
        if (!tooCloseToFruit) {
            isValid = true;
        }
    }
    
    return { x, y };
}

function update() {
    if (gameState !== 'playing') return; // 只有遊戲中才更新
    
    // 2. 移動控制 (S 使用方向鍵, M 使用 WASD)
    // S 的移動
    if (keys['ArrowUp']) S.y -= S.speed;
    if (keys['ArrowDown']) S.y += S.speed;
    if (keys['ArrowLeft']) S.x -= S.speed;
    if (keys['ArrowRight']) S.x += S.speed;

    // M 的移動
    if (keys['w']) M.y -= M.speed;
    if (keys['s']) M.y += M.speed;
    if (keys['a']) M.x -= M.speed;
    if (keys['d']) M.x += M.speed;

    // --- 障礙物碰撞檢測與推開 ---
    // 多次迭代檢測以確保完全分離
    for (let i = 0; i < 3; i++) {
        checkObstacleCollision(S);
        checkObstacleCollision(M);
    }

    // --- 邊界檢測 ---
    checkBounds(S);
    checkBounds(M);

    // 結束按鍵 (R 鍵重置遊戲)
    if (keys['r'] || keys['R']) {
        resetGame();
        keys['r'] = false;
        keys['R'] = false;
    }

    // 技能系統
    handleSkills();

    // 3. 碰撞邏輯處理
    // 情況 A：S 用武器打到 M
    if (isColliding(S, M) && S_skill.isActive && M.invulnerable <= 0) {
        M.hitCount++;
        M.invulnerable = 60; // 無敵時間 1 秒
        if (M.hitCount >= 2) {
            alert("S 守衛成功！M 被打敗了！");
            resetGame();
        } else {
            alert(`M 被打中！還需要被打 ${2 - M.hitCount} 次才會輸！`);
            keys = {}; // 清空按鍵狀態
        }
        S_skill.isActive = false; // 結束這次揮刀
    }

    // 更新無敵時間
    if (M.invulnerable > 0) {
        M.invulnerable--;
    }

    // 情況 B：M 偷襲楊桃
    for (let fruit of Starfruits) {
        if (isColliding(M, fruit)) {
            // 求偷襲技能中造成更多傷害
            let damage = M_assault.isActive ? 2 : 0.5;
            fruit.health -= damage;
            if (fruit.health <= 0) {
                alert("M 成功偷走了楊桃！M 勝利！");
                resetGame();
            }
        }
    }
}

function handleSkills() {
    if (gameState !== 'playing') return; // 只有遊戲中才技能
    
    // S 的技能觸發 (按下 Enter 鍵)
    if (keys['Enter'] && S_skill.cd === 0) {
        S_skill.isActive = true;
        S_skill.timer = S_skill.duration;
        S_skill.cd = S_skill.maxCd;
        keys['Enter'] = false; // 防止連續觸發
    }

    // M 的技能觸發 (按下 Shift 鍵)
    if ((keys['Shift'] || keys['ShiftLeft'] || keys['ShiftRight']) && M_skill.cd === 0) {
        M_skill.isActive = true;
        M_skill.timer = M_skill.duration;
        M_skill.cd = M_skill.maxCd;
        M_skill.ghostPos = { x: M.x, y: M.y }; // 在原地留下分身
        keys['Shift'] = false; // 防止連續觸發
    }

    // M 的求偷襲技能觸發 (按下 C 鍵)
    if ((keys['c'] || keys['C']) && M_assault.cd === 0) {
        M_assault.isActive = true;
        M_assault.timer = M_assault.duration;
        M_assault.cd = M_assault.maxCd;
        keys['c'] = false;
        keys['C'] = false;
    }

    // 技能邏輯更新
    if (S_skill.isActive) {
        S.speed = 12; // 衝刺速度
        S_skill.timer--;
        if (S_skill.timer <= 0) {
            S_skill.isActive = false;
            S.speed = 4.25; // 恢復正常
        }
    }

    if (M_skill.isActive) {
        M.speed = 8;
        M.alpha = 0.3; // 變得透明
        M_skill.timer--;
        if (M_skill.timer <= 0) {
            M_skill.isActive = false;
            M.speed = 5.4;
            M.alpha = 1.0;
        }
    }

    // M 的求偷襲技能邏輯
    if (M_assault.isActive) {
        M.speed = 6 + M_assault.speedBoost; // 加速
        M.color = '#ff6b9d'; // 變色表示技能狀態
        M_assault.timer--;
        if (M_assault.timer <= 0) {
            M_assault.isActive = false;
            M.color = '#f1c40f'; // 恢復顏色
            M.speed = 6;
        }
    }

    // 冷卻倒數
    if (S_skill.cd > 0) S_skill.cd--;
    if (M_skill.cd > 0) M_skill.cd--;
    if (M_assault.cd > 0) M_assault.cd--;
}

function drawEffects() {
    // 繪製 M 的假分身
    if (M_skill.isActive) {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = 'gray';
        ctx.fillRect(M_skill.ghostPos.x, M_skill.ghostPos.y, M.size, M.size);
        ctx.globalAlpha = 1.0;
    }

    // 繪製 S 的武器揮刀視效
    if (S_skill.isActive) {
        ctx.strokeStyle = '#FFD700'; // 金色
        ctx.lineWidth = 4;
        // 繪製揮刀圓弧
        ctx.beginPath();
        ctx.arc(S.x, S.y, S.size + 15, 0, Math.PI * 2);
        ctx.stroke();
        
        // 繪製閃光效果
        ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(S.x, S.y, S.size + 20, 0, Math.PI * 2);
        ctx.fill();
    }

    // 繪製 M 的求偷襲視效
    if (M_assault.isActive) {
        ctx.strokeStyle = '#ff6b9d';
        ctx.lineWidth = 3;
        ctx.strokeRect(M.x - 8, M.y - 8, M.size + 16, M.size + 16);
    }
    
    // 顯示技能狀態
    ctx.font = '16px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`S 武器(Enter): ${S_skill.cd === 0 ? '就緒' : Math.ceil(S_skill.cd/60)}s`, 10, 20);
    ctx.fillText(`M 隱身(Shift): ${M_skill.cd === 0 ? '就緒' : Math.ceil(M_skill.cd/60)}s`, 10, 40);
    ctx.fillText(`M 求偷襲(C): ${M_assault.cd === 0 ? '就緒' : Math.ceil(M_assault.cd/60)}s`, 10, 60);
    
    // 顯示 M 被打計數
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#e74c3c';
    ctx.fillText(`M 被打: ${M.hitCount}/2`, canvas.width - 150, 30);
}

function showIntro() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('讓皮炎放鬆一下', canvas.width / 2, 100);
    
    ctx.fillStyle = '#00bcd4';
    ctx.font = 'bold 20px Arial';
    ctx.fillText('控制鍵位', canvas.width / 2, 180);
    
    ctx.fillStyle = '#fff';
    ctx.font = '18px Arial';
    let lineHeight = 40;
    let startY = 240;
    
    ctx.textAlign = 'left';
    const controls = [
        'S 移動: ↑ ↓ ← → 方向鍵     M 移動: W A S D',
        'S 技能(揮刀): Enter 鍵     M 技能(順移): Shift 鍵',
        '開始遊戲: 空格鍵          重置遊戲: R 鍵',
        '',
        '🌟 S(守衛)打敗 M 2 次獲勝   🍴 M(小偷)偷走楊桃獲勝'
    ];
    
    controls.forEach((control, index) => {
        ctx.fillText(control, 50, startY + index * lineHeight);
    });
    
    ctx.fillStyle = '#ffeb3b';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('按空格鍵開始遊戲 ⊳', canvas.width / 2, canvas.height - 60);
    
    ctx.textAlign = 'left';
}

// 繪製五角星（楊桃形）
function drawStar(x, y, size, color, alpha = 1.0) {
    const outerRadius = size / 2;
    const innerRadius = size / 4;
    const points = 5;
    
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.strokeStyle = '#e8b923';
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / points - Math.PI / 2;
        const px = x + radius * Math.cos(angle);
        const py = y + radius * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.globalAlpha = 1.0;
}

// 繪製障礙物
function drawObstacles() {
    for (let obstacle of obstacles) {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
}

// 繪製邊界
function drawBoundary() {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
}

// 繪製角色血條
function drawHealthBar(x, y, width, height, currentHealth, maxHealth) {
    // 背景（紅色）
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(x - width / 2, y - 10, width, height);
    
    // 血量（綠色）
    const healthPercent = currentHealth / maxHealth;
    ctx.fillStyle = '#2ecc71';
    ctx.fillRect(x - width / 2, y - 10, width * healthPercent, height);
    
    // 邊框
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - width / 2, y - 10, width, height);
}

function resetGame() {
    // 隨機出生點 - 確保 S 和 M 的距離足夠遠
    const S_spawn = getRandomSpawnPoint(S);
    let M_spawn = getRandomSpawnPoint(M);
    
    // 檢查 S 和 M 的距離，如果太近則重新生成 M 的出生點
    while (true) {
        const distance = Math.sqrt(
            Math.pow(M_spawn.x - S_spawn.x, 2) + Math.pow(M_spawn.y - S_spawn.y, 2)
        );
        if (distance >= 250) { M.invulnerable = 0;
            break;
        }
        M_spawn = getRandomSpawnPoint(M);
    }
    
    S.x = S_spawn.x; S.y = S_spawn.y; S.speed = 4.25; S.alpha = 1.0; S.health = 100;
    M.x = M_spawn.x; M.y = M_spawn.y; M.speed = 5.4; M.alpha = 1.0; M.color = '#f1c40f'; M.health = 60; M.hitCount = 0;
    for (let fruit of Starfruits) {
        fruit.health = 100;
    }
    S_skill.cd = 0; S_skill.isActive = false; S_skill.timer = 0;
    M_skill.cd = 0; M_skill.isActive = false; M_skill.timer = 0;
    M_assault.cd = 0; M_assault.isActive = false; M_assault.timer = 0;
    initObstacles(); // 初始化障礙物
    gameState = 'ended'; // 遊戲結束，回到介紹畫面
}

function draw() {
    // 清除畫面
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 顯示介紹畫面
    if (gameState === 'intro') {
        showIntro();
        requestAnimationFrame(draw);
        return;
    }
    
    // 遊戲中的更新和繪製
    if (gameState === 'playing') {
        update();
    }

    // 繪製障礙物
    drawObstacles();

    // 繪製邊界
    drawBoundary();

    // 繪製楊桃與血條
    for (let fruit of Starfruits) {
        ctx.fillStyle = fruit.color;
        ctx.fillRect(fruit.x, fruit.y, fruit.width, fruit.height);
        ctx.fillStyle = 'green';
        ctx.fillRect(fruit.x, fruit.y - 10, fruit.health / 2, 5);
    }

    // 繪製 S (大楊桃 - 守衛)
    drawStar(S.x, S.y, S.size, S.color, S.alpha);
    ctx.globalAlpha = M.invulnerable > 0 ? 0.5 : 1.0; // 無敵時閃爍
    drawStar(M.x, M.y, M.size, M.color, M.alpha);
    ctx.globalAlpha = 1.0
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText("S", S.x, S.y + 5);
    drawHealthBar(S.x, S.y + 30, 50, 5, S.health, S.maxHealth);

    // 繪製 M (小楊桃 - 小偷)
    drawStar(M.x, M.y, M.size, M.color, M.alpha);
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText("M", M.x, M.y + 2);
    drawHealthBar(M.x, M.y + 18, 30, 4, M.health, M.maxHealth);

    // 繪製技能效果
    drawEffects();

    // 顯示遊戲狀態提示
    if (gameState === 'ended') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('樹林秒慰！預準覆盤', canvas.width / 2, canvas.height / 2 - 50);
        ctx.font = '20px Arial';
        ctx.fillText('按空格鍵返回茶飯水', canvas.width / 2, canvas.height / 2 + 20);
    }

    requestAnimationFrame(draw);
}

// 遊戲初始化
function initGame() {
    initObstacles(); // 初始化障礙物
    
    // 隨機出生點
    const S_spawn = getRandomSpawnPoint(S);
    const M_spawn = getRandomSpawnPoint(M);
    
    S.x = S_spawn.x;
    S.y = S_spawn.y;
    M.x = M_spawn.x;
    M.y = M_spawn.y;
}

initGame();
draw(); 