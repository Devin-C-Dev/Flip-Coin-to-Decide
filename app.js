// ==================== Toast Notification ====================
function showToast(message, duration = 2500) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// ==================== State Management ====================
const state = {
    currentStage: 1,
    selectedCoin: {
        id: 0,
        name: 'USD Dollar Coin',
        description: 'American currency • Authentic design',
        frontImage: 'images/美元正面.png',
        backImage: 'images/美元反面.png'
    },
    choices: {
        choiceA: '',
        choiceB: ''
    },
    bindings: {
        front: 'A',  // 'A' or 'B'
        back: 'B'    // 'A' or 'B'
    },
    flipResult: null  // 'front' or 'back'
};

// Flags to track if event listeners have been added
const initialized = {
    stage3: false,
    stage4: false
};

// Coins data
const coins = [
    {
        id: 0,
        name: '美元硬币',
        description: '美国货币 • 25美分',
        frontImage: 'images/美元正面.png',
        backImage: 'images/美元反面.png'
    },
    {
        id: 1,
        name: '英镑硬币',
        description: '英国货币 • 1英镑',
        frontImage: 'images/英镑正面.png',
        backImage: 'images/英镑反面.png'
    },
    {
        id: 2,
        name: '人民币硬币',
        description: '中国货币 • 1元',
        frontImage: 'images/人名币正面.png',
        backImage: 'images/人名币反面.png'
    }
];

// ==================== Stage Navigation ====================
function showStage(stageNumber) {
    // Hide all stages
    document.querySelectorAll('.stage').forEach(stage => {
        stage.classList.remove('active');
    });

    // Show target stage
    const targetStage = document.getElementById(`stage${stageNumber}`);
    if (targetStage) {
        targetStage.classList.add('active');
    }

    state.currentStage = stageNumber;

    // Initialize stage-specific logic
    if (stageNumber === 3) {
        initStage3(); // Always call initStage3 to update coin images
    } else if (stageNumber === 4) {
        initStage4();
    } else if (stageNumber === 5) {
        initStage5();
    }
}

// Modal control functions
function showModal() {
    const modal = document.getElementById('configModal');
    const modalHeadsPreview = document.getElementById('modalHeadsPreview');
    const modalTailsPreview = document.getElementById('modalTailsPreview');

    const coin = coins[state.selectedCoin.id];
    modalHeadsPreview.src = coin.frontImage;
    modalTailsPreview.src = coin.backImage;

    modal.classList.add('active');
}

function hideModal() {
    const modal = document.getElementById('configModal');
    modal.classList.remove('active');
}

// ==================== Stage 1: Coin Selection ====================
function initStage1() {
    const coinImage = document.getElementById('coinImage');
    const coinName = document.getElementById('coinName');
    const coinDescription = document.getElementById('coinDescription');
    const coinSelectionSubtitle = document.getElementById('coinSelectionSubtitle');
    const prevBtn = document.getElementById('prevCoin');
    const nextBtn = document.getElementById('nextCoin');
    const selectBtn = document.getElementById('selectCoinBtn');

    function updateCoinDisplay() {
        const coin = coins[state.selectedCoin.id];
        coinImage.src = coin.frontImage;
        coinName.textContent = coin.name;
        coinDescription.textContent = coin.description;
        coinSelectionSubtitle.textContent = `已选择${coin.name}`;
    }

    prevBtn.addEventListener('click', () => {
        state.selectedCoin.id = (state.selectedCoin.id - 1 + coins.length) % coins.length;
        updateCoinDisplay();
    });

    nextBtn.addEventListener('click', () => {
        state.selectedCoin.id = (state.selectedCoin.id + 1) % coins.length;
        updateCoinDisplay();
    });

    selectBtn.addEventListener('click', () => {
        showModal();
    });

    updateCoinDisplay();
}

// ==================== Stage 2: Configuration Modal ====================
function initStage2() {
    const backBtn = document.getElementById('backToStage1');
    const confirmBtn = document.getElementById('confirmConfig');

    backBtn.addEventListener('click', () => {
        hideModal();
    });

    confirmBtn.addEventListener('click', () => {
        hideModal();
        showStage(3);
    });
}

