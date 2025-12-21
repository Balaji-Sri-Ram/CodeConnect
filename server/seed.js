const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Problem = require('./models/Problem');

dotenv.config({ path: path.resolve(__dirname, '../.env') });


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/codeconnect');
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const importData = async () => {
    await connectDB();

    try {
        // Read JSON file (Go up one level to src)
        const jsonPath = path.join(__dirname, '../src', 'Problems', 'final_500_real_problems_cleaned.json');
        const data = fs.readFileSync(jsonPath, 'utf-8');
        const problems = JSON.parse(data);

        // Clear existing problems
        await Problem.deleteMany();

        await Problem.insertMany(problems);

        console.log('Data Imported!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

importData();
