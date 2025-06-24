// socketUtils/logger.js
const getTimestamp = () => new Date().toISOString();

export const socketLogger = {
  serverStart: (port, corsConfig) => console.log(
    `\n🚀 [${getTimestamp()}] Socket.IO server running on port ${port}\n` +
    `   CORS: ${JSON.stringify(corsConfig)}\n`
  ),
  
  connection: (socketId) => console.log(
    `⚡ [${getTimestamp()}] New connection: ${socketId}`
  ),
  
  handlerSuccess: (socketId) => console.log(
    `✔  [${getTimestamp()}] Handlers registered for ${socketId}`
  ),
  
  handlerError: (socketId, error) => console.error(
    `✖  [${getTimestamp()}] Handler error (${socketId}): ${error.message}\n` +
    `   Stack: ${error.stack || 'Not available'}`
  ),
  
  disconnect: (socketId, reason) => console.log(
    `❌ [${getTimestamp()}] Disconnected: ${socketId} (Reason: ${reason})`
  ),
  
  networkEvent: (event, socketId, data = '') => console.log(
    `📶 [${getTimestamp()}] ${event} from ${socketId} ${data}`
  ),
  
  connectionError: (error) => console.error(
    `⚠ [${getTimestamp()}] Connection error:\n` +
    `   Message: ${error.message}\n` +
    `   Stack: ${error.stack || 'Not available'}`
  ),
  
  shutdown: () => console.log('\n🛑 Shutting down gracefully...')
};