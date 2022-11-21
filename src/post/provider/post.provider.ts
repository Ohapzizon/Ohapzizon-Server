import { DataSource } from 'typeorm';
import Post from '../../entities/post.entity';

export const postProvider = [
  {
    provide: 'POST_REPOSITORY',
    useFactory: async (dataSource: DataSource) =>
      await dataSource.getRepository(Post),
    inject: ['DATA_SOURCE'],
  },
];
