const server = Bun.serve({
    port: 3000,
    fetch(req) {
        return new Response("hello from server")
    }
})

console.log(`server listening on ${server.port}`)
