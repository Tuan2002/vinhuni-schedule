"use server";
import redis from '@/libs/redis';

const getAccessToken = async () : Promise<string | null> => {
    try {
        let token: string | null = await redis.get('access_token');
        if (!token) {
            const AUTH_SERVER_URL = process.env.AUTH_SERVER_URL;
            const CLIENT_ID = process.env.CLIENT_ID;
            const CLIENT_SECRET = process.env.CLIENT_SECRET;
            if (!CLIENT_ID || !CLIENT_SECRET) {
                throw new Error('CLIENT_ID or CLIENT_SECRET is not defined');
            }
            const response = await fetch(`${AUTH_SERVER_URL}/connect/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    grant_type: 'client_credentials',
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                }),
            });
            const data = await response.json();
            token = data?.access_token;
            if (!token) {
                throw new Error('Failed to get access token');
            }
            const expiresIn = data?.expires_in;
            await redis.setex('access_token', expiresIn, token);
        }
        return token;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const verifyTurnstileToken = async (token: string) => {
    try {
        const requestBody = {
            secret: process.env.CLOUDFLARE_SECRET_KEY,
            response: token,
        }
        const response = await fetch(`${process.env.CLOUDFLARE_CHALLENGE_URL}/turnstile/v0/siteverify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });
        const data = await response.json();
        if (!data?.success) {
            return { success: false, message: 'Failed to verify Turnstile token' };
        }
        return { success: true, message: 'Turnstile token verified' };
    } catch (error) {
        console.log(error);
        return { success: false, message: 'Failed to verify Turnstile token' };
    }
}

export {
    getAccessToken,
    verifyTurnstileToken
};

