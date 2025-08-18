<template>
  <div 
    ref="bubbleCanvas" 
    class="bubble-generator"
    @click="createBubble"
    @mousemove="handleMouseMove"
  >
    <div 
      v-for="(bubble, index) in bubbles" 
      :key="index" 
      class="bubble"
      :style="{
        left: `${bubble.x}px`,
        bottom: `${bubble.y}px`,
        width: `${bubble.size}px`,
        height: `${bubble.size}px`,
        backgroundColor: bubble.color,
        opacity: bubble.opacity,
        transform: `scale(${bubble.scale})`,
        animationDuration: `${bubble.duration}s`
      }"
      @animationend="removeBubble(index)"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  maxBubbles: {
    type: Number,
    default: 30
  },
  clickEnabled: {
    type: Boolean,
    default: true
  },
  mouseMoveEnabled: {
    type: Boolean,
    default: true
  },
  mouseMoveThrottle: {
    type: Number,
    default: 200
  }
});

const bubbleCanvas = ref(null);
const bubbles = ref([]);
const canvasWidth = ref(0);
const canvasHeight = ref(0);
let lastMouseMoveTime = 0;
let animationFrameId = null;

// Colors based on the theme
const bubbleColors = [
  'rgba(65, 184, 131, 0.7)',  // primary
  'rgba(53, 73, 94, 0.7)',    // secondary
  'rgba(0, 197, 142, 0.7)',   // accent
  'rgba(65, 184, 131, 0.5)',  // primary with more transparency
  'rgba(0, 197, 142, 0.5)',   // accent with more transparency
];

onMounted(() => {
  updateCanvasDimensions();
  window.addEventListener('resize', updateCanvasDimensions);
  startBubbleGeneration();
});

onUnmounted(() => {
  window.removeEventListener('resize', updateCanvasDimensions);
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});

function updateCanvasDimensions() {
  if (bubbleCanvas.value) {
    canvasWidth.value = bubbleCanvas.value.offsetWidth;
    canvasHeight.value = bubbleCanvas.value.offsetHeight;
  }
}

function createBubble(event = null) {
  if (bubbles.value.length >= props.maxBubbles) {
    return;
  }

  let x, y;
  
  if (event) {
    // Create bubble at click/mousemove position
    const rect = bubbleCanvas.value.getBoundingClientRect();
    x = event.clientX - rect.left;
    y = canvasHeight.value - (event.clientY - rect.top); // Convert to bottom-based coordinate
  } else {
    // Create bubble at random position
    x = Math.random() * canvasWidth.value;
    y = 0; // Start from bottom
  }

  const size = Math.random() * 40 + 20; // 20-60px
  const duration = Math.random() * 4 + 3; // 3-7s
  const color = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
  
  bubbles.value.push({
    x,
    y,
    size,
    color,
    opacity: Math.random() * 0.4 + 0.3, // 0.3-0.7
    scale: 1,
    duration
  });
}

function removeBubble(index) {
  bubbles.value.splice(index, 1);
}

function handleMouseMove(event) {
  if (!props.mouseMoveEnabled) return;
  
  const now = Date.now();
  if (now - lastMouseMoveTime > props.mouseMoveThrottle) {
    lastMouseMoveTime = now;
    if (Math.random() > 0.7) { // Only create bubbles 30% of the time
      createBubble(event);
    }
  }
}

function startBubbleGeneration() {
  const generateRandomBubble = () => {
    if (Math.random() > 0.95 && bubbles.value.length < props.maxBubbles / 2) {
      createBubble();
    }
    animationFrameId = requestAnimationFrame(generateRandomBubble);
  };
  
  generateRandomBubble();
}
</script>

<style scoped>
.bubble-generator {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 5;
}

.bubble {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  animation: rise-and-pop var(--duration, 5s) ease-in forwards;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5), 
              inset 0 0 10px rgba(255, 255, 255, 0.5);
}

@keyframes rise-and-pop {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  10% {
    transform: scale(1);
    opacity: var(--opacity, 0.5);
  }
  80% {
    opacity: var(--opacity, 0.5);
  }
  100% {
    transform: translateY(-100vh) scale(0.9);
    opacity: 0;
  }
}
</style>