// ==================== Stage 3: Decision Binding ====================
function initStage3() {
    const choiceAInput = document.getElementById('choiceAInput');
    const choiceBInput = document.getElementById('choiceBInput');

    const choiceAFrontBind = document.getElementById('choiceAFrontBind');
    const choiceABackBind = document.getElementById('choiceABackBind');
    const choiceBFrontBind = document.getElementById('choiceBFrontBind');
    const choiceBBackBind = document.getElementById('choiceBBackBind');

    const summaryFrontValue = document.getElementById('summaryFrontValue');
    const summaryBackValue = document.getElementById('summaryBackValue');
    const readyBtn = document.getElementById('readyToFlipBtn');

    // Always update bind button icons based on selected coin (outside the if check)
    const selectedCoin = coins[state.selectedCoin.id];
    const bindIcons = document.querySelectorAll('.bind-icon');
    bindIcons[0].src = selectedCoin.frontImage; // Choice A Front
    bindIcons[1].src = selectedCoin.backImage;  // Choice A Back
    bindIcons[2].src = selectedCoin.frontImage; // Choice B Front
    bindIcons[3].src = selectedCoin.backImage;  // Choice B Back

    // Always update summary icons based on selected coin (outside the if check)
    const summaryIcons = document.querySelectorAll('.summary-icon');
    summaryIcons[0].src = selectedCoin.frontImage; // Summary Front
    summaryIcons[1].src = selectedCoin.backImage;  // Summary Back

    // Only add event listeners once
    if (!initialized.stage3) {
        // Binding buttons for Choice A
        choiceAFrontBind.addEventListener('click', () => {
            state.bindings.front = 'A';
            state.bindings.back = 'B';
            updateBindingUI();
        });

        choiceABackBind.addEventListener('click', () => {
            state.bindings.front = 'B';
            state.bindings.back = 'A';
            updateBindingUI();
        });

        // Binding buttons for Choice B
        choiceBFrontBind.addEventListener('click', () => {
            state.bindings.front = 'B';
            state.bindings.back = 'A';
            updateBindingUI();
        });

        choiceBBackBind.addEventListener('click', () => {
            state.bindings.front = 'A';
            state.bindings.back = 'B';
            updateBindingUI();
        });

        // Input listeners
        choiceAInput.addEventListener('input', () => {
            state.choices.choiceA = choiceAInput.value;
            updateSummary();
        });

        choiceBInput.addEventListener('input', () => {
            state.choices.choiceB = choiceBInput.value;
            updateSummary();
        });

        // Ready button
        readyBtn.addEventListener('click', () => {
            // Check which choices are missing
            const missingChoices = [];
            if (!state.choices.choiceA) missingChoices.push('选项A');
            if (!state.choices.choiceB) missingChoices.push('选项B');

            if (missingChoices.length === 0) {
                showStage(4);
            } else {
                // Show toast notification for missing choices
                const message = missingChoices.length === 2
                    ? '需要填写两个选项'
                    : `需要填写${missingChoices[0]}`;
                showToast(message);
            }
        });

        // Back to selection button
        const backToSelectionBtn = document.getElementById('backToSelectionBtn');
        backToSelectionBtn.addEventListener('click', () => {
            showStage(1);
        });

        initialized.stage3 = true;
    }

    function updateBindingUI() {
        // Reset all binding buttons
        document.querySelectorAll('.bind-button').forEach(btn => {
            btn.classList.remove('active');
        });

        // Set active states
        if (state.bindings.front === 'A') {
            choiceAFrontBind.classList.add('active');
            choiceBBackBind.classList.add('active');
        } else {
            choiceABackBind.classList.add('active');
            choiceBFrontBind.classList.add('active');
        }

        updateSummary();
    }

    function updateSummary() {
        const frontChoice = state.bindings.front === 'A' ? state.choices.choiceA : state.choices.choiceB;
        const backChoice = state.bindings.back === 'A' ? state.choices.choiceA : state.choices.choiceB;

        summaryFrontValue.textContent = frontChoice || '—';
        summaryBackValue.textContent = backChoice || '—';
    }

    updateBindingUI();
}

// ==================== Stage 4: CSS3D Flip Animation ====================
let isFlipping = false;
let pressStartTime = 0;
let pressTimer = null;

