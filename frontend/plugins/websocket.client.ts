export default defineNuxtPlugin(() => {
    if (process.server) return
      
    let socket = new WebSocket("ws://localhost:8443")
  
    return {
      provide: {
        socket,
      },
    }
  })