<style>
.navbar {
    width: 300px;
}

@media only screen and (max-width: 600px) {
    .navbar {
        width: 100%;
    }
}
</style>
<template>
    <div class="flex w-full">
        <div class="flex-grow" id="container">
            <top-nav-bar></top-nav-bar>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {
    data: () => ({
    }),
    mounted() {

    }
};
</script>