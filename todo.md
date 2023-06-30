- re-add swagger
    - old route file
    ```js
    export const route = {
        method: 'GET',
        url: '/siteApi/docs/json',
        handler: async (request, reply) => {
            reply.send(request.server.swagger());
        }
    }
    ```
    - [fastify-swagger convert code](https://github.com/fastify/fastify-swagger/blob/f8918a400930d8104257d6c3f7c921d8ee6ba039/lib/spec/swagger/index.js)
    - meta tags
    - docker
    - use middleware/plugin/module for user auth instead of api route
    - rename siteApi back to api
    - fill in settings page
    - set settings page