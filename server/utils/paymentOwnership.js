import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Ensure a KopoKopo payment request belongs to the authenticated client.
 * @throws {Error} When payment is not found for this user
 */
export async function assertClientPaymentOwnership(paymentRequestId, clientId) {
  const paymentLog = await prisma.clientPaymentLog.findFirst({
    where: {
      kopokopoPaymentRequestId: paymentRequestId,
      clientId,
    },
    select: { id: true },
  });

  if (!paymentLog) {
    const err = new Error("Payment not found");
    err.code = "PAYMENT_NOT_FOUND";
    throw err;
  }

  return paymentLog;
}

/**
 * Ensure a KopoKopo payment request belongs to the authenticated fundi.
 * @throws {Error} When payment is not found for this user
 */
export async function assertFundiPaymentOwnership(paymentRequestId, fundiId) {
  const paymentLog = await prisma.paymentLog.findFirst({
    where: {
      kopokopoPaymentRequestId: paymentRequestId,
      fundiId,
    },
    select: { id: true },
  });

  if (!paymentLog) {
    const err = new Error("Payment not found");
    err.code = "PAYMENT_NOT_FOUND";
    throw err;
  }

  return paymentLog;
}
