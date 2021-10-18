<template>
  <div class="list">
    <div
        v-if="!items.length"
        class="no-data"
    >
      {{ noDataText }}
    </div>

    <todo-list-item
        v-for="item in items"
        :key="item.id"
        :item="item"
        :is-show-actions="item.type !== 'done'"
        @delete="$emit('delete', $event)"
        @edit="$emit('edit', $event)"
        @done="$emit('done', $event)"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType, ref} from "vue";
import {TodoItemType} from "@/types";
import TodoListItem from "@/components/TodoListItem.vue";

export default defineComponent({
  name: 'todo-list',
  components: {
    TodoListItem
  },
  props: {
    items: {
      type: Array as PropType<TodoItemType[]>,
      default: function (): TodoItemType[] {
        return []
      },
      required: true
    },
    noDataText: {
      type: String,
      default: "no data",
    },
  },
  setup() {
    return {}
  }
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";

.no-data {
  padding: 12px 0;
  text-align: center;
  user-select: none;
}
</style>