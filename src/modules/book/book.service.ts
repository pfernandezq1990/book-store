import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Status } from '../../share/entity-status.enum';
import { In } from 'typeorm';
import { Role } from '../role/entities';
import { RoleType } from '../role/role.type.enum';
import { User } from '../user/entities';
import { UserRepository } from '../user/user.repository';
import { BookRepository } from './book.repository';
import { CreateBookDto, ReadBookDto, UpdateBookDto } from './dtos';
import { Book } from './entities/book.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookRepository)
    private readonly _bookRepository: BookRepository,
    @InjectRepository(UserRepository)
    private readonly _userRepository: UserRepository,
  ) {}

  // Get a book by Id
  async get(bookId: number): Promise<ReadBookDto> {
    if (!bookId) {
      throw new BadRequestException('bookId must be sent');
    }

    const book: Book = await this._bookRepository.findOne(bookId, {
      where: { status: Status.ACTIVE },
    });

    if (!book) {
      throw new NotFoundException('Book does not found');
    }

    return plainToClass(ReadBookDto, book);
  }

  //  Get all Books
  async getAll(): Promise<ReadBookDto[]> {
    const books: Book[] = await this._bookRepository.find({
      where: { status: Status.ACTIVE },
    });

    return books.map((book) => plainToClass(ReadBookDto, book));
  }

  //  Get book by author
  async getBookByAuthor(authorId: number): Promise<ReadBookDto[]> {
    if (!authorId) {
      throw new BadRequestException('Author id must be sent');
    }

    const books: Book[] = await this._bookRepository.find({
      where: { status: Status.ACTIVE, authors: In([authorId]) },
    });

    return books.map((book) => plainToClass(ReadBookDto, book));
  }

  //  Create a book
  async create(book: Partial<CreateBookDto>): Promise<ReadBookDto> {
    const authors: User[] = [];

    for (const authorId of book.authors) {
      const authorExist = await this._userRepository.findOne(authorId, {
        where: { status: Status.ACTIVE },
      });

      if (!authorExist) {
        throw new NotFoundException(
          'There is not an author whith this id: ${authorId}',
        );
      }

      const isAuthor = authorExist.roles.some(
        (role: Role) => role.name === RoleType.AUTHOR,
      );

      if (!isAuthor) {
        throw new UnauthorizedException(
          'This user ${authorId} is not an author',
        );
      }

      authors.push(authorExist);
    }

    const saveBook: Book = await this._bookRepository.save({
      name: book.name,
      description: book.description,
      authors,
    });

    return plainToClass(ReadBookDto, saveBook);
  }

  //  Create book by author
  async createByAuthor(book: Partial<CreateBookDto>, authorId: number) {
    const author: User = await this._userRepository.findOne(authorId, {
      where: { status: Status.ACTIVE },
    });

    if (!author) {
      throw new NotFoundException('This author ${author} does not exist');
    }

    const isAuthor = author.roles.some(
      (role: Role) => role.name === RoleType.AUTHOR,
    );

    if (!isAuthor) {
      throw new UnauthorizedException('This user ${author} is not an author');
    }

    const savedBook: Book = await this._bookRepository.save({
      name: book.name,
      description: book.description,
      author,
    });

    return plainToClass(ReadBookDto, savedBook);
  }

  //  Update book
  async update(
    bookId: number,
    book: Partial<UpdateBookDto>,
    authorId: number,
  ): Promise<ReadBookDto> {
    const bookExist: Book = await this._bookRepository.findOne(bookId, {
      where: { status: Status.ACTIVE },
    });

    if (!bookExist) {
      throw new NotFoundException('This book does not exits');
    }

    const isOwnBook = bookExist.authors.some(
      (author) => author.id === authorId,
    );

    if (!isOwnBook) {
      throw new UnauthorizedException('This user is not the books author');
    }

    bookExist.name = book.name;
    bookExist.description = book.description;
    await this._bookRepository.update(bookId, bookExist);

    return plainToClass(ReadBookDto, bookExist);
  }

  //  Delete book
  async delete(bookId: number): Promise<void> {
    const bookExist = await this._bookRepository.findOne(bookId, {
      where: { status: Status.ACTIVE },
    });

    if (!bookExist) {
      throw new NotFoundException('This book does not exist');
    }

    await this._bookRepository.update(bookId, { status: 'INACTIVE' });
  }
}
