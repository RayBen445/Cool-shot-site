import { type User, type InsertUser, type ContactInquiry, type InsertContactInquiry } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry>;
  getContactInquiries(): Promise<ContactInquiry[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contactInquiries: Map<string, ContactInquiry>;

  constructor() {
    this.users = new Map();
    this.contactInquiries = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createContactInquiry(insertInquiry: InsertContactInquiry): Promise<ContactInquiry> {
    const id = randomUUID();
    const inquiry: ContactInquiry = {
      ...insertInquiry,
      id,
      createdAt: new Date(),
    };
    this.contactInquiries.set(id, inquiry);
    return inquiry;
  }

  async getContactInquiries(): Promise<ContactInquiry[]> {
    return Array.from(this.contactInquiries.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export const storage = new MemStorage();
