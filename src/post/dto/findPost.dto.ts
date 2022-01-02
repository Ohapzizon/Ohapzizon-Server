import Post from '../../entities/post.entity';

export class FindPostDto {
  post: Post;
  peopleList: string[];
  author: string;
}
