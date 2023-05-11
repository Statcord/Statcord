export const route = {
    method: 'GET',
    url: '/api/docs/json',
    handler: async (request, reply) => {
        reply.send(request.server.swagger());
    }
}