export default defineNuxtPlugin((nuxtApp) => {
    const mode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    return {
        provide: {
            isDarkMode: mode
        }
    }
})