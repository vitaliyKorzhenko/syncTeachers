import axios from 'axios';
import cron from 'node-cron';

const SYNC_ENDPOINT = 'http://msg.slideedu.com:4040/syncAPI/ua/syncAllTeachersCustomersWithCalendar';
const GOVORIKA_SYNC_ENDPOINT = 'http://msg.slideedu.com:4040/syncAPI/syncAllTeachersCustomersWithCalendar';

async function syncTeachers() {
    const startTime = Date.now();
    console.log('Starting teacher sync...', new Date().toISOString());
    
    try {
        const response = await axios.post(SYNC_ENDPOINT, {
            limit: 200
        });

        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000; // Convert to seconds
        
        console.log('Sync completed successfully!', 'Duration:', duration, 'seconds');
        console.log('Response data:', response.data);
        console.log('----------------------------------------');
        
        return response.data ? response.data : 'Error during teacher sync';
    } catch (error) {
        console.log('Sync failed!', error);
        return 'Error during teacher sync';
    }
}

async function syncGovorikaTeachers() {
    const startTime = Date.now();
    console.log('Starting Govorika teacher sync...', new Date().toISOString());
    
    try {
        const response = await axios.post(GOVORIKA_SYNC_ENDPOINT, {
            limit: 350
        });

        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000; // Convert to seconds
        
        console.log('Govorika sync completed successfully!', 'Duration:', duration, 'seconds');
        console.log('Response data:', response.data);
        console.log('----------------------------------------');
        
        return response.data ? response.data : 'Error during Govorika teacher sync';
    } catch (error) {
        console.log('Govorika sync failed!', error);
        return 'Error during Govorika teacher sync';
    }
}

// Schedule the sync to run every hour
cron.schedule('0 * * * *', async () => {
    console.log('\nRunning scheduled teacher sync...', new Date().toISOString());
    try {
       let res = await syncTeachers();
       console.log('Scheduled sync completed:', res);
    } catch (error) {
        console.error('Scheduled sync failed:', error);
    }
});

// Schedule the Govorika sync to run every hour at 30 minutes
cron.schedule('30 * * * *', async () => {
    console.log('\nRunning scheduled Govorika teacher sync...', new Date().toISOString());
    try {
       let res = await syncGovorikaTeachers();
       console.log('Scheduled Govorika sync completed:', res);
    } catch (error) {
        console.error('Scheduled Govorika sync failed:', error);
    }
});

console.log('Scheduler started. Will sync teachers every hour at 00 minutes and Govorika teachers every hour at 30 minutes.');
