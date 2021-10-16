<template>
  <div class="list">
    <div
        v-if="!items.length"
        class="no-data"
    >
      {{ noDataText }}
    </div>

    <div
        v-for="item in items"
        :key="item.id"
        class="list__item"
    >
      <div
          class="flag"
          :class="[item.type === 'done' ? 'flag-done' : 'flag-process']"
      />

      <div class="content">
        {{ item.value }}
      </div>

      <div class="actions">
        <button
            @click="$emit('delete', item.id)"
            class="btn btn-action"
        >
          <ion-icon name="trash-outline"></ion-icon>
        </button>

        <button
            @click="$emit('done', item.id)"
            class="btn btn-action"
        >
          <ion-icon name="checkmark-outline"></ion-icon>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {TodoItemType} from "@/types";

export default defineComponent({
  name: 'todo-list',
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
  setup(props: { items: TodoItemType[] }) {
    console.log(props.items, "items");

    return {}
  }
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";

.list {
  &__item {
    position: relative;
    display: flex;
    align-items: flex-start;
    padding: 4px 28px;
    width: 100%;
    box-sizing: border-box;

    & .content {
      width: fill-available;
      line-height: 20px;
      font-size: 18px;
      padding: 0 16px;
    }

    & .actions {
      display: flex;

      & .btn-action {
        background-color: transparent;
        font-size: 22px;
        color: $main-text-color;
        border-radius: 50%;

        &:hover {
          background-color: $secondary-color;
          color: darken($color: $main-text-color, $amount: 5);
        }

        &:not(:last-child) {
          margin-right: 8px;
        }
      }
    }
  }
}

.flag {
  position: absolute;
  width: 20px;
  height: 20px;
  left: 5px;
  border-radius: 50%;
  top: 4px;

  &-done {
    background-color: $filter-done-color;
  }

  &-process {
    background-color: $filter-process-color;
  }
}

.no-data {
  padding: 12px 0;
  text-align: center;
  user-select: none;
}
</style>