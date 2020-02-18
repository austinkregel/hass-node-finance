<template>
    <div class="w-full">
        <div class="flex flex-wrap items-center justify-between">
            <div class="text-base text-gray-700 uppercase font-medium">
                Change your password
            </div>
        </div>

        <div class="shadow p-4 mt-4 bg-white rounded">
            <div class="w-full md:w-3/4 mx-auto flex flex-wrap">
                <div class="w-full flex md:items-center mb-6">
                    <div class="md:w-1/4">
                        <label class="block w-full text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="inline-username">
                            Current Password
                        </label>
                    </div>
                    <div class="md:w-3/4">
                        <input v-model="form.password" class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"  type="password" placeholder="************">
                    </div>
                </div>
                <div class="w-full flex md:items-center mb-6">
                    <div class="md:w-1/4">
                        <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="inline-username">
                            New Password
                        </label>
                    </div>
                    <div class="md:w-3/4">
                        <input v-model="form.password_confirm" class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" type="password" placeholder="************">
                    </div>
                </div>
                <div class="w-full flex md:items-center mb-6">
                    <div class="md:w-1/4">
                        <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" for="inline-username">
                            Confirm New Password
                        </label>
                    </div>
                    <div class="md:w-3/4">
                        <input v-model="form.new_password_confirm" class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500" type="password" placeholder="************">
                    </div>
                </div>

                <div class="w-full flex flex-wrap">
                    <div class="w-full md:w-1/4">&nbsp;</div>
                    <div class="w-full md:w-3/4">
                        <button type="submit" class="bg-blue-500 py-1 px-4 text-blue-100 rounded-lg">
                            Update
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data: () => ({
            social: {
                googleRedirectUrl: ''
            },
            form: {
                password: '',
                new_password: '',
                new_password_confirm: '',
            }
        }),
        async created() {

        }
    }
</script>

<style scoped>
</style>
