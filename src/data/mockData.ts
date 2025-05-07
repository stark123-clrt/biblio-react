import { User, Category, Book, Comment, Note, ReadingProgress } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    isAdmin: true,
    createdAt: '2023-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    username: 'user',
    email: 'user@example.com',
    password: 'user123',
    isAdmin: false,
    createdAt: '2023-01-02T00:00:00.000Z',
  },
];

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Biblical Studies',
  },
  {
    id: '2',
    name: 'Christian Living',
  },
  {
    id: '3',
    name: 'Theology',
  },
  {
    id: '4',
    name: 'Devotionals',
  },
  {
    id: '5',
    name: 'Ministry',
  },
];

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'Mere Christianity',
    description: 'C.S. Lewis\'s exploration of the common ground upon which all of those of Christian faith stand together.',
    categoryId: '3',
    filePath: '/books/mere-christianity.pdf',
    coverImage: 'https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    author: 'C.S. Lewis',
    publicationYear: 1952,
    pageCount: 227,
    createdAt: '2023-01-10T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'The Purpose Driven Life',
    description: 'A 40-day spiritual journey that will help you understand why you are alive and God\'s amazing plan for you—both here and now, and for eternity.',
    categoryId: '2',
    filePath: '/books/purpose-driven-life.pdf',
    coverImage: 'https://images.pexels.com/photos/5834/nature-grass-leaf-green.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    author: 'Rick Warren',
    publicationYear: 2002,
    pageCount: 368,
    createdAt: '2023-02-15T00:00:00.000Z',
  },
  {
    id: '3',
    title: 'Knowing God',
    description: 'J.I. Packer\'s classic work on the knowledge of God.',
    categoryId: '3',
    filePath: '/books/knowing-god.pdf',
    coverImage: 'https://images.pexels.com/photos/267573/pexels-photo-267573.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    author: 'J.I. Packer',
    publicationYear: 1973,
    pageCount: 286,
    createdAt: '2023-03-20T00:00:00.000Z',
  },
  {
    id: '4',
    title: 'My Utmost for His Highest',
    description: 'A classic devotional by Oswald Chambers.',
    categoryId: '4',
    filePath: '/books/my-utmost-for-his-highest.pdf',
    coverImage: 'https://images.pexels.com/photos/695644/pexels-photo-695644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    author: 'Oswald Chambers',
    publicationYear: 1935,
    pageCount: 416,
    createdAt: '2023-04-05T00:00:00.000Z',
  },
  {
    id: '5',
    title: 'Celebration of Discipline',
    description: 'A guide to spiritual disciplines for the Christian life.',
    categoryId: '2',
    filePath: '/books/celebration-of-discipline.pdf',
    coverImage: 'https://images.pexels.com/photos/6772103/pexels-photo-6772103.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    author: 'Richard Foster',
    publicationYear: 1978,
    pageCount: 256,
    createdAt: '2023-05-12T00:00:00.000Z',
  },
  {
    id: '6',
    title: 'Desiring God',
    description: 'A classic meditation on the Christian pursuit of happiness in God.',
    categoryId: '3',
    filePath: '/books/desiring-god.pdf',
    coverImage: 'https://images.pexels.com/photos/3764014/pexels-photo-3764014.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    author: 'John Piper',
    publicationYear: 1986,
    pageCount: 368,
    createdAt: '2023-06-18T00:00:00.000Z',
  },
];

export const mockComments: Comment[] = [
  {
    id: '1',
    userId: '2',
    username: 'user',
    bookId: '1',
    commentText: 'A life-changing book that helped me understand Christianity on a deeper level.',
    rating: 5,
    isValidated: true,
    createdAt: '2023-06-20T00:00:00.000Z',
  },
  {
    id: '2',
    userId: '2',
    username: 'user',
    bookId: '2',
    commentText: 'This book helped me find purpose and meaning in my life.',
    rating: 4,
    isValidated: true,
    createdAt: '2023-07-15T00:00:00.000Z',
  },
  {
    id: '3',
    userId: '2',
    username: 'user',
    bookId: '3',
    commentText: 'Deep theological insights that challenged my thinking.',
    rating: 5,
    isValidated: true,
    createdAt: '2023-08-10T00:00:00.000Z',
  },
  {
    id: '4',
    userId: '2',
    username: 'user',
    bookId: '4',
    commentText: 'A beautiful devotional that starts my day right.',
    rating: 5,
    isValidated: false,
    createdAt: '2023-09-05T00:00:00.000Z',
  },
];

export const mockNotes: Note[] = [
  {
    id: '1',
    userId: '2',
    bookId: '1',
    noteText: 'Important point about moral law.',
    pageNumber: 32,
    createdAt: '2023-06-25T00:00:00.000Z',
  },
  {
    id: '2',
    userId: '2',
    bookId: '1',
    noteText: 'The trilemma argument is very compelling.',
    pageNumber: 54,
    createdAt: '2023-06-26T00:00:00.000Z',
  },
  {
    id: '3',
    userId: '2',
    bookId: '2',
    noteText: 'Five purposes of life: worship, fellowship, discipleship, ministry, and mission.',
    pageNumber: 55,
    createdAt: '2023-07-20T00:00:00.000Z',
  },
];

export const mockReadingProgress: ReadingProgress[] = [
  {
    id: '1',
    userId: '2',
    bookId: '1',
    currentPage: 65,
    lastRead: '2023-06-30T00:00:00.000Z',
  },
  {
    id: '2',
    userId: '2',
    bookId: '2',
    currentPage: 120,
    lastRead: '2023-07-25T00:00:00.000Z',
  },
];