export const route = {
    method: 'GET',
    url: '/siteApi/docs/json',
    handler: async (request, reply) => {
        reply.send(request.server.swagger());
    }
}