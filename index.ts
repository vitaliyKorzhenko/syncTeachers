import axios from 'axios';
import cron from 'node-cron';

const SYNC_ENDPOINT = 'http://msg.slideedu.com:4040/sync-all-active-teachers';

async function syncTeachers() {
    const startTime = Date.now();
    console.log('Starting teacher sync...', new Date().toISOString());
    
    try {
        const response = await axios.post(SYNC_ENDPOINT);

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


console.log('Scheduler started. Will sync teachers every hour.');
