function startCleanupLoop() {
    setInterval(() => {
        try {
            const before = process.memoryUsage().rss / 1024 / 1024;
            if (global.gc) global.gc();
            const after = process.memoryUsage().rss / 1024 / 1024;
            console.log(`🧹 Nettoyage mémoire : ${before.toFixed(1)}MB → ${after.toFixed(1)}MB`);
        } catch (e) {}
    }, 15 * 60 * 1000);
}

module.exports = { startCleanupLoop };
