import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, products, cartItems, orders, orderItems, Product, CartItem, Order, OrderItem, InsertProduct, InsertCartItem, InsertOrder, InsertOrderItem } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ===== PRODUCT QUERIES =====
export async function getProducts(category?: string) {
  const db = await getDb();
  if (!db) return [];

  try {
    if (category) {
      return await db.select().from(products).where(eq(products.category, category));
    }
    return await db.select().from(products);
  } catch (error) {
    console.error("[Database] Failed to get products:", error);
    return [];
  }
}

export async function getProductById(id: number): Promise<Product | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get product:", error);
    return undefined;
  }
}

export async function createProduct(product: InsertProduct): Promise<Product | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const inserted = await db.insert(products).values(product).$returningId();
    if (inserted && inserted.length > 0) {
      const result = await getProductById(inserted[0].id);
      return result || null;
    }
    return null;
  } catch (error) {
    console.error("[Database] Failed to create product:", error);
    return null;
  }
}

export async function updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.update(products).set(updates).where(eq(products.id, id));
    const result = await getProductById(id);
    return result || null;
  } catch (error) {
    console.error("[Database] Failed to update product:", error);
    return null;
  }
}

export async function deleteProduct(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.delete(products).where(eq(products.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete product:", error);
    return false;
  }
}

// ===== CART QUERIES =====
export async function getCartItems(userId: number): Promise<CartItem[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(cartItems).where(eq(cartItems.userId, userId));
  } catch (error) {
    console.error("[Database] Failed to get cart items:", error);
    return [];
  }
}

export async function addToCart(userId: number, productId: number, quantity: number): Promise<CartItem | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    // Check if item already exists
    const existing = await db.select().from(cartItems).where(and(eq(cartItems.userId, userId), eq(cartItems.productId, productId))).limit(1);
    
    if (existing.length > 0) {
      // Update quantity
      await db.update(cartItems).set({ quantity: existing[0].quantity + quantity }).where(eq(cartItems.id, existing[0].id));
      const updated = await db.select().from(cartItems).where(eq(cartItems.id, existing[0].id)).limit(1);
      return updated.length > 0 ? updated[0] : null;
    } else {
      // Create new cart item
      const inserted = await db.insert(cartItems).values({ userId, productId, quantity }).$returningId();
      if (inserted && inserted.length > 0) {
        const newItem = await db.select().from(cartItems).where(eq(cartItems.id, inserted[0].id)).limit(1);
        return newItem.length > 0 ? newItem[0] : null;
      }
      return null;
    }
  } catch (error) {
    console.error("[Database] Failed to add to cart:", error);
    return null;
  }
}

export async function updateCartItem(id: number, quantity: number): Promise<CartItem | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, id));
    const updated = await db.select().from(cartItems).where(eq(cartItems.id, id)).limit(1);
    return updated.length > 0 ? updated[0] : null;
  } catch (error) {
    console.error("[Database] Failed to update cart item:", error);
    return null;
  }
}

export async function removeFromCart(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.delete(cartItems).where(eq(cartItems.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to remove from cart:", error);
    return false;
  }
}

export async function clearCart(userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to clear cart:", error);
    return false;
  }
}

// ===== ORDER QUERIES =====
export async function createOrder(order: InsertOrder): Promise<Order | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const inserted = await db.insert(orders).values(order).$returningId();
    if (inserted && inserted.length > 0) {
      const result = await getOrderById(inserted[0].id);
      return result || null;
    }
    return null;
  } catch (error) {
    console.error("[Database] Failed to create order:", error);
    return null;
  }
}

export async function getOrderById(id: number): Promise<Order | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get order:", error);
    return undefined;
  }
}

export async function getUserOrders(userId: number): Promise<Order[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get user orders:", error);
    return [];
  }
}

export async function getAllOrders(): Promise<Order[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get all orders:", error);
    return [];
  }
}

export async function updateOrderStatus(id: number, status: string): Promise<Order | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.update(orders).set({ status: status as any }).where(eq(orders.id, id));
    const result = await getOrderById(id);
    return result || null;
  } catch (error) {
    console.error("[Database] Failed to update order status:", error);
    return null;
  }
}

export async function createOrderItem(item: InsertOrderItem): Promise<OrderItem | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const inserted = await db.insert(orderItems).values(item).$returningId();
    if (inserted && inserted.length > 0) {
      const newItem = await db.select().from(orderItems).where(eq(orderItems.id, inserted[0].id)).limit(1);
      return newItem.length > 0 ? newItem[0] : null;
    }
    return null;
  } catch (error) {
    console.error("[Database] Failed to create order item:", error);
    return null;
  }
}

export async function getOrderItems(orderId: number): Promise<OrderItem[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  } catch (error) {
    console.error("[Database] Failed to get order items:", error);
    return [];
  }
}

