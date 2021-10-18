<template>
  <div class="todo">
    <div class="header">
      <div class="header__title">
        {{ activeFilter.text }}
      </div>

      <div class="header__filters">
        <div
            v-for="(filter, index) in filters"
            :key="index"
            class="btn-filter"
            :class="{'active': filter.value === activeFilter.value}"
            @click="activeFilter = filter"
        >
          <span>{{ filter.text }}</span>
        </div>
      </div>
    </div>

    <div class="todo__content">
      <form
          data-test="form"
          ref="todoForm"
          class="todo-form"
          @submit.prevent="createTodo"
      >
        <div class="input-btn-wrapper">
          <input
              data-test="input"
              type="text"
              v-model="todoText"
              placeholder="New task"
          >

          <div
              class="input-error"
              v-if="inputErr.isErr"
          >
            {{ inputErr.text }}
          </div>

          <button
              type="submit"
              class="btn btn-add"
          >
            <ion-icon name="add-outline"/>
          </button>
        </div>
      </form>

      <div class="list-wrapper">
        <todo-list
            class="list"
            :no-data-text="'Time todo something 😎'"
            :items="getTodoListByFilter"
            @delete="handleDeleteTodo"
            @edit="handleEditTodo"
            @done="handleDoneTodo"
        />
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import {computed, ref} from "vue";
import {TodoItemType} from "@/types";
import TodoList from "@/components/TodoList.vue";

export default {
  components: {
    TodoList,
  },
  setup() {
    const activeFilter = ref({
      text: "В процессе",
      value: "process",
    });

    const errTimerId = ref<number>(0);

    const todoText = ref<string>("");

    const todoForm = ref('todoForm') as unknown as HTMLFormElement;

    const todoList = ref<TodoItemType[]>([
      {id: 0, value: "hello!", type: "process"},
      {id: 1, value: "My name", type: "process"},
      {id: 2, value: "is", type: "process"},
      {id: 3, value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", type: "process"},
    ]);

    const inputErr = ref({
      isErr: true,
      text: "",
    });

    const filters = [
      {
        text: "В процессе",
        value: "process",
      },
      {
        text: "Готовые",
        value: "done",
      },
      {
        text: "Все",
        value: "all",
      },
    ];

    const getTodoListByFilter = computed(() => {
      return activeFilter.value.value === "all" ?
          todoList.value :
          todoList.value.filter(el => el.type === activeFilter.value.value);
    });

    const showTodoCreationErr = (text: string): void => {
      inputErr.value.text = text;
      inputErr.value.isErr = true;

      if (errTimerId.value) {
        clearTimeout(errTimerId.value);
      }

      errTimerId.value = setTimeout(() => {
        inputErr.value.text = "";
        inputErr.value.isErr = false;
      }, 3000);
    };

    const handleEditTodo = ({id, text}: { id: number, text: string, }) => {
      const index = todoList.value.findIndex(el => el.id === id);

      if (index != -1) {
        todoList.value[index].value = text;
      }
    }

    const createTodo = (): void => {
      if (todoText.value.trim() === "") {
        showTodoCreationErr("Нельзя сохранить пустое значение");
        return
      }

      // todo replace when server side will be done
      let id = Math.max(...todoList.value.map(el => el.id));
      id = id >= 0 ? id + 1 : 0;

      todoList.value.unshift({
        value: todoText.value,
        type: "process",
        id,
      });

      todoForm.value && todoForm.value.reset();
      todoText.value = "";
    }

    const handleDeleteTodo = (id: number): void => {
      const index = todoList.value.findIndex(el => el.id === id);

      if (index != -1) {
        todoList.value.splice(index, 1);
      }
    }

    const handleDoneTodo = (id: number): void => {
      const index = todoList.value.findIndex(el => el.id === id);
      if (index != -1) {
        todoList.value[index].type = "done";
      }
    }

    return {
      filters,
      todoForm,
      activeFilter,
      todoList,

      inputErr,
      todoText,
      getTodoListByFilter,

      handleEditTodo,
      createTodo,
      handleDeleteTodo,
      handleDoneTodo,
    }
  }
}
</script>


<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";

.todo {
  width: 1200px;
  background-color: #fff;
  border-radius: 5px;
  padding: 16px;
  box-sizing: border-box;
}

.list {
  height: 900px;

  &-wrapper {
    overflow: auto;
  }
}

.header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 24px;

  &__title {
    font-size: 26px;
    text-transform: capitalize;
  }

  &__filters {
    display: flex;

    & div {
      position: relative;
      user-select: none;
      cursor: pointer;
      border-radius: 5px;
      min-width: 94px;
      line-height: 26px;
      padding: 0 4px;
      text-align: center;
      border-bottom: 1px solid transparent;
      transition: border-bottom 0.1s ease-in-out;

      &:not(:last-child) {
        margin-right: 8px;
      }

      &.active {
        border-bottom: 1px solid !important;
      }
    }
  }
}

.input-btn-wrapper {
  position: relative;

  & .btn-add {
    background-color: transparent;
    position: absolute;
    top: 50%;
    right: 5px;
    transform: translateY(-50%);
    border-radius: 50%;

    & ion-icon {
      font-size: 22px;
      color: $main-text-color;
      transition: color 0.3s ease-in-out;
    }

    &:hover {
      background-color: darken($color: $secondary-color, $amount: 5);

      & ion-icon {
        color: darken($color: $main-text-color, $amount: 40);
      }
    }
  }

  & .input-error {
    position: absolute;
    left: 16px;
    top: 100%;
    color: #ff3709;
    transform: translateY(4px);
    font-size: 14px;
  }

  & input {
    padding: 12px 12px 12px 24px;
  }
}

.btn-filter {

  // process
  &:first-child {
    transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;
    background-color: $filter-process-color;
    color: #ff3709;

    &:hover {
      background-color: darken($color: $filter-process-color, $amount: 10);
      color: darken($color: #ff3709, $amount: 10);
    }
  }

  // done
  &:nth-of-type(2) {
    transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;
    background-color: $filter-done-color;
    color: #75ae6f;

    &:hover {
      background-color: darken($color: $filter-done-color, $amount: 5);
      color: darken($color: #75ae6f, $amount: 5);
    }
  }

  // all
  &:last-child {
    transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;
    background-color: $filter-all-color;
    color: #2667ed;

    &:hover {
      background-color: darken($color: $filter-all-color, $amount: 5);
      color: darken($color: #2667ed, $amount: 5);
    }
  }
}

.todo-form {
  margin-bottom: 24px;
}

</style>