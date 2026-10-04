<template>
  <button
    v-if="$slots.default"
    class="image-dialog__trigger"
    type="button"
    :aria-label="`Visa större: ${alt}`"
    @click="openFromTrigger"
  >
    <slot />
  </button>

  <Teleport to="body">
    <dialog
      ref="dialog"
      class="image-dialog"
      aria-label="Fotovisare"
      @keydown.esc.prevent="closeDialog"
      @keydown.arrow-left.prevent="showPrevious"
      @keydown.arrow-right.prevent="showNext"
      @close="restorePageScroll"
    >
      <button
        v-if="activeImages.length > 1"
        class="image-dialog__navigate image-dialog__previous"
        type="button"
        aria-label="Visa föregående bild"
        :disabled="currentIndex === 0"
        @click="showPrevious"
      >
        <span aria-hidden="true"></span>
      </button>
      <button
        v-if="activeImages.length > 1"
        class="image-dialog__navigate image-dialog__next"
        type="button"
        aria-label="Visa nästa bild"
        :disabled="currentIndex === activeImages.length - 1"
        @click="showNext"
      >
        <span aria-hidden="true"></span>
      </button>
      <button
        class="image-dialog__close"
        type="button"
        aria-label="Stäng"
        @click="closeDialog"
      >
      </button>
      <img
        :key="currentImage.src"
        class="image-dialog__image"
        :src="currentImage.src"
        :alt="currentImage.alt"
      />
    </dialog>
  </Teleport>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'

defineOptions({ name: 'ImageDialog' })

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  },
  images: {
    type: Array,
    default: () => []
  },
  index: {
    type: Number,
    default: 0
  }
})

const dialog = ref(null)
const activeImages = ref([])
const currentIndex = ref(0)
const currentImage = computed(() => activeImages.value[currentIndex.value] || { src: '', alt: '' })
let previousOverflow = null

const lockPageScroll = () => {
  if (previousOverflow !== null) return

  previousOverflow = document.documentElement.style.overflow
  document.documentElement.style.overflow = 'hidden'
}

const restorePageScroll = () => {
  if (previousOverflow === null) return

  document.documentElement.style.overflow = previousOverflow
  previousOverflow = null
}

const openDialog = (images = props.images, index = props.index) => {
  activeImages.value = images.length ? images : [{ src: props.src, alt: props.alt }]
  currentIndex.value = Math.max(0, Math.min(index, activeImages.value.length - 1))
  dialog.value?.showModal()
  lockPageScroll()
}

const openFromTrigger = () => openDialog()

const showPrevious = () => {
  if (currentIndex.value > 0) currentIndex.value -= 1
}

const showNext = () => {
  if (currentIndex.value < activeImages.value.length - 1) currentIndex.value += 1
}

const closeDialog = () => {
  dialog.value?.close()
}

onBeforeUnmount(restorePageScroll)

defineExpose({ open: openDialog })
</script>

<style scoped>
.image-dialog__trigger {
  display: block;
  width: 100%;
  padding: 0;
  overflow: hidden;
  background: none;
  border: 0;
  border-radius: 0;
  color: inherit;
  font: inherit;
  text-align: inherit;
  cursor: zoom-in;
}

.image-dialog__trigger:focus-visible,
.image-dialog__navigate:focus-visible,
.image-dialog__close:focus-visible {
  outline: 3px solid var(--club-lime);
  outline-offset: 3px;
}

.image-dialog__trigger :slotted(img) {
  transition: transform 180ms ease;
}

.image-dialog__trigger:hover :slotted(img) {
  transform: scale(1.025);
}

.image-dialog {
  position: fixed;
  inset: 0;
  display: flex;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  max-width: none;
  max-height: none;
  margin: 0;
  padding: 3rem;
  overflow: hidden;
  transform: none;
  background: var(--club-charcoal);
  border: 0;
  border-radius: 0;
  color: #ffffff;
}

.image-dialog:not([open]) {
  display: none;
}

.image-dialog[open] {
  animation: image-dialog-in 180ms ease-out;
}

.image-dialog::backdrop {
  background: rgb(0 0 0 / 68%);
}

.image-dialog__close {
  position: absolute;
  z-index: 1;
  top: 0.75rem;
  right: 0.75rem;
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  place-items: center;
  appearance: none;
  background: rgb(32 37 42 / 82%);
  border: 1px solid rgb(255 255 255 / 30%);
  border-radius: 50%;
  cursor: pointer;
}

.image-dialog__navigate {
  position: absolute;
  z-index: 1;
  top: 0.75rem;
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  place-items: center;
  appearance: none;
  background: rgb(32 37 42 / 82%);
  border: 1px solid rgb(255 255 255 / 30%);
  border-radius: 50%;
  cursor: pointer;
}

.image-dialog__previous {
  left: 0.75rem;
}

.image-dialog__next {
  left: 4rem;
}

.image-dialog__navigate span {
  width: 0.65rem;
  height: 0.65rem;
  border-right: 2px solid #ffffff;
  border-bottom: 2px solid #ffffff;
}

.image-dialog__previous span {
  transform: translateX(2px) rotate(135deg);
}

.image-dialog__next span {
  transform: translateX(-2px) rotate(-45deg);
}

.image-dialog__navigate:disabled {
  opacity: 0.4;
  cursor: default;
}

.image-dialog__close::before,
.image-dialog__close::after {
  position: absolute;
  width: 1.1rem;
  height: 2px;
  background: #ffffff;
  border-radius: 1px;
  content: '';
}

.image-dialog__close::before {
  transform: rotate(45deg);
}

.image-dialog__close::after {
  transform: rotate(-45deg);
}

.image-dialog__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

@keyframes image-dialog-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@media (max-width: 600px) {
  .image-dialog {
    padding: 3.5rem 1rem 1rem;
  }

  .image-dialog__close {
    top: 0.5rem;
    right: 0.75rem;
  }

  .image-dialog__navigate {
    top: 0.5rem;
  }

  .image-dialog__previous {
    left: 0.75rem;
  }

  .image-dialog__next {
    left: 4rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .image-dialog__trigger :slotted(img) {
    transition: none;
  }

  .image-dialog[open] {
    animation: none;
  }
}
</style>
