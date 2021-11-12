<template>
  <div>
    <h1>Comptrain Wod Scraping</h1>
    <div v-for="workout in workouts" :key="workout.id" class="workout">
      <h2>{{ workout.title }}</h2>
      <pre>{{ workout.content }}</pre>
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
