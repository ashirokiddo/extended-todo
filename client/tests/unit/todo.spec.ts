import {mount, shallowMount} from '@vue/test-utils'
import Home from "@/views/Home.vue";

describe('Todo testing',  () => {
    it('Adding an item to the list', async () => {
        const wrapper = mount(Home);
        expect(wrapper.findAll('.list-item')).toHaveLength(4);
        await wrapper.get('[data-test="input"]').setValue("My new todo");
        await wrapper.get('[data-test="form"]').trigger('submit')
        expect(wrapper.findAll('.list-item')).toHaveLength(5);
    });

    it('Remove an item from the list', async () => {
        const wrapper = mount(Home);
        expect(wrapper.findAll('.list-item')).toHaveLength(4);
        await wrapper.find('[data-test="remove-btn"]').trigger('click');
        expect(wrapper.findAll('.list-item')).toHaveLength(3);
    });

    it('Edit an item', async () => {
        const wrapper = mount(Home);
        expect(wrapper.findAll('.list-item')).toHaveLength(4);
        await wrapper.find('[data-test="edit-btn"]').trigger('click');
        const input = await wrapper.find('[data-test="edit-input"]');
        input.trigger('click');
        input.setValue("edited");

        await wrapper.find('[data-test="save-btn"]').trigger('click');
        expect(wrapper.find('[data-test="todo-content"]').text()).toBe("edited");
    });
})
