<template>
  <div class="list-item">
    <div
        class="flag"
        :class="[item.type === 'done' ? 'flag-done' : 'flag-process']"
    />

    <div
        class="content"
        :class="{
          'edit': isEdit
        }"
    >
      <div v-if="isEdit">
        <input
            data-test="edit-input"
            type="text"
            v-model="editText"
        >
      </div>
      <div
          v-else
          data-test="todo-content"
      >
        {{ item.value }}
      </div>
    </div>

    <div
        v-if="isShowActions"
        class="actions-wrapper"
    >
      <div
          v-if="isEdit"
          class="actions"
      >
        <button
            @click="closeEdit"
            class="btn btn-action"
        >
          <ion-icon name="close-outline"></ion-icon>
        </button>

        <button
            @click="saveEdit"
            data-test="save-btn"
            class="btn btn-action"
        >
          <ion-icon name="checkmark-outline"/>
        </button>
      </div>

      <div
          class="actions"
          v-else
      >
        <button
            @click="$emit('delete', item.id)"
            data-test="remove-btn"
            class="btn btn-action"
        >
          <ion-icon name="trash-outline"/>
        </button>

        <button
            @click="showEdit"
            data-test="edit-btn"
            class="btn btn-action"
        >
          <ion-icon name="pencil-outline"/>
        </button>

        <button
            @click="$emit('done', item.id)"
            class="btn btn-action"
        >
          <ion-icon name="checkmark-outline"/>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType, ref} from "vue";
import {TodoItemType} from "@/types";

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<TodoItemType>,
      required: true
    },
    isShowActions: {
      type: Boolean,
      default: true
    }
  },

  setup(props: { item: TodoItemType }, context: any) {
    const isEdit = ref<boolean>(false);
    const editText = ref<string>("");

    const closeEdit = (): void => {
      isEdit.value = false;
      editText.value = "";
    };

    const saveEdit = (): void => {
      context.emit('edit', {
        id: props.item.id,
        text: editText.value,
      });

      closeEdit();
    }

    const showEdit = (): void => {
      editText.value = `${props.item.value}`;
      isEdit.value = true;
    };

    return {
      isEdit,
      editText,

      closeEdit,
      showEdit,
      saveEdit,
    }
  }
})
</script>

<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";

.list-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 4px 28px;
  width: 100%;
  box-sizing: border-box;
  min-height: 48px;

  &:not(:last-child) {
    margin-bottom: 4px;
  }

  & .content {
    width: fill-available;
    line-height: 20px;
    font-size: 18px;
    padding: 0 16px;

    &.edit {
      margin-left: -16px;
    }

    & input {
      padding: 8px 12px 8px 24px;
    }
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

.actions-wrapper {
  align-self: flex-start;
}

.flag {
  position: absolute;
  width: 20px;
  height: 20px;
  left: 5px;
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);

  &-done {
    background-color: $filter-done-color;
  }

  &-process {
    background-color: $filter-process-color;
  }
}
</style>