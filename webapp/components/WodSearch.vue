<template>
  <div class="space-y-4">
    <div class="flex flex-col sm:flex-row gap-3">
      <label class="input input-bordered flex items-center gap-2 flex-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="w-4 h-4 shrink-0 opacity-50"
        >
          <path
            fill-rule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clip-rule="evenodd"
          />
        </svg>
        <input v-model="searchQuery" type="text" class="grow" placeholder="Search movements, WOD type..." />
        <button v-if="searchQuery" @click="searchQuery = ''" class="btn btn-xs btn-ghost" tabindex="-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-3 h-3">
            <path
              fill-rule="evenodd"
              d="M4.22 4.22a.75.75 0 0 1 1.06 0L8 6.94l2.72-2.72a.75.75 0 1 1 1.06 1.06L9.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L8 9.06l-2.72 2.72a.75.75 0 0 1-1.06-1.06L6.94 8 4.22 5.28a.75.75 0 0 1 0-1.06Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </label>

      <select v-model="selectedType" class="select select-bordered w-full sm:w-48">
        <option value="">All types</option>
        <option v-for="type in WOD_TYPES" :key="type" :value="type">{{ type }}</option>
      </select>

      <div class="dropdown dropdown-end">
        <button class="btn btn-outline btn-soft w-full sm:w-auto">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4 shrink-0">
            <path
              fill-rule="evenodd"
              d="M2 3.75A.75.75 0 0 1 2.75 3h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 3.75ZM2 8a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 8Zm6 4.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Z"
              clip-rule="evenodd"
            />
          </svg>
          Movements
          <span v-if="selectedMovements.length" class="badge badge-sm">{{ selectedMovements.length }}</span>
        </button>
        <div
          class="dropdown-content card card-sm bg-base-100 shadow-lg z-10 max-h-72 overflow-y-auto w-64 border border-base-200 mt-1"
        >
          <div class="card-body p-3">
            <label
              v-for="movement in MOVEMENT_LIST"
              :key="movement"
              class="flex items-center gap-2 py-1 px-1 cursor-pointer hover:bg-base-200 rounded"
            >
              <input
                type="checkbox"
                :checked="selectedMovements.includes(movement)"
                @change="toggleMovement(movement)"
                class="checkbox checkbox-xs"
              />
              <span class="text-sm">{{ movement }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <div v-if="hasActiveFilters" class="flex flex-wrap gap-2 items-center">
      <span class="text-xs text-base-content/60">Filters:</span>
      <span
        v-for="movement in selectedMovements"
        :key="movement"
        class="badge badge-soft gap-1 cursor-pointer hover:badge-error transition-colors"
        @click="toggleMovement(movement)"
      >
        {{ movement }}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-3 h-3">
          <path
            fill-rule="evenodd"
            d="M4.22 4.22a.75.75 0 0 1 1.06 0L8 6.94l2.72-2.72a.75.75 0 1 1 1.06 1.06L9.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L8 9.06l-2.72 2.72a.75.75 0 0 1-1.06-1.06L6.94 8 4.22 5.28a.75.75 0 0 1 0-1.06Z"
            clip-rule="evenodd"
          />
        </svg>
      </span>
      <span
        v-if="selectedType"
        class="badge badge-soft gap-1 cursor-pointer hover:badge-error transition-colors"
        @click="selectedType = ''"
      >
        {{ selectedType }}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-3 h-3">
          <path
            fill-rule="evenodd"
            d="M4.22 4.22a.75.75 0 0 1 1.06 0L8 6.94l2.72-2.72a.75.75 0 1 1 1.06 1.06L9.06 8l2.72 2.72a.75.75 0 1 1-1.06 1.06L8 9.06l-2.72 2.72a.75.75 0 0 1-1.06-1.06L6.94 8 4.22 5.28a.75.75 0 0 1 0-1.06Z"
            clip-rule="evenodd"
          />
        </svg>
      </span>
      <button @click="clearAll" class="btn btn-ghost btn-xs text-primary">Clear all</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const searchQuery = defineModel<string>('searchQuery', { default: '' });
const selectedType = defineModel<string>('selectedType', { default: '' });
const selectedMovements = defineModel<string[]>('selectedMovements', { default: [] });

const WOD_TYPES = ['AMRAP', 'For Time', 'EMOM', 'E2MOM', 'RFT', 'NFT', 'Tabata'] as const;

const MOVEMENT_LIST = [
  'Bear Crawl',
  'Bench Press',
  'Bike',
  'Box Jump',
  'Burpee',
  'Chest to Bar',
  'Clean',
  'Deadlift',
  'Double Under',
  'Dumbbell Snatch',
  'Handstand Push-up',
  'Handstand Walk',
  'Jerk',
  'Kettlebell Swing',
  'Lunge',
  'Muscle-up',
  'Overhead Press',
  'Pistol',
  'Pull-up',
  'Push-up',
  'Rope Climb',
  'Row',
  'Run',
  'Snatch',
  'Squat',
  'Thruster',
  'Toes to Bar',
  'Turkish Get-up',
  'Wall Ball',
] as const;

const hasActiveFilters = computed(
  () => searchQuery.value !== '' || selectedType.value !== '' || selectedMovements.value.length > 0,
);

function toggleMovement(movement: string) {
  const idx = selectedMovements.value.indexOf(movement);
  if (idx !== -1) {
    selectedMovements.value = selectedMovements.value.filter((m: string) => m !== movement);
  } else {
    selectedMovements.value = [...selectedMovements.value, movement];
  }
}

function clearAll() {
  searchQuery.value = '';
  selectedType.value = '';
  selectedMovements.value = [];
}
</script>
