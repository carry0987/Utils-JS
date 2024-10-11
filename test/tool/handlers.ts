import { http } from 'msw';

export const handlers = [
    http.get('http://localhost/api/test', () => {
        let responseData = { message: 'GET request successful' };

        return new Response(JSON.stringify(responseData), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }),

    http.post('http://localhost/api/test', () => {
        let responseData = { message: 'POST request successful' };

        return new Response(JSON.stringify(responseData), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    })
];
