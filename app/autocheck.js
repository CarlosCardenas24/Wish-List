import prisma from "./db.server";
const cron = require('node-cron');

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

    if(result){
        console.log(`${result.count} users deleted.`);
    } else {
        console.log('No users to delete')
    }
    
  } catch (error) {
    console.error('Error deleting old users:', error);
  }
});