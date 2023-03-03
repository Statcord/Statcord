export const route = {
    method: 'GET',
    url: '/api/main',
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    ok: { type: 'boolean' }
                }
            }
        }
    },
    handler: async (request, reply) => {
        reply.send({
            ok: true
        })
    }
}