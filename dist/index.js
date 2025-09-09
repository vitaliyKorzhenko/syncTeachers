"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const node_cron_1 = __importDefault(require("node-cron"));
const SYNC_ENDPOINT = 'http://msg.slideedu.com:4040/sync-all-active-teachers';
const GOVORIKA_SYNC_ENDPOINT = 'http://msg.slideedu.com:4040/syncAPI/syncAllTeachersCustomersWithCalendar';
function syncTeachers() {
    return __awaiter(this, void 0, void 0, function* () {
        const startTime = Date.now();
        console.log('Starting teacher sync...', new Date().toISOString());
        try {
            const response = yield axios_1.default.post(SYNC_ENDPOINT);
            const endTime = Date.now();
            const duration = (endTime - startTime) / 1000; // Convert to seconds
            console.log('Sync completed successfully!', 'Duration:', duration, 'seconds');
            console.log('Response data:', response.data);
            console.log('----------------------------------------');
            return response.data ? response.data : 'Error during teacher sync';
        }
        catch (error) {
            console.log('Sync failed!', error);
            return 'Error during teacher sync';
        }
    });
}
function syncGovorikaTeachers() {
    return __awaiter(this, void 0, void 0, function* () {
        const startTime = Date.now();
        console.log('Starting Govorika teacher sync...', new Date().toISOString());
        try {
            const response = yield axios_1.default.post(GOVORIKA_SYNC_ENDPOINT, {
                limit: 350
            });
            const endTime = Date.now();
            const duration = (endTime - startTime) / 1000; // Convert to seconds
            console.log('Govorika sync completed successfully!', 'Duration:', duration, 'seconds');
            console.log('Response data:', response.data);
            console.log('----------------------------------------');
            return response.data ? response.data : 'Error during Govorika teacher sync';
        }
        catch (error) {
            console.log('Govorika sync failed!', error);
            return 'Error during Govorika teacher sync';
        }
    });
}
// Schedule the sync to run every hour
node_cron_1.default.schedule('0 * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('\nRunning scheduled teacher sync...', new Date().toISOString());
    try {
        let res = yield syncTeachers();
        console.log('Scheduled sync completed:', res);
    }
    catch (error) {
        console.error('Scheduled sync failed:', error);
    }
}));
// Schedule the Govorika sync to run every hour at 30 minutes
node_cron_1.default.schedule('30 * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('\nRunning scheduled Govorika teacher sync...', new Date().toISOString());
    try {
        let res = yield syncGovorikaTeachers();
        console.log('Scheduled Govorika sync completed:', res);
    }
    catch (error) {
        console.error('Scheduled Govorika sync failed:', error);
    }
}));
console.log('Scheduler started. Will sync teachers every hour at 00 minutes and Govorika teachers every hour at 30 minutes.');
