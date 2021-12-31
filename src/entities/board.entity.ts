import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Post from './post.entity';

@Entity('board')
export default class Board {
  @PrimaryGeneratedColumn({ name: 'board_idx' })
  idx: number;

  @ManyToOne(() => Post, (post) => post.board)
  post: Post;
}
