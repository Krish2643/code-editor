import { io } from 'socket.io-client';
// require('dotenv').config();

export const initSocket = async () => {
    const options = {
        'force new connection': true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
        transports: ['websocket', 'polling'],
    };
    return io(process.env.REACT_APP_BACKEND_URL || '/', options);
};