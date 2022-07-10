<template>
  <div class="index">
    <h1>Comptrain Wod Scraping</h1>
    <div class="workouts">
      <div v-for="workout in workouts" :key="workout.id" class="workout">
        <h2>{{ workout.title }}</h2>
        <pre>{{ workout.content }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ $axios, $config }) {
    const workouts = await $axios.$get(`${$config.apiUrl}/workouts`);
    return { workouts };
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}

.index {
  padding: 15px;
  background: #556270;
  background: linear-gradient(45deg, #f1f1f1ff, #fbd8d8ff);
}

.workouts {
  display: flex;
  flex-direction: column;
  gap: 21px;
}

.workout {
  background-color: #ffff;
  padding: 28px 21px;
  width: 250px;
  display: flex;
  flex-direction: column;
  overflow-wrap: break-word;
  border-radius: 14px;
}

.workout h2 {
  margin-top: 0;
}
</style>
