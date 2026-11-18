import { computed, ref, watch, type Ref } from 'vue'
import {
  columnsOf,
  filterFeatures,
  nextSort,
  paginate,
  sortFeatures,
  type TableSort,
} from '@/domain/attributeTable'
import type { FeatureCollection } from '@/domain/geojson'
import type { LayerDefinition } from '@/domain/layer'

const PAGE_SIZE = 50

/** Estado de la tabla de atributos de una capa: búsqueda, orden y página. */
export function useAttributeTable(
  layer: Ref<LayerDefinition | undefined>,
  data: Ref<FeatureCollection | undefined>,
) {
  const query = ref('')
  const sort = ref<TableSort | null>(null)
  const page = ref(1)

  const columns = computed(() =>
    layer.value && data.value ? columnsOf(data.value, layer.value.fields) : [],
  )
  const matching = computed(() => filterFeatures(data.value?.features ?? [], query.value))
  const sorted = computed(() => sortFeatures(matching.value, sort.value, columns.value))
  const current = computed(() => paginate(sorted.value, page.value, PAGE_SIZE))
  const total = computed(() => data.value?.features.length ?? 0)

  // Otra capa, otra búsqueda u otro orden: se vuelve a la primera página.
  watch(layer, () => {
    query.value = ''
    sort.value = null
  })
  watch([layer, query, sort], () => {
    page.value = 1
  })

  return {
    query,
    sort,
    columns,
    current,
    total,
    matchingCount: computed(() => matching.value.length),
    toggleSort: (key: string) => {
      sort.value = nextSort(sort.value, key)
    },
    goToPage: (target: number) => {
      page.value = target
    },
  }
}
