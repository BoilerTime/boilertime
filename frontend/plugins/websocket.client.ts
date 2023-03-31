export default defineNuxtPlugin(() => {
    if (process.server) return
      
    let socket = new WebSocket("ws://localhost:3002")
  
    return {
      provide: {
        socket,
      },
    }
  })