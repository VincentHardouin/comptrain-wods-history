<template>
  <div class="min-h-screen bg-base-200">
    <section class="py-16 sm:py-20 text-center">
      <div class="max-w-4xl mx-auto px-4">
        <h1 class="text-4xl sm:text-5xl font-extrabold text-primary">CompTrain WOD History</h1>
        <p class="mt-4 text-lg sm:text-xl text-base-content/60">
          Explore and relive the toughest workouts from past sessions.
        </p>
      </div>
    </section>

    <section class="px-4 pb-20 max-w-7xl mx-auto space-y-6">
      <WodSearch
        v-model:search-query="searchQuery"
        v-model:selected-type="selectedType"
        v-model:selected-movements="selectedMovements"
      />

      <p class="text-sm text-base-content/50">
        {{ filteredWorkouts.length }} result{{ filteredWorkouts.length !== 1 ? 's' : '' }}
        <span v-if="hasActiveFilters">(filtered)</span>
      </p>

      <div v-if="filteredWorkouts.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(wod, index) in filteredWorkouts"
          :key="wod.id || index"
          class="card shadow-sm hover:shadow-md transition-shadow duration-300 bg-white border border-base-300"
        >
          <div class="card-body">
            <h2 class="card-title text-xl font-bold">{{ wod.title }}</h2>
            <p class="whitespace-pre-wrap text-base-content/70 text-sm leading-relaxed">{{ wod.content }}</p>
          </div>
        </div>
      </div>

      <div
        v-else
        class="text-center py-20 text-base-content/40"
      >
        <p class="text-lg">No WODs match your search criteria.</p>
        <button @click="clearFilters" class="btn btn-primary btn-sm mt-4">
          Reset filters
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void
  }
}

interface Workout {
  id: number
  createdAt: string
  updatedAt: string
  title: string
  content: string | null
}

interface EnrichedWorkout extends Workout {
  parsedTypes: string[]
  parsedMovements: string[]
}

const config = useRuntimeConfig()
const { data: workouts } = await useFetch<Workout[]>(`${config.public.API_URL}/workouts`)

const route = useRoute()
const router = useRouter()

const searchQuery = ref('')
const selectedType = ref('')
const selectedMovements = ref<string[]>([])

onMounted(() => {
  if (route.query.q) searchQuery.value = route.query.q as string
  if (route.query.type) selectedType.value = route.query.type as string
  if (route.query.movements) {
    selectedMovements.value = (route.query.movements as string).split(',').filter(Boolean)
  }
})

const WOD_TYPE_PATTERNS: { label: string; patterns: string[] }[] = [
  { label: 'AMRAP', patterns: ['AMRAP', 'As Many Rounds As Possible'] },
  { label: 'For Time', patterns: ['for time'] },
  { label: 'EMOM', patterns: ['EMOM', 'Every Minute On the Minute'] },
  { label: 'E2MOM', patterns: ['E2MOM', 'Every 2 Minutes'] },
  { label: 'RFT', patterns: ['RFT', 'Rounds For Time', 'rounds for time'] },
  { label: 'NFT', patterns: ['NFT', 'Not For Time'] },
  { label: 'Tabata', patterns: ['Tabata'] },
]

const MOVEMENTS = [
  'Thruster', 'Pull-up', 'Deadlift', 'Box Jump', 'Double Under',
  'Clean', 'Jerk', 'Snatch', 'Burpee', 'Push-up',
  'Toes to Bar', 'Wall Ball', 'Row', 'Run', 'Bike',
  'Rope Climb', 'Handstand Push-up', 'Muscle-up', 'Kettlebell Swing', 'Lunge',
  'Squat', 'Bench Press', 'Overhead Press', 'Pistol',
  'Bar Muscle-up', 'Ring Muscle-up', 'Chest to Bar', 'Turkish Get-up',
  'Bear Crawl', 'Handstand Walk', 'Dumbbell Snatch',
]

function parseWodType(content: string): string[] {
  if (!content) return []
  const lower = content.toLowerCase()
  return WOD_TYPE_PATTERNS
    .filter(({ patterns }) => patterns.some(p => lower.includes(p.toLowerCase())))
    .map(({ label }) => label)
}

function parseMovements(content: string): string[] {
  if (!content) return []
  const lower = content.toLowerCase()
  return MOVEMENTS.filter(m => lower.includes(m.toLowerCase()))
}

const enrichedWorkouts = computed<EnrichedWorkout[]>(() =>
  (workouts.value || []).map(wod => ({
    ...wod,
    parsedTypes: parseWodType(wod.content || ''),
    parsedMovements: parseMovements(wod.content || ''),
  }))
)

const hasActiveFilters = computed(() =>
  searchQuery.value !== '' || selectedType.value !== '' || selectedMovements.value.length > 0
)

const filteredWorkouts = computed<EnrichedWorkout[]>(() =>
  enrichedWorkouts.value.filter(wod => {
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      if (!wod.title.toLowerCase().includes(q) && !(wod.content || '').toLowerCase().includes(q)) {
        return false
      }
    }
    if (selectedType.value && !wod.parsedTypes.includes(selectedType.value)) {
      return false
    }
    if (selectedMovements.value.length) {
      if (!selectedMovements.value.every(m => wod.parsedMovements.includes(m))) {
        return false
      }
    }
    return true
  })
)

watch([searchQuery, selectedType, selectedMovements], () => {
  const query: Record<string, string> = {}
  if (searchQuery.value) query.q = searchQuery.value
  if (selectedType.value) query.type = selectedType.value
  if (selectedMovements.value.length) query.movements = selectedMovements.value.join(',')
  router.replace({ query })

  if (typeof window === 'undefined' || !window.plausible) return
  window.plausible('filter', {
    props: {
      search: searchQuery.value || '(none)',
      type: selectedType.value || '(none)',
      movements: selectedMovements.value.length ? selectedMovements.value.join(', ') : '(none)',
    },
  })
})

function clearFilters() {
  searchQuery.value = ''
  selectedType.value = ''
  selectedMovements.value = []
}
</script>
