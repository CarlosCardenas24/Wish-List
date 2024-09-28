const cron = require('node-cron');
const prisma = require('./db.server');

//just to test and see if cron.schedule works
cron.schedule('*/30 * * * * *', () => {
    console.log('cron working every 30 seconds');
  });

cron.schedule('0 0 * * *', async () => {
  console.log('Running daily cleanup job');

  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  try {
    const result = await prisma.user.deleteMany({
      where: {
        updatedAt: {
          lt: threeMonthsAgo,
        },
      },
    });

    console.log(`${result.count} users deleted.`);
  } catch (error) {
    console.error('Error deleting old users:', error);
  }
});