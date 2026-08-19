const SystemLog = require("../models/systemlogs");

async function saveSystemLog(activity, description, status) {

    await SystemLog.create({
        activity,
        description,
        status
    });

    const totalLogs = await SystemLog.countDocuments();

    if (totalLogs > 20) {

        const oldLogs = await SystemLog.find()
            .sort({ createdAt: 1 })
            .limit(totalLogs - 20);

        await SystemLog.deleteMany({
            _id: {
                $in: oldLogs.map(log => log._id)
            }
        });

    }

}

module.exports = saveSystemLog;