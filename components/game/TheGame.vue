<template>
  <div
    ref="wrapperRef"
    class="canvas-wrapper relative w-full max-w-[800px] aspect-square"
  >
    <canvas
      ref="canvasRef"
      class="absolute top-0 left-0 w-full h-full"
      @click="handleClick"
      @mousemove="handleMouseMove"
      @mouseleave="resetParallax"
    />
  </div>
</template>

<script setup lang="ts">
import { gameLevelToSizeMap } from '@typings/Game.model';

const { imagesForGame, gameLevel, selectImage } = useGame();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const wrapperRef = ref<HTMLDivElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);

const tilt = 20;
const cellPadding = 12;
const mousePos = ref({ x: -9999, y: -9999 });
const hoverIndex = ref<number | null>(null);

let cols = 0;
let rows = 0;
let cellWidth = 0;
let cellHeight = 0;

const imageCache = new Map<string, HTMLImageElement>();

function preloadImages(): Promise<void> {
  return new Promise((resolve) => {
    let loadedCount = 0;
    const total = imagesForGame.value.length;

    imagesForGame.value.forEach((image) => {
      if (!imageCache.has(image.id)) {
        const img = new Image();
        img.src = image.image;
        img.onload = () => {
          imageCache.set(image.id, img);
          loadedCount++;
          if (loadedCount === total) resolve();
        };
        img.onerror = () => {
          loadedCount++;
          if (loadedCount === total) resolve();
        };
      } else {
        loadedCount++;
        if (loadedCount === total) resolve();
      }
    });
  });
}

function setupCanvas() {
  const canvas = canvasRef.value!;
  const wrapper = wrapperRef.value!;
  const dpr = window.devicePixelRatio || 1;

  const width = wrapper.offsetWidth;
  const height = wrapper.offsetHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';

  const context = canvas.getContext('2d')!;
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.scale(dpr, dpr);
  ctx.value = context;

  const sizeMap = gameLevelToSizeMap[gameLevel.value].split('x').map(Number);
  cols = sizeMap[0];
  rows = sizeMap[1];

  cellWidth = width / cols;
  cellHeight = height / rows;

  draw();
}

function draw() {
  const canvas = canvasRef.value!;
  const context = ctx.value;
  if (!canvas || !context) return;

  const width = canvas.width / (window.devicePixelRatio || 1);
  const height = canvas.height / (window.devicePixelRatio || 1);

  context.clearRect(0, 0, width, height);

  imagesForGame.value.forEach((image, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);

    const x = col * cellWidth + cellPadding / 2;
    const y = row * cellHeight + cellPadding / 2;
    const w = cellWidth - cellPadding;
    const h = cellHeight - cellPadding;

    const centerX = x + w / 2;
    const centerY = y + h / 2;

    context.save();

    const gradient = context.createRadialGradient(
      x + w / 2,
      y + h / 2,
      10,
      x + w / 2,
      y + h / 2,
      w
    );
    const baseColor = image.rarity.color;
    gradient.addColorStop(0, `${baseColor}${image.solved ? 'ff' : '66'}`);
    gradient.addColorStop(1, '#180802');
    context.fillStyle = gradient;
    context.fillRect(x, y, w, h);

    if (image.solved) {
      context.strokeStyle = '#127c20';
      context.lineWidth = 3;
      context.strokeRect(x + 1, y + 1, w - 2, h - 2);
    }

    context.restore();
    const img = imageCache.get(image.id);
    if (img) {
      context.save();

      context.beginPath();
      context.roundRect(x + 3, y + 3, w - 6, h - 6, 0);
      context.clip();

      context.translate(centerX, centerY);
      if (hoverIndex.value === index) {
        const dx = mousePos.value.x - centerX;
        const dy = mousePos.value.y - centerY;

        const rotateX = (dy / h) * -tilt;
        const rotateY = (dx / w) * tilt;

        const radX = (rotateX * Math.PI) / 180;
        const radY = (rotateY * Math.PI) / 180;

        const shearX = Math.tan(radY);
        const shearY = Math.tan(radX);

        context.shadowColor = 'rgba(0,0,0,0.25)';
        context.shadowBlur = 12;
        context.shadowOffsetX = shearX * 15;
        context.shadowOffsetY = shearY * 15;

        context.transform(1, shearY * 0.5, shearX * 0.5, 1, 0, 0);
        context.scale(1.05, 1.05);
      }

      context.translate(-w / 2, -h / 2);

      const imgRatio = img.width / img.height;
      let drawWidth = w;
      let drawHeight = h;

      if (imgRatio > 1) {
        drawHeight = w / imgRatio;
      } else {
        drawWidth = h * imgRatio;
      }

      context.drawImage(
        img,
        (w - drawWidth) / 2,
        (h - drawHeight) / 2,
        drawWidth,
        drawHeight
      );

      context.shadowColor = 'transparent';
      context.shadowBlur = 0;
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;

      context.restore();
    }

    if (!image.selected && !image.solved) {
      context.fillStyle = '#180802';
      context.fillRect(x, y, w, h);
      context.globalAlpha = 1;
    }
  });
}

function getIndexFromPosition(x: number, y: number): number | null {
  const col = Math.floor(x / cellWidth);
  const row = Math.floor(y / cellHeight);
  const index = row * cols + col;
  return index >= 0 && index < imagesForGame.value.length ? index : null;
}

function getMousePos(e: MouseEvent) {
  const canvas = canvasRef.value!;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  };
}

function handleClick(e: MouseEvent) {
  const pos = getMousePos(e);
  const index = getIndexFromPosition(pos.x, pos.y);
  if (index !== null) {
    const image = imagesForGame.value[index];
    selectImage(image);
    draw();
  }
}

function handleMouseMove(e: MouseEvent) {
  const pos = getMousePos(e);
  mousePos.value = pos;
  hoverIndex.value = getIndexFromPosition(pos.x, pos.y);
  draw();
}

function resetParallax() {
  hoverIndex.value = null;
  draw();
}

function loop() {
  draw();
  requestAnimationFrame(loop);
}

onMounted(async () => {
  await preloadImages();
  setupCanvas();
  loop();
  window.addEventListener('resize', setupCanvas);
});

onUnmounted(() => {
  window.removeEventListener('resize', setupCanvas);
});

watch(imagesForGame, async () => {
  await preloadImages();
  draw();
});

watch(gameLevel, () => {
  setupCanvas();
  draw();
});
</script>

<style lang="scss" scoped>
canvas {
  display: block;
}
.canvas-wrapper {
  max-width: 800px;
  aspect-ratio: 1 / 1;
  position: relative;
  width: 100%;
}
</style>
