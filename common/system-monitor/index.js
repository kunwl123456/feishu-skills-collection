const fs = require('fs');
const os = require('os');
const path = require('path');

/**
 * Get process count efficiently (Linux-specific /proc, fallback for others)
 */
function getProcessCount() {
    if (process.platform === 'linux') {
        try {
            // Count numeric directories in /proc
            const procDirs = fs.readdirSync('/proc');
            let count = 0;
            for (const file of procDirs) {
                if (/^\d+$/.test(file)) count++;
            }
            return count.toString();
        } catch (e) {
            return '?';
        }
    } else {
        // Fallback or not implemented for other OS
        return '?';
    }
}

/**
 * Get disk usage for root /
 */
function getDiskUsage(mountPoint = '/') {
    try {
        if (fs.statfsSync) {
            const stats = fs.statfsSync(mountPoint);
            const total = stats.blocks * stats.bsize;
            const free = stats.bfree * stats.bsize;
            const used = total - free;
            const percent = Math.round((used / total) * 100);
            return `${percent}%`;
        }
    } catch (e) {
        // Fallback
    }
    return '?';
}

/**
 * Get the last line of a file efficiently without reading the whole file
 */
function getLastLine(filePath) {
    if (!fs.existsSync(filePath)) return '';
    
    try {
        const stats = fs.statSync(filePath);
        const fileSize = stats.size;
        if (fileSize === 0) return '';
        
        const fd = fs.openSync(filePath, 'r');
        const bufferSize = Math.min(1024, fileSize);
        const buffer = Buffer.alloc(bufferSize);
        let position = fileSize - bufferSize;
        
        fs.readSync(fd, buffer, 0, bufferSize, position);
        fs.closeSync(fd);
        
        const content = buffer.toString();
        const lines = content.trim().split('\n');
        return lines[lines.length - 1] || '';
    } catch (e) {
        return '';
    }
}

module.exports = {
    getProcessCount,
    getDiskUsage,
    getLastLine
};
