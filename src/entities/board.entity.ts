import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Post from './post.entity';

@Entity('board')
export default class Board {
  @PrimaryGeneratedColumn({ name: 'board_idx' })
  board_idx: number;

  @ManyToOne(() => Post, (post) => post.board)
  @JoinColumn({ name: 'board_post' })
  post: Post;
}
