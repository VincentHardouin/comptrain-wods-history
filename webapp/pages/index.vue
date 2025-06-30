<template>
  <div class="min-h-screen bg-base-200">
    <!-- HERO -->
    <section class="py-20 text-center">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-5xl font-extrabold text-primary">🏋 CompTrain WOD History</h1>
        <p class="mt-4 text-xl text-gray-500">Explore and relive the toughest workouts from past sessions.</p>
      </div>
    </section>

    <!-- WODS GRID -->
    <section class="px-4 pb-20">
      <div class="max-w-7xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(wod, index) in workouts"
          :key="index"
          class="card shadow-xl hover:shadow-2xl transition duration-300 bg-white border border-base-300"
        >
          <div class="card-body">
            <h2 class="card-title text-primary-content text-xl font-bold">{{ wod.title }}</h2>
            <p class="whitespace-pre-wrap text-gray-700">{{ wod.content }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const { data: workouts } = await useFetch(`${config.public.API_URL}/workouts`)
</script>
