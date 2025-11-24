import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Products router
  products: router({
    list: publicProcedure
      .input(z.object({ category: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return await db.getProducts(input?.category);
      }),
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getProductById(input);
      }),
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        price: z.string(),
        category: z.string().min(1),
        imageUrl: z.string().optional(),
        stock: z.number().default(0),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can create products' });
        }
        return await db.createProduct(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.string().optional(),
        category: z.string().optional(),
        imageUrl: z.string().optional(),
        stock: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can update products' });
        }
        const { id, ...updates } = input;
        return await db.updateProduct(id, updates);
      }),
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can delete products' });
        }
        return await db.deleteProduct(input);
      }),
  }),

  // Cart router
  cart: router({
    getItems: protectedProcedure
      .query(async ({ ctx }) => {
        const items = await db.getCartItems(ctx.user.id);
        const enriched = await Promise.all(
          items.map(async (item) => {
            const product = await db.getProductById(item.productId);
            return { ...item, product };
          })
        );
        return enriched;
      }),
    addItem: protectedProcedure
      .input(z.object({
        productId: z.number(),
        quantity: z.number().min(1),
      }))
      .mutation(async ({ input, ctx }) => {
        return await db.addToCart(ctx.user.id, input.productId, input.quantity);
      }),
    updateItem: protectedProcedure
      .input(z.object({
        id: z.number(),
        quantity: z.number().min(1),
      }))
      .mutation(async ({ input }) => {
        return await db.updateCartItem(input.id, input.quantity);
      }),
    removeItem: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return await db.removeFromCart(input);
      }),
    clear: protectedProcedure
      .mutation(async ({ ctx }) => {
        return await db.clearCart(ctx.user.id);
      }),
  }),

  // Orders router
  orders: router({
    create: protectedProcedure
      .input(z.object({
        totalAmount: z.string(),
        paymentMethod: z.enum(['cod', 'card']),
        customerName: z.string().min(1),
        customerEmail: z.string().email(),
        customerPhone: z.string().min(1),
        shippingAddress: z.string().min(1),
        items: z.array(z.object({
          productId: z.number(),
          productName: z.string(),
          quantity: z.number().min(1),
          price: z.string(),
        })),
      }))
      .mutation(async ({ input, ctx }) => {
        const { items, ...orderData } = input;
        const order = await db.createOrder({
          ...orderData,
          userId: ctx.user.id,
        });
        if (!order) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

        for (const item of items) {
          await db.createOrderItem({
            orderId: order.id,
            ...item,
          });
        }

        await db.clearCart(ctx.user.id);

        return order;
      }),
    getMyOrders: protectedProcedure
      .query(async ({ ctx }) => {
        return await db.getUserOrders(ctx.user.id);
      }),
    getById: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const order = await db.getOrderById(input);
        if (!order) throw new TRPCError({ code: 'NOT_FOUND' });
        return order;
      }),
    getItems: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getOrderItems(input);
      }),
    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can update order status' });
        }
        return await db.updateOrderStatus(input.id, input.status);
      }),
    getAllOrders: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Only admins can view all orders' });
        }
        return await db.getAllOrders();
      }),
  }),
});

export type AppRouter = typeof appRouter;
