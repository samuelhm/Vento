import transactions from '../controllers/transaction-controllers.js';
import * as transactionsSchema from '../schemas/transaction-schema.js';

async function transactionRoutes(fastify, options) {
    fastify.post('/transactions',transactionsSchema.createTransactionSchema, transactions.createTransaction);
}

export default transactionRoutes;