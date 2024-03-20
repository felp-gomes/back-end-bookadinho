import { prismaClient } from '../../infra/database/prisma/prisma.js';
import { ChatCreate } from './dtos/chat.dtos.js';

export class ChatUsecase {
  constructor() {}
  public async getAllChats(
    isGetAllChats: boolean,
    quantityBooks = 10,
    page = 0,
    filterStatus: 'open' | 'closed' | 'pending' | undefined
  ) {
    let search: undefined | string | { not: string } = isGetAllChats ? undefined : { not: 'closed' };
    if (filterStatus) {
      search = filterStatus;
    }
    try {
      return await prismaClient.chats.findMany({
        where: {
          status: search,
        },
        orderBy: {
          created_at: 'desc',
        },
        skip: quantityBooks * page,
        take: quantityBooks,
      });
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  public async createChats(data: { sender_id: string; receiver_id: string }) {
    try {
      const chatValidated = ChatCreate.safeParse(data);
      if (!chatValidated.success) throw chatValidated.error;
      return await prismaClient.chats.create({ data });
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private handleError(error: unknown) {
    console.debug('\x1b[31m[<<<---START ERROR--->>>]\x1b[0m');
    console.error(error);
    console.debug('\x1b[31m[<<<---END ERROR--->>>]\x1b[0m');
  }
}
