<template>
    <div class="w-full mt-8">
            <div class="flex flex-wrap">
                <div class="w-full">
                    <div class="relative mx-4 md:mx-0 md:mr-4 z-0">
                        <span v-if="selectedIndex !== -1" class="absolute h-10 w-full bg-white rounded-lg shadow ease-out transition-transform transition-medium" :style="{ transform: `translateY(calc(100% * ${selectedIndex}))` }"></span>
                        <ul class="relative">
                            <side-nav-item
                                    v-for="(item, $i) in navigationItems"
                                    :key="item.link"
                                    :name="item.name"
                                    :icon="item.icon"
                                    :link="item.link"
                                    @click.native="selectedIndex = $i"
                            />
                        </ul>

                    </div>
                </div>
                <div class="w-full md:w-3/4 mt-4 md:mt-0">
                    <div class="ml-0 md:ml-4">
                        <router-view></router-view>
                    </div>
                </div>
            </div>
        </div>
</template>

<script>
    export default {
        data: () => ({
            navigationItems: [
                {
                    name: 'Password',
                    link: '/settings/password',
                    icon: 'shield'
                }
            ],
            selectedIndex: 0
        }),
        computed: {
            icon() {
                return this.$route.params.type;
            },
        },
        watch:{
            // This is a hack we need to do because any page can lead to this one.
            // And when we click on a button that isn't bound to this component, we still want to animate the white bar  to that page..
            $route (to, from){
                this.navigationItems.forEach((item, index) => {
                    if (this.isActive(item, to)) {
                        this.selectedIndex = index;
                    }
                })
            }
        },
        methods: {
            isActive({ link }, { path } = {}) {
                if (path) {
                    return path === link;
                }
                return this.$route.path === link;
            }
        },
        mounted() {
            this.navigationItems.forEach((item, index) => {
                if (this.isActive(item)) {
                    this.selectedIndex = index;
                }
            })
        }
    }
</script>

<style scoped>
</style>
