<template>
  <div class="todo">
    <div class="header">
      <div class="header__title">
        Todo list
      </div>

      <div class="header__filters">
        <div
            v-for="(filter, index) in filters"
            :key="index"
            class="btn-filter"
            :class="{'active': filter.value === activeFilter}"
            @click="activeFilter = filter.value"
        >
          <span>{{ filter.text }}</span>
        </div>
      </div>
    </div>

    <div class="todo__content">
      <form
          ref="todoForm"
          class="todo-form"
          @submit.prevent="createTodo"
      >
        <div class="input-btn-wrapper">
          <input
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
            @delete="deleteTodoHandle"
            @done="doneTodoHandle"
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
    const activeFilter = ref("all");
    const todoText = ref<string>("");

    const todoForm = ref('todoForm') as unknown as HTMLFormElement;
    const todoList = ref<TodoItemType[]>([{id: 1, value: "hello!", type: "process"}]);
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

      return activeFilter.value === "all" ?
          todoList.value :
          todoList.value.filter(el => el.type === activeFilter.value);
    });

    const createTodo = () => {
      if (todoText.value.trim() === "") {
        throw new Error("Я сумасшедший");
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
      console.log("CREATE", id, "id");
    }

    const deleteTodoHandle = (id: number): void => {
      const index = todoList.value.findIndex(el => el.id === id);
      console.log(index, "index delete");

      if (index != -1) {
        todoList.value.splice(index, 1);
      }
    }

    const doneTodoHandle = (id: number): void => {
      const index = todoList.value.findIndex(el => el.id === id);
      console.log("index", index)
      if (index != -1) {
        todoList.value[index].type = "done";
      }
      console.log(id, "done id ");
    }

    return {
      filters,
      todoForm,
      activeFilter,
      todoList,

      inputErr,
      todoText,
      getTodoListByFilter,

      createTodo,
      deleteTodoHandle,
      doneTodoHandle,
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

  & input {
    width: 100%;
    background-color: $secondary-color;
    border-radius: 26px;
    outline: none;
    border: none;
    font-family: inherit;
    font-size: 18px;
    padding: 12px 12px 12px 24px;
    box-sizing: border-box;
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