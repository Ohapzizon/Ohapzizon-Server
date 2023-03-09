import { DataSource } from 'typeorm';
import { DATA_SOURCE, POST_REPOSITORY } from '../../common/constants';
import Post from '../../entities/post.entity';

export const postProvider = [
  {
    provide: POST_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Post),
    inject: [DATA_SOURCE],
  },
];
