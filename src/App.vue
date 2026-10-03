<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <main class="container">
    <div class="card">
      <p class="badge">CI/CD DEMO</p>

      <h1>My First CI/CD Deployment</h1>

      <p>
        This Vue application was deployed automatically using
        GitHub Actions.
      </p>

      <button @click="count++">
        Clicked {{ count }} times
      </button>

      <div class="status">
        <span class="dot"></span>
        Deployment successful
      </div>
    </div>
  </main>
</template>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #cae0d5;
  font-family: Arial, sans-serif;
}

.card {
  width: 500px;
  padding: 50px;
  border-radius: 20px;
  background: #1e293b;
  color: white;
  text-align: center;
}

.badge {
  color: #c6dde7;
  font-weight: bold;
  letter-spacing: 2px;
}

h1 {
  font-size: 36px;
  color: transparent;
}

p {
  color: #cbd5e1;
  line-height: 1.6;
}

button {
  margin-top: 20px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background: #38bdf8;
  color: #0f172a;
  font-weight: bold;
  cursor: pointer;
}

.status {
  margin-top: 30px;
  color: #94a3b8;
}

.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  background: #22c55e;
  border-radius: 50%;
  margin-right: 8px;
}
</style>