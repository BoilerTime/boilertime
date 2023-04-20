export default defineNuxtPlugin(() => {
    if (process.server) return
      
    let socket = new WebSocket("wss://ws.boilerti.me")
  
    return {
      provide: {
        socket,
      },
    }
  })