function initStage4() {
    const flipBtn = document.getElementById('flipBtn');
    const coin = document.getElementById('coin');
    const headsFace = document.querySelector('.face.heads');
    const tailsFace = document.querySelector('.face.tails');

    // Update coin face images based on selected coin
    const selectedCoin = coins[state.selectedCoin.id];
    headsFace.style.backgroundImage = `url('${selectedCoin.frontImage}')`;
    tailsFace.style.backgroundImage = `url('${selectedCoin.backImage}')`;

    // Remove old event listeners
    const newFlipBtn = flipBtn.cloneNode(true);
    flipBtn.parentNode.replaceChild(newFlipBtn, flipBtn);

    // Long press to charge
    newFlipBtn.addEventListener('mousedown', startPress);
    newFlipBtn.addEventListener('touchstart', startPress);
    newFlipBtn.addEventListener('mouseup', endPress);
    newFlipBtn.addEventListener('touchend', endPress);
    newFlipBtn.addEventListener('mouseleave', cancelPress);

    // Reset coin rotation and position
    coin.style.transform = 'translateX(-50%) rotateX(0deg)';
    coin.style.top = '200px';
}

function startPress(e) {
    if (isFlipping) return;
    e.preventDefault();
    
    pressStartTime = Date.now();
    
    // Visual feedback
    const flipBtn = document.getElementById('flipBtn');
    flipBtn.style.transform = 'scale(0.9)';
}

function endPress(e) {
    if (isFlipping) return;
    e.preventDefault();
    
    const pressDuration = Date.now() - pressStartTime;
    
    // Reset button
    const flipBtn = document.getElementById('flipBtn');
    flipBtn.style.transform = 'scale(1)';
    
    // Always trigger flip, duration based on press time
    flipCoin(pressDuration);
}

function cancelPress(e) {
    const flipBtn = document.getElementById('flipBtn');
    flipBtn.style.transform = 'scale(1)';
}

function flipCoin(pressDuration) {
    if (isFlipping) return;
    isFlipping = true;

    const flipBtn = document.getElementById('flipBtn');
    const coin = document.getElementById('coin');
    
    // Disable button
    flipBtn.disabled = true;
    flipBtn.style.cursor = 'not-allowed';

    // Determine result
    const result = Math.random() < 0.5 ? 'front' : 'back';
    state.flipResult = result;
    console.log('Flip result:', result);

    // Calculate height based on press duration (200ms-3000ms → -200px-0px, 超出屏幕)
    const maxPressDuration = 3000;
    const minPressDuration = 200;
    const clampedDuration = Math.min(Math.max(pressDuration, minPressDuration), maxPressDuration);
    const heightRatio = (clampedDuration - minPressDuration) / (maxPressDuration - minPressDuration);
    const maxHeight = 0;
    const minHeight = -200; // 负值表示超出屏幕顶部
    const targetTop = minHeight + (heightRatio * (maxHeight - minHeight));
    
    console.log('Press duration:', clampedDuration, 'Target top:', targetTop);

    // Calculate rotation - always rotate in one direction (6 full rotations for new animation)
    const baseRotations = 6; // Base 6 rotations (matches 75% keyframe at 1800deg + more)
    const degreesPerRotation = 360;
    let totalRotation = baseRotations * degreesPerRotation;

    // Ensure final position is correct (front = 0deg, back = 180deg)
    // Always add rotations, never subtract
    const resultDegrees = result === 'front' ? 0 : 180;
    const currentRotationMod = totalRotation % 360;
    const rotationAdjustment = resultDegrees - currentRotationMod;
    const finalDegrees = totalRotation + (rotationAdjustment < 0 ? rotationAdjustment + 360 : rotationAdjustment);
    
    console.log('Final rotation:', finalDegrees);

    // Reset animation
    coin.classList.remove('flipping');
    void coin.offsetWidth; // 触发重排

    // Set CSS variables
    coin.style.setProperty('--final-rotation', `${finalDegrees}deg`);
    coin.style.setProperty('--target-top', `${targetTop}px`);
    
    // Dynamic duration based on press time
    const duration = 1.5 + (heightRatio * 1.5); // 1.5s - 3s
    coin.style.setProperty('--duration', `${duration}s`);

    // 添加动画类
    coin.classList.add('flipping');

    // Listen for animation completion
    const onAnimationEnd = (e) => {
        if (e.animationName === 'fly') {
            // Animation complete
            isFlipping = false;
            flipBtn.disabled = false;
            flipBtn.style.cursor = 'pointer';
            flipBtn.style.transform = 'scale(1)';
            
            coin.removeEventListener('animationend', onAnimationEnd);
            coin.classList.remove('flipping');
            
            console.log('Animation ended, proceeding to stage 5');
            
            // Proceed to verification stage
            showStage(5);
            initStage5();
        }
    };

    coin.addEventListener('animationend', onAnimationEnd);
}

