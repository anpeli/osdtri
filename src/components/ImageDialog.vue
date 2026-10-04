<template>
  <button
    class="image-dialog__trigger"
    type="button"
    :aria-label="`Visa större: ${alt}`"
    @click="openDialog"
  >
    <slot />
  </button>

  <Teleport to="body">
    <dialog
      ref="dialog"
      class="image-dialog"
      aria-label="Fotovisare"
      @keydown.esc.prevent="closeDialog"
    >
      <button
        class="image-dialog__close"
        type="button"
        aria-label="Stäng"
        @click="closeDialog"
      >
      </button>
      <img class="image-dialog__image" :src="src" :alt="alt" />
    </dialog>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    required: true
  }
})

const dialog = ref(null)

const openDialog = () => {
  dialog.value?.showModal()
}

const closeDialog = () => {
  dialog.value?.close()
}
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
.image-dialog__close:focus-visible {
  outline: 3px solid var(--club-lime);
  outline-offset: 3px;
}

.image-dialog__trigger :slotted(img) {
  display: block;
  width: 100%;
  height: auto;
  transition: transform 180ms ease;
}

.image-dialog__trigger:hover :slotted(img) {
  transform: scale(1.025);
}

.image-dialog {
  position: fixed;
  inset: 50% auto auto 50%;
  display: flex;
  width: min(94vw, 1440px);
  height: 92vh;
  height: 92dvh;
  max-height: 1000px;
  margin: 0;
  padding: 3rem;
  overflow: hidden;
  transform: translate(-50%, -50%);
  background: var(--club-charcoal);
  border: 0;
  border-radius: 12px;
  box-shadow: 0 12px 48px rgb(0 0 0 / 35%);
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
    transform: translate(-50%, -48%) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@media (max-width: 600px) {
  .image-dialog {
    inset: auto 0 0;
    width: 100%;
    height: min(90vh, 900px);
    height: min(90dvh, 900px);
    max-height: 90vh;
    max-height: 90dvh;
    margin: 0;
    padding: 3.5rem 1rem 1.5rem;
    transform: none;
    border-radius: 16px 16px 0 0;
  }

  .image-dialog[open] {
    animation: image-sheet-in 220ms ease-out;
  }

  .image-dialog__close {
    top: 0.5rem;
    right: 0.75rem;
  }
}

@keyframes image-sheet-in {
  from {
    opacity: 0;
    transform: translateY(100%);
  }

  to {
    opacity: 1;
    transform: translateY(0);
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