// ==================== Stage 5: Verification ====================
function initStage5() {
    const coin = coins[state.selectedCoin.id];
    const result = state.flipResult;

    const verificationCoinImage = document.getElementById('verificationCoinImage');
    const verificationResultTag = document.getElementById('verificationResultTag');
    const questionText = document.getElementById('questionText');
    const refFrontText = document.getElementById('refFrontText');
    const refBackText = document.getElementById('refBackText');

    const yesBtn = document.getElementById('verifyYesBtn');
    const noBtn = document.getElementById('verifyNoBtn');

    // Update reference box icons
    const refIcons = document.querySelectorAll('.ref-icon');
    refIcons[0].src = coin.frontImage;
    refIcons[1].src = coin.backImage;

    // Update result display
    if (result === 'front') {
        verificationCoinImage.src = coin.frontImage;
        verificationResultTag.textContent = '正面';
    } else {
        verificationCoinImage.src = coin.backImage;
        verificationResultTag.textContent = '反面';
    }

    // Get the choice associated with the result
    const choiceKey = state.bindings[result];
    const choiceValue = choiceKey === 'A' ? state.choices.choiceA : state.choices.choiceB;

    // Update question text
    questionText.textContent = `我看到是${result === 'front' ? '正面' : '反面'}。这是代表'${choiceValue}'吗？`;

    // Update reference - show binding relationships
    const frontChoice = state.bindings.front === 'A' ? state.choices.choiceA : state.choices.choiceB;
    const backChoice = state.bindings.back === 'A' ? state.choices.choiceA : state.choices.choiceB;
    refFrontText.textContent = frontChoice || '—';
    refBackText.textContent = backChoice || '—';

    // Button handlers
    yesBtn.addEventListener('click', () => {
        showStage(6);
        initStage6(choiceValue);
    });

    noBtn.addEventListener('click', () => {
        // Go directly to stage 4 to flip again, don't show alert or clear bindings
        showStage(4);
    });
}

// ==================== Stage 6: Celebration ====================
function initStage6(decision) {
    const finalDecision = document.getElementById('finalDecision');
    const startOverBtn = document.getElementById('startOverBtn');

    finalDecision.textContent = decision;

    startOverBtn.addEventListener('click', () => {
        // Clear bindings after showing result
        state.choices.choiceA = '';
        state.choices.choiceB = '';
        state.bindings.front = 'A';
        state.bindings.back = 'B';
        
        // Reset UI
        document.getElementById('choiceAInput').value = '';
        document.getElementById('choiceBInput').value = '';
        document.getElementById('summaryFrontValue').textContent = '—';
        document.getElementById('summaryBackValue').textContent = '—';
        document.querySelectorAll('.bind-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById('choiceAFrontBind').classList.add('active');
        document.getElementById('choiceBBackBind').classList.add('active');
        
        // Reset other state
        state.selectedCoin.id = 0;
        state.flipResult = null;

        // Go back to stage 1
        showStage(1);
    });
}

// ==================== Stage 0: Asset Preloading ====================
function initStage0() {
    // Collect all coin images to preload
    const imagesToLoad = [];
    coins.forEach(coin => {
        imagesToLoad.push(coin.frontImage, coin.backImage);
    });

    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    let loadedCount = 0;
    const totalImages = imagesToLoad.length;

    // Update progress function
    const updateProgress = (count) => {
        const percentage = Math.round((count / totalImages) * 100);
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        if (progressText) {
            progressText.textContent = `${percentage}%`;
        }
    };

    // Load images
    imagesToLoad.forEach((src, index) => {
        const img = new Image();
        img.onload = () => {
            loadedCount++;
            updateProgress(loadedCount);

            // Check if all images are loaded
            if (loadedCount === totalImages) {
                // Add a small delay for smooth transition
                setTimeout(() => {
                    showStage(1);
                }, 500);
            }
        };
        img.onerror = () => {
            // Even if there's an error, count it as loaded
            loadedCount++;
            updateProgress(loadedCount);

            if (loadedCount === totalImages) {
                setTimeout(() => {
                    showStage(1);
                }, 500);
            }
        };
        img.src = src;
    });
}

// ==================== Initialize App ====================
document.addEventListener('DOMContentLoaded', () => {
    // Start with preloading
    initStage0();

    // Initialize all stages
    initStage1();
    initStage2();
    initStage3();
    initStage4();

    // Stage 0 is already shown by default in HTML
